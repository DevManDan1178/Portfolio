#pragma once
#include <string_view>
#include <format>
#include <stdexcept>
#include "network/communication/http_parser.hpp"
#include "data_structures/thread_safe/thread_safe_unordered_map.hpp"
#include "data_structures/global_boards/leaderboard.hpp"
#include "data_structures/global_boards/nameboard.hpp"
#include "network/servers/request_server_base.hpp"

using int_score = uint32_t;

constexpr const char* PORTFOLIO_FILE = "data/portfolio.json";

constexpr const char* GLOBAL_URLS_KEY = "global_urls";
constexpr const char* LEADERBOARDS_KEY = "leaderboards";
constexpr const char* NAMEBOARDS_KEY = "nameboards";

constexpr std::string_view GLOBAL_URLS_DIRECTORY = "/global_urls/";
constexpr std::string_view LEADERBOARDS_DIRECTORY = "/leaderboards/";
constexpr std::string_view NAMEBOARDS_DIRECTORY = "/nameboards/";


class portfolio_server : public request_server_base {
    protected:
        thread_safe_unordered_map<std::string, leaderboard<int_score>> leaderboards;
        thread_safe_unordered_map<std::string, nameboard> nameboards;
        thread_safe_unordered_map<std::string, std::string> global_urls;

    public:
        portfolio_server(unsigned short port, size_t worker_count = 4) : request_server_base(port, worker_count) {}

        void save() {
            json data;

            data[GLOBAL_URLS_KEY] = json::object();
            global_urls.for_each(
                [&](const auto& key, auto& value) {
                    data[GLOBAL_URLS_KEY][key] = value;
                }
            );

            data[LEADERBOARDS_KEY] = json::array();
            leaderboards.for_each(
                [&](const auto& key, auto& board) {
                    board.save();
                    data[LEADERBOARDS_KEY].push_back(key);
                }
            );


            data[NAMEBOARDS_KEY] = json::array();
            nameboards.for_each(
                [&](const auto& key, auto& board) {
                    board.save();
                    data[NAMEBOARDS_KEY].push_back(key);
                }
            );

            std::ofstream out(PORTFOLIO_FILE);

            if (!out) {
                throw std::runtime_error("Unable to save portfolio");
            }

            out << data.dump(4);
        }
        
        void load() {
            std::ifstream in(PORTFOLIO_FILE);

            if (!in) {
                return; // first run, no data yet
            }

            json data;
            in >> data;


            if (data.contains(LEADERBOARDS_KEY)) {
                for (const auto& item : data[LEADERBOARDS_KEY]) {

                    std::string key = item.get<std::string>();

                    leaderboards.try_emplace(
                        key,
                        key
                    );
                }
            }


            if (data.contains(NAMEBOARDS_KEY)) {
                for (const auto& item : data[NAMEBOARDS_KEY]) {

                    std::string key = item.get<std::string>();

                    nameboards.try_emplace(
                        key,
                        key
                    );
                }
            }

            if (data.contains(GLOBAL_URLS_KEY)) {
                for (auto& [key, item] : data[GLOBAL_URLS_KEY].items()) {
                    global_urls.insert(key, item);
                }
            }
        }

    protected:
        locked_value<leaderboard<int_score>> get_leaderboard(const std::string& key) {
            return leaderboards.try_emplace_locked(key, key).first;
        }

        locked_value<nameboard> get_nameboard(const std::string& key) {
            return nameboards.try_emplace_locked(key, key).first;
        }

        void add_leaderboard_entry(const std::string& key, const std::string& name, int_score score) {      
            get_leaderboard(key)->submit_score(name, score);
        }

        void add_nameboard_entry(const std::string& key, const std::string& name) {
            get_nameboard(key)->add_name(name);
        }

        bool handle_nameboard_set(const std::string& key, const std::string& body, boost_http_response& response) {
            try {
                json data = json::parse(body);
                std::string name = data["name"].get<std::string>();
                add_nameboard_entry(key, name);
            }
            catch (const json::parse_error& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid JSON";
                return false;
            }
            catch (const json::exception& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid entry format";
                return false;
            }
            return true;
        }

        bool handle_leaderboard_set(const std::string& key, const std::string& body, boost_http_response& response) {
            try {
                json data = json::parse(body);
                std::string name = data["name"].get<std::string>();
                int_score score = data["score"].get<int_score>();
                add_leaderboard_entry(key, name, score);
            }
            catch (const json::parse_error& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid JSON";
                
                return false;
            }
            catch (const json::exception& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid entry format";
                
                return false;
            } 
            return true;
        }

