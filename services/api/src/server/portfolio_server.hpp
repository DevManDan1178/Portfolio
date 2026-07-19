#pragma once
#include <string_view>
#include <format>
#include <stdexcept>
#include <filesystem>
#include <optional>
#include <tuple>
#include <array>

#include "data_structures/global_boards/score_stream.hpp"
#include "storage/file_helper.hpp"
#include "network/security/rate_limiter.hpp"
#include "network/communication/http_parser.hpp"
#include "data_structures/thread_safe/thread_safe_unordered_map.hpp"
#include "data_structures/global_boards/leaderboard.hpp"
#include "data_structures/global_boards/nameboard.hpp"
#include "network/servers/request_server_base.hpp"


using int_score = uint32_t;

constexpr const char* INDEX_KEY = "index";
constexpr const char* INDEX_FROM_BOTTOM_KEY = "index_from_bottom";
constexpr const char* DELETED_INDEX_KEY = "deleted_index";


constexpr const size_t NAMEBOARD_MAX_LENGTHS = 10000;
constexpr const size_t LEADERBOARD_MAX_LENGTHS = 1000;

constexpr const char* GLOBAL_URLS_KEY = "global-urls";
constexpr const char* LEADERBOARDS_KEY = "leaderboards";
constexpr const char* NAMEBOARDS_KEY = "nameboards";
constexpr const char* SCORE_STREAMS_KEY = "score-streams";

constexpr const double INITIAL_RATE_TOKENS = 20;
constexpr const double RATE_REFILL_RATE = 1;

constexpr const double GET_REQUEST_COST = 1.0;
constexpr const double POST_REQUEST_COST = 3.0;

constexpr std::string_view GLOBAL_URLS_DIRECTORY = "/global-urls/";
constexpr std::string_view LEADERBOARDS_DIRECTORY = "/leaderboards/";
constexpr std::string_view NAMEBOARDS_DIRECTORY = "/nameboards/";
constexpr std::string_view SCORE_STREAMS_DIRECTORY = "/score-streams/";

constexpr std::string_view GLOBAL_BOARDS_FROM_BOTTOM_QUERY = "from-bottom=true";

constexpr std::array LEADERBOARDS_WITH_LOWEST_FIRST = {
    "stack-matching"
};

class portfolio_server : public request_server_base {
    private:
        std::string api_key;
        
        const std::filesystem::path DATA_DIRECTORY = std::filesystem::current_path() / "data";
        const std::filesystem::path PORTFOLIO_FILE = file_helper::get_file_path(DATA_DIRECTORY, "portfolio.json"); 
    protected:
        thread_safe_unordered_map<std::string, leaderboard<int_score>> leaderboards;
        thread_safe_unordered_map<std::string, nameboard> nameboards;
        thread_safe_unordered_map<std::string, score_stream<int_score>> score_streams;
        thread_safe_unordered_map<std::string, std::string> global_urls;

        thread_safe_unordered_map<std::string, rate_limiter> rate_limiters;
        

    public:
        portfolio_server(
            unsigned short port, 
            size_t worker_count = 4,
            double max_ip_rate_tokens = DEFAULT_MAX_IP_RATE_TOKENS, 
            double ip_token_refill_rate = DEFAULT_IP_TOKEN_REFILL_RATE
        ) : request_server_base(port, worker_count, max_ip_rate_tokens, ip_token_refill_rate) 
            {
            for (auto& key : LEADERBOARDS_WITH_LOWEST_FIRST) {
                leaderboards.try_emplace(key, file_helper::get_file_path(DATA_DIRECTORY, LEADERBOARDS_SUBDIRECTORY_NAME, key), LEADERBOARD_MAX_LENGTHS, false);
                log_debug() << key << " lb with highest first on false";
            }

            for (auto& key : {GLOBAL_URLS_KEY, LEADERBOARDS_KEY, NAMEBOARDS_KEY, SCORE_STREAMS_KEY}) {
                rate_limiters.try_emplace(key, INITIAL_RATE_TOKENS, RATE_REFILL_RATE);
            }

            load();
        }
 

