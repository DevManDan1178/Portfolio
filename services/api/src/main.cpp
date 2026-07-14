#include <iostream>
#include <algorithm>
#include <atomic>
#include <csignal>
#include <iostream>
#include <thread>
#include <chrono>
#include <cassert>

#include "server/portfolio_server.hpp"



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
    std::atomic<bool> running(true);
    try {
        log_debug() << "Starting echo server on port 8080...\n";
        portfolio_server server(8080);
        server_instance = &server;
        std::signal(SIGINT, shutdown_handler);   
        std::signal(SIGTERM, shutdown_handler);
        server.launch();
        server.join_context_thread();
    } catch (const std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }
    
    return 0;
}