        void handle_post_request(const boost_http_request& request, boost_http_response& response) {
            std::string path = std::string(request.target());
            const std::string& body = request.body();
            
            if (path.starts_with(GLOBAL_URLS_DIRECTORY)) {
                std::string url_key = path.substr(GLOBAL_URLS_DIRECTORY.size());
                global_urls.insert(url_key, body);
            } else if (path.starts_with(LEADERBOARDS_DIRECTORY)) {
                std::string leaderboard_key = path.substr(std::string(LEADERBOARDS_DIRECTORY).size());
                if (!handle_leaderboard_set(leaderboard_key, body, response)) {
                    return;
                }
            
            } else if (path.starts_with(NAMEBOARDS_DIRECTORY)) {
                std::string nameboard_key = path.substr(std::string(NAMEBOARDS_DIRECTORY).size());
                if (!handle_nameboard_set(nameboard_key, body, response)) {
                    return;
                }
                
            } else {
                response.result(boost::beast::http::status::not_found);
                response.body() = "404 Not Found";
                return;
            }

            response.result(boost::beast::http::status::ok);
            response.body() = "OK";
        }

        bool handle_leaderboard_get(const std::string& key, const std::string& body,  boost_http_response& response) {
            try {
                json data = http_parser::parse_query(body);
                int start = data["start"].get<int>();
                int end = data["end"].get<int>();
                if (start < 0 || end < 0) {
                    response.result(boost::beast::http::status::bad_request);
                    response.body() = "Invalid start and end bounds";
                    return false;
                }
                auto lb = get_leaderboard(key);
                std::vector<leaderboard_entry<int_score>> entries = lb->get_range_from_top(size_t(start), size_t(end));
                response.body() = json(entries).dump();
            }
            catch (const json::parse_error& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid JSON";
                
                return false;
            }
            catch (const json::exception& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid entry format";
                
                return false;
            } 
            return true;
        }

        bool handle_nameboard_get(const std::string& key, const std::string& query,  boost_http_response& response) {
            try {
                json data = http_parser::parse_query(query);
                int start = data["start"].get<int>();
                int end = data["end"].get<int>();
                if (start < 0 || end < 0) {
                    response.result(boost::beast::http::status::bad_request);
                    response.body() = "Invalid start and end bounds";
                    return false;
                }

                auto nb = get_nameboard(key);
                std::vector<entry> entries = nb->get_in_bounds(size_t(start), size_t(end));
                response.body() = json(entries).dump();
            }
            catch (const json::parse_error& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid JSON";
                
                return false;
            }
            catch (const json::exception& e) {
                response.result(boost::beast::http::status::bad_request);
                response.body() = "Invalid entry format";
                
                return false;
            } 
            return true;
        }

        void handle_get_request(const boost_http_request& request, boost_http_response& response) {
            std::string target = std::string(request.target());
            auto query_pos = target.find('?');
            std::string path = target.substr(0, query_pos);

            if (path.starts_with(GLOBAL_URLS_DIRECTORY)) {
                std::string url_key = path.substr(std::string(GLOBAL_URLS_DIRECTORY).size());
                response.body() = global_urls.get(url_key);
            }  else if (path.starts_with(LEADERBOARDS_DIRECTORY)) {
                std::string leaderboard_key = path.substr(std::string(LEADERBOARDS_DIRECTORY).size());
                if (!handle_leaderboard_get(leaderboard_key, target, response)) {
                    return;
                }
            } else if (path.starts_with(NAMEBOARDS_DIRECTORY)) {
                std::string nameboard_key = path.substr(std::string(NAMEBOARDS_DIRECTORY).size());
                if (!handle_nameboard_get(nameboard_key, target, response)) {
                    return;
                }   
            } else {
                response.result(boost::beast::http::status::not_found);
                response.body() = "404 Not Found";
            }

            response.result(boost::beast::http::status::ok);
        }

        virtual boost_http_response process_client_request(const boost_http_request request) {
            boost_http_response response;
            response.set(boost::beast::http::field::content_type, "text/plain");
            switch (request.method()) {
                case boost::beast::http::verb::get:
                    handle_get_request(request, response);
                    break;

                case boost::beast::http::verb::post:
                    handle_post_request(request, response);
                    break;

                default:
                
                    break;
            }
            response.prepare_payload();
            return response;
        }
};