    protected:
        locked_value<leaderboard<int_score>> get_leaderboard(const std::string& key) {
            return leaderboards.try_emplace_locked(key, file_helper::get_file_path(DATA_DIRECTORY, LEADERBOARDS_SUBDIRECTORY_NAME, key), LEADERBOARD_MAX_LENGTHS).first;
        }

        locked_value<nameboard> get_nameboard(const std::string& key) {      
            return nameboards.try_emplace_locked(key, file_helper::get_file_path(DATA_DIRECTORY, NAMEBOARDS_SUBDIRECTORY_NAME, key), NAMEBOARD_MAX_LENGTHS).first;
        }

        locked_value<score_stream<int_score>> get_score_stream(const std::string& key) {
            return score_streams.try_emplace_locked(key, file_helper::get_file_path(DATA_DIRECTORY, SCORE_STREAM_SUBDIRECTORY_NAME), LEADERBOARD_MAX_LENGTHS).first;
        }

        /**
         * @return [inserted idx, size, deleted idx]
         */
        std::tuple<int, int, int> add_leaderboard_entry(const std::string& key, const std::string& name, int_score score) {      
            auto lb = get_leaderboard(key);
            auto [inserted_idx, deleted_idx] = lb->submit_score(name, score);
            if (inserted_idx.has_value()) {
                return {
                    static_cast<int>(inserted_idx.value()), 
                    static_cast<int>(lb->size()),
                    deleted_idx.has_value() ? static_cast<int>(deleted_idx.value()) : -1
                };
            }
            return {-1, -1, static_cast<int>(lb->size())};
        }

        std::tuple<int, int> add_nameboard_entry(const std::string& key, const std::string& name) {
            auto nb = get_nameboard(key);
            std::optional<std::size_t> inserted_idx = nb->add_name(name);
            if (inserted_idx.has_value()) {
                return {static_cast<int>(inserted_idx.value()), static_cast<int>(nb->size())};
            }
            return {-1, static_cast<int>(nb->size())};
        }

        size_t add_score_stream_entry(const std::string& key, const std::string& name, int_score score) {
            auto ss = get_score_stream(key);
            ss->submit_score(name, score);
            return ss->size();
        }

        void set_response_body_as_added_index(boost_http_response& response, int index, int total_size, int deleted_idx = -1) {
            json result;
            result[INDEX_KEY] = index;
            result[INDEX_FROM_BOTTOM_KEY] = index >= 0 ? total_size - 1 - index : -1;
            if (deleted_idx >= 0) {
                result[DELETED_INDEX_KEY] = deleted_idx;
            }
            
            http_parser::set_response_json(response, result);
        }

        bool handle_nameboard_post(const std::string& key, const std::string& body, boost_http_response& response) {
            try {
                json data = json::parse(body);
                std::string name = data["name"].get<std::string>();
                auto [inserted_idx, total_size] = add_nameboard_entry(key, name);
                
                set_response_body_as_added_index(response, inserted_idx, total_size);
            }
            catch (const json::parse_error& e) {
                http_parser::set_response_bad_request(response, "Invalid JSON");
                return false;
            }
            catch (const json::exception& e) {
                http_parser::set_response_bad_request(response, "Invalid entry format");
                return false;
            }
            return true;
        }

        bool handle_leaderboard_post(const std::string& key, const std::string& body, boost_http_response& response) {
            try {
                json data = json::parse(body);
                std::string name = data["name"].get<std::string>();
                int_score score = data["score"].get<int_score>();
                auto [inserted_idx, total_size, deleted_idx] = add_leaderboard_entry(key, name, score);
                set_response_body_as_added_index(response, inserted_idx, total_size, deleted_idx);
            }
            catch (const json::parse_error& e) {
                http_parser::set_response_bad_request(response, "Invalid JSON");
                return false;
            }
            catch (const json::exception& e) {
                http_parser::set_response_bad_request(response, "Invalid entry format");
                return false;
            } 
            return true;
        }

        bool handle_score_stream_post(const std::string& key, const std::string& body, boost_http_response& response) {
            try {
                json data = json::parse(body);

                std::string name = data["name"].get<std::string>();
                int_score score = data["score"].get<int_score>();

                size_t score_stream_size = add_score_stream_entry(key, name, score);
                set_response_body_as_added_index(response, static_cast<int>(score_stream_size), static_cast<int>(score_stream_size));
            } catch (const json::parse_error& e) {
                http_parser::set_response_bad_request(response, "Invalid JSON");
                return false;
            } catch (const json::exception& e) {
                http_parser::set_response_bad_request(response, "Invalid entry format");
                return false;
            }

            return true;
        }

        void handle_post_request(const std::string client_ip, const boost_http_request& request, boost_http_response& response) {
            std::string target = std::string(request.target());
            auto query_pos = target.find('?');
            std::string path = target.substr(0, query_pos);

            const std::string& body = request.body();

 
            if (path.starts_with(GLOBAL_URLS_DIRECTORY)) {
                std::string url_key = path.substr(GLOBAL_URLS_DIRECTORY.size());
                global_urls.insert(url_key, body);

            } else if (path.starts_with(LEADERBOARDS_DIRECTORY)) {
                std::string leaderboard_key = path.substr(std::string(LEADERBOARDS_DIRECTORY).size());
                if (!handle_leaderboard_post(leaderboard_key, body, response)) {
                    return;
                }   
            
            } else if (path.starts_with(NAMEBOARDS_DIRECTORY)) {
                std::string nameboard_key = path.substr(std::string(NAMEBOARDS_DIRECTORY).size());
                if (!handle_nameboard_post(nameboard_key, body, response)) {
                    return;
                }
            
            } else if (path.starts_with(SCORE_STREAMS_DIRECTORY)) {
                std::string score_stream_key = path.substr(std::string(SCORE_STREAMS_DIRECTORY).size());
                if (!handle_score_stream_post(score_stream_key, body, response)) {
                    return;
                }

            } else {
                http_parser::set_response_not_found(response);
                return;
            }

            response.result(boost::beast::http::status::ok);
        }

        bool handle_leaderboard_get(const std::string& key, const std::string& body,  boost_http_response& response, bool from_bottom = false) {
            try {
                json data = http_parser::parse_query(body);
                int start = data["start"].get<int>();
                int end = data["end"].get<int>();
                if (start < 0 || end < 0) {
                    http_parser::set_response_bad_request(response, "Invalid start and end bounds");
                    return false;
                }
                auto lb = get_leaderboard(key);
                std::vector<leaderboard_entry<int_score>> entries = from_bottom ?
                    lb->get_range_from_bottom(size_t(start), size_t(end)) : 
                    lb->get_range_from_top(size_t(start), size_t(end));

                http_parser::set_response_json(response, json(entries));
            }
            catch (const json::parse_error& e) {
                http_parser::set_response_bad_request(response, "Invalid JSON");    
                return false;
            }
            catch (const json::exception& e) {
                http_parser::set_response_bad_request(response, "Invalid entry format");
                return false;
            } 
            return true;
        }

        bool handle_nameboard_get(const std::string& key, const std::string& query,  boost_http_response& response, bool from_bottom = false) {
            try {
                json data = http_parser::parse_query(query);
                int start = data["start"].get<int>();
                int end = data["end"].get<int>();
                if (start < 0 || end < 0) {
                    http_parser::set_response_bad_request(response, "Invalid start and end bounds");
                    return false;
                }

                auto nb = get_nameboard(key);
                std::vector<entry> entries = from_bottom ?
                    nb->get_in_range_from_bottom(size_t(start), size_t(end)) :
                    nb->get_in_range_from_top(size_t(start), size_t(end));
                response.body() = json(entries).dump();
            }
            catch (const json::parse_error& e) {
                http_parser::set_response_bad_request(response, "Invalid JSON");
                return false;
            }
            catch (const json::exception& e) {
                http_parser::set_response_bad_request(response, "Invalid entry format");            
                return false;
            } 
            return true;
        }

