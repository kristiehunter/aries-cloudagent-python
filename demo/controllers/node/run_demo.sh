#!/bin/bash

#######################
#    PORT MAPPINGS    #
#                     #
#  Faber Agent:       #
#  8050:8058          #
#  Faber Controller:  #
#  5000               #
#  Alice Agent:       #
#  8060:8068          #
#  Alice Controller:  #
#  5001               #
#######################

# Step 1: Build the General Agent and Node Controller docker images
echo "-------- Building Docker Images -------- "
docker build . -t node_server:0.1
docker build ../../.. -t faber-alice-demo-general -f ../../../docker/Dockerfile.demo || exit 1

# Step 2: Run 2 instances of each image for Alice and Faber
DOCKER_ENV="-e LOG_LEVEL=${LOG_LEVEL} -e RUNMODE=docker -e DOCKERHOST=192.168.65.3"

echo "-------- Running Faber Agent Container -------- "
set -x
docker run --name faber_agent -d --rm -it \
	-p 0.0.0.0:8050-8058:8050-8058 \
	-v "/$(pwd)/../logs:/home/indy/logs" \
	$DOCKER_ENV \
	faber-alice-demo-general general --port 8050
set +x

echo "-------- Running Alice Agent Container -------- "
set -x
docker run --name alice_agent -d --rm -it \
	-p 0.0.0.0:8060-8068:8060-8068 \
	-v "/$(pwd)/../logs:/home/indy/logs" \
	$DOCKER_ENV \
	faber-alice-demo-general general --port 8060
set +x

echo "-------- Running Faber Node Controller -------- "
set -x
docker run --name faber_controller -d --rm -it \
    -p 0.0.0.0:5000:5000 -e PORT=5000 -e DOCKERHOST=192.168.65.3 \
    -e AGENT_URL=http://192.168.65.3:8051 node_server:0.1
set +x

echo "-------- Running Alice Node Controller -------- "
set -x
docker run --name alice_controller -d --rm -it \
    -p 0.0.0.0:5001:5001 -e PORT=5001 -e DOCKERHOST=192.168.65.3 \
    -e AGENT_URL=http://192.168.65.3:8061 node_server:0.1
set +x

sleep 5

# Step 3: Register the external controller webhooks with the Cloud Agents
curl -X POST -H "Content-Type: application/json" http://0.0.0.0:5000/api/agent/webhook 
curl -X POST -H "Content-Type: application/json" http://0.0.0.0:5001/api/agent/webhook 
