#include <iostream>
#include <atomic>
#include <csignal>
#include <thread>
#include <chrono>
#include <condition_variable>
#include <mutex>

#include "server/portfolio_server.hpp"
#include "environment/env_loader.hpp"

constexpr auto AUTOSAVE_INTERVAL = std::chrono::minutes(5);

std::atomic<bool> shutting_down(false);

std::atomic<bool> autosave_running(false);
std::thread autosave_thread;

std::condition_variable autosave_cv;
std::mutex autosave_mutex;


void shutdown_handler(int)
{
    shutting_down.store(true);
}


void start_autosave_thread(portfolio_server& server)
{
    autosave_running.store(true);

    autosave_thread = std::thread([&server]() {

        std::unique_lock<std::mutex> lock(autosave_mutex);

        while (autosave_running.load()) {
            if (autosave_cv.wait_for(
                lock, 
                AUTOSAVE_INTERVAL,
                [] {
                    return !autosave_running.load();
                })
            ) {
                break;
            }

            try {
                server.save();
                log_debug() << "Autosave complete";
            } catch (const std::exception& e) {
                std::cerr << "Autosave failed: " << e.what() << "\n";
            }
        }
        log_debug() << "Autosave thread stopped";
    });
}


void stop_autosave_thread() {
    autosave_running.store(false);
    autosave_cv.notify_all();

    if (autosave_thread.joinable()) {
        autosave_thread.join();
    }
}

int get_server_port() {
    const char* port_env = std::getenv("PORT");

    if (port_env == nullptr) {
        return 8080; 
    }

    try {
        return std::stoi(port_env);
    } catch (...) {
        return 8080;
    }
}

int main() {
    env_loader::load_env_file();

    log_debug() << "Environment loaded";

    try {
        int port = get_server_port();
        log_debug() << "Starting server on port " << port;
        portfolio_server server(port);

        std::signal(SIGINT, shutdown_handler);
        std::signal(SIGTERM, shutdown_handler);

        start_autosave_thread(server);
        server.launch();

        while (!shutting_down.load()) {
            std::this_thread::sleep_for(
                std::chrono::seconds(1)
            );
        }

        stop_autosave_thread();

        try {
            server.save();
        } catch (const std::exception& e) {
            std::cerr << "Final save failed: " << e.what() << "\n";
        }
        server.stop();
    } catch (const std::exception& e) {
        stop_autosave_thread();

        std::cerr << "Fatal exception: " << e.what() << "\n";
        return 1;
    }

    return 0;
}
