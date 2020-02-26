#!/bin/bash

# Step 1: Build container
docker build . -t node_server:0.1

# Step 2: Start container
docker run --name node_server --rm -p 0.0.0.0:5000:5000 -e DOCKERHOST=192.168.65.3 node_server:0.1