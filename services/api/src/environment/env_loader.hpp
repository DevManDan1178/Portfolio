#pragma once
#include <fstream>
#include <string>

namespace env_loader {
    void load_env_file() {
        std::ifstream file(".env");

        std::string line;
        while (std::getline(file, line)) {
            auto pos = line.find('=');

            if (pos == std::string::npos)
                continue;

            std::string key = line.substr(0, pos);
            std::string value = line.substr(pos + 1);

            setenv(key.c_str(), value.c_str(), 1);
        }
    }
}

