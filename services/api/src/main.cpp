#include <iostream>
#include <algorithm>
#include <atomic>
#include <csignal>
#include <iostream>
#include <thread>
#include <chrono>
#include <cassert>

#include "server/portfolio_server.hpp"
#include "environment/env_loader.hpp"


portfolio_server* server_instance = nullptr;

void shutdown_handler(int)
{
    if (server_instance)
    {
        server_instance->save();
        server_instance->stop();
    }
}


int main() {
    env_loader::load_env_file();
    log_debug() << "env loaded";
    
    std::atomic<bool> running(true);
    try {
        portfolio_server server(8080);
        server_instance = &server;
        log_debug() << "Server created";
        std::signal(SIGINT, shutdown_handler);   
        std::signal(SIGTERM, shutdown_handler);
        log_debug() << "Server Loaded";
        server.launch();
        log_debug() << "Server launched";
        server.join_context_thread();
    } catch (const std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }
    
    return 0;
}