        bool handle_score_stream_get(const std::string& key, const std::string& query, boost_http_response& response, bool from_bottom = false) {
            try {
                json data = http_parser::parse_query(query);

                int start = data["start"].get<int>();
                int end = data["end"].get<int>();

                if (start < 0 || end < 0) {
                    http_parser::set_response_bad_request(
                        response,
                        "Invalid start and end bounds"
                    );
                    return false;
                }


                auto sb = get_score_stream(key);

                std::vector<score_stream_entry<int_score>> entries = from_bottom ? 
                    sb->get_in_range_from_bottom(size_t(start), size_t(end)) :
                    sb->get_in_range_from_top(size_t(start), size_t(end));

                http_parser::set_response_json(response, json(entries));
            }
            catch (const json::parse_error& e) {
                http_parser::set_response_bad_request(response, "Invalid JSON");
                return false;
            }
            catch (const json::exception& e) {
                http_parser::set_response_bad_request(response, "Invalid entry format");
                return false;
            }

            return true;
        }

        void handle_get_request(const std::string client_ip, const boost_http_request& request, boost_http_response& response) {
            std::string target = std::string(request.target());
            auto query_pos = target.find('?');
            std::string path = target.substr(0, query_pos);
            bool from_bottom = target.substr(query_pos + 1).find(GLOBAL_BOARDS_FROM_BOTTOM_QUERY) != std::string::npos;

            if (path.starts_with(GLOBAL_URLS_DIRECTORY)) {
                if (!consume_rate_limit(GLOBAL_URLS_KEY, client_ip, GET_REQUEST_COST, response)) {
                    return;
                }

                std::string url_key = path.substr(std::string(GLOBAL_URLS_DIRECTORY).size());

                try {
                    response.body() = global_urls.get(url_key);
                }
                catch (const std::exception& e) {
                    http_parser::set_response_not_found(response, "Key not found");
                    return;
                }

            } else if (path.starts_with(LEADERBOARDS_DIRECTORY)) {
                if (!consume_rate_limit(LEADERBOARDS_KEY, client_ip, GET_REQUEST_COST, response)) {
                    return;
                }

                std::string leaderboard_key = path.substr(std::string(LEADERBOARDS_DIRECTORY).size());

                if (!handle_leaderboard_get(leaderboard_key, target, response, from_bottom)) {
                    return;
                }

            } else if (path.starts_with(NAMEBOARDS_DIRECTORY)) {
                if (!consume_rate_limit(NAMEBOARDS_KEY, client_ip, GET_REQUEST_COST, response)) {
                    return;
                }

                std::string nameboard_key = path.substr(std::string(NAMEBOARDS_DIRECTORY).size());

                if (!handle_nameboard_get(nameboard_key, target, response, from_bottom)) {
                    return;
                }
            } else if (path.starts_with(SCORE_STREAMS_DIRECTORY)) {
                if (!consume_rate_limit(SCORE_STREAMS_KEY, client_ip, GET_REQUEST_COST, response)) {
                    return;
                }
                std::string score_stream_key = path.substr(std::string(SCORE_STREAMS_DIRECTORY).size());
                if (!handle_score_stream_get(score_stream_key, target, response, from_bottom)) {
                    return;
                }
            } else {
                http_parser::set_response_not_found(response);
                return;
            }

            response.result(boost::beast::http::status::ok);
        }

        virtual boost_http_response process_client_request(const std::string client_ip, const boost_http_request request) {
            boost_http_response response;
              
            if (!check_api_key(request)) {
                http_parser::set_response_unauthorized(response, "Invalid API key");
                response.prepare_payload();
                return response;
            }
            
            switch (request.method()) {
                case boost::beast::http::verb::get:
                    handle_get_request(client_ip, request, response);
                    break;

                case boost::beast::http::verb::post:
                    handle_post_request(client_ip, request, response);
                    break;
                default:    
                    break;
            }
            response.set(boost::beast::http::field::access_control_allow_origin, "*");
            response.set(boost::beast::http::field::access_control_allow_methods, "GET, POST, OPTIONS");
            response.set(
                boost::beast::http::field::access_control_allow_headers,
                "Content-Type, Authorization"
            );
            response.prepare_payload();
            return response;
        }

