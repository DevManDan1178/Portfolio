cmake_minimum_required(VERSION 3.16)

project(Api
    VERSION 1.0
    LANGUAGES CXX
)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_subdirectory(
    ../../libraries/server-simple
    ${CMAKE_BINARY_DIR}/server-simple
)

add_executable(api
    src/main.cpp
)

target_compile_features(api PRIVATE cxx_std_20)

target_link_libraries(api PRIVATE
    server-simple::server-simple
)

target_include_directories(api PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)