        bool check_api_key(const boost_http_request& request) {
            auto header = request.find("Authorization");

            if (header == request.end()) {
                return false;
            }

            std::string expected = "Bearer " + api_key;

            return header->value() == expected;
        }

        bool consume_rate_limit(
            const std::string& limiter_key,
            const std::string& client_ip,
            double cost,
            boost_http_response& response
        ) {
            auto limiter = rate_limiters.get_locked(limiter_key);
            if (!limiter) {
                std::cerr << "MISSING RATE LIMITER\n";
                throw std::runtime_error("Missing rate limiter");
            }

            if (!limiter->consume(client_ip, cost)) {
                http_parser::set_response_bad_request(response, "Rate limit exceeded");
                response.result(boost::beast::http::status::too_many_requests);
                return false;
            }

            return true;
        }

    public:

        void save() {
            log_debug() << "saving";
            json data;

            data[GLOBAL_URLS_KEY] = json::object();
            global_urls.for_each(
                [&](const auto& key, auto& value) {
                    data[GLOBAL_URLS_KEY][key] = value;
                }
            );

            data[LEADERBOARDS_KEY] = json::array();
            leaderboards.for_each(
                [&](const auto& key, auto& leaderboard) {
                    leaderboard.save();
                    data[LEADERBOARDS_KEY].push_back(key);
                }
            );


            data[NAMEBOARDS_KEY] = json::array();
            nameboards.for_each(
                [&](const auto& key, auto& nameboard) {
                    nameboard.save();
                    data[NAMEBOARDS_KEY].push_back(key);
                }
            );
            
            data[SCORE_STREAMS_KEY] = json::array();
            score_streams.for_each(
                [&](const auto& key, auto& score_stream) {
                    score_stream.save();
                    data[SCORE_STREAMS_KEY].push_back(key);
                }
            );

            std::ofstream out(PORTFOLIO_FILE);

            if (!out) {
                throw std::runtime_error("Unable to save portfolio");
            }

            out << data.dump(4);
        }
    protected:
        void load() {
            const char* key = std::getenv("API_KEY");
            
            if (!key) {
                throw std::runtime_error("Missing API_KEY");
            }

            api_key = key;

            std::ifstream in(PORTFOLIO_FILE);

            if (!in) {
                return; // first run, no data yet
            }
            log_debug() << "Parsing json";
            json data;
            in >> data;

            try {
                if (data.contains(LEADERBOARDS_KEY)) {
                for (const auto& item : data[LEADERBOARDS_KEY]) {

                        std::string key = item.get<std::string>();

                        leaderboards.try_emplace(
                            key,
                            file_helper::get_file_path(DATA_DIRECTORY, LEADERBOARDS_SUBDIRECTORY_NAME, key), 
                            LEADERBOARD_MAX_LENGTHS
                        );
                    }
                }


                if (data.contains(NAMEBOARDS_KEY)) {
                    for (const auto& item : data[NAMEBOARDS_KEY]) {

                        std::string key = item.get<std::string>();

                        nameboards.try_emplace(
                            key,
                            file_helper::get_file_path(DATA_DIRECTORY, NAMEBOARDS_SUBDIRECTORY_NAME, key), 
                            NAMEBOARD_MAX_LENGTHS
                        );
                    }
                }

                if (data.contains(SCORE_STREAMS_KEY)) {
                    for (const auto& item : data[SCORE_STREAMS_KEY]) {

                        std::string key = item.get<std::string>();

                        score_streams.try_emplace(
                            key,
                            file_helper::get_file_path(DATA_DIRECTORY, SCORE_STREAM_SUBDIRECTORY_NAME, key),
                            LEADERBOARD_MAX_LENGTHS
                        );
                    }
                }

                if (data.contains(GLOBAL_URLS_KEY)) {
                    for (auto& [key, item] : data[GLOBAL_URLS_KEY].items()) {
                        global_urls.insert(key, item);
                    }
                } 
            } catch (const std::exception& e) {
                log_debug() << "Error loading server : " << e.what();
            } 
        }
};