#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NONE='\033[0m'

MODE=$1

DOCKER_REPO="nvashinki/haredu_back_end"

source .env

echo -e "[${GREEN}START${NONE}] Building..... ${MODE}  ${NONE}"

echo "Logging in to Docker Hub..."
 docker login --username "$DOCKER_USERNAME"

if [ $? -ne 0 ]; then
    echo -e "[${RED}ERROR${NONE}] Docker Hub login failed"
    exit 1
fi

if [ "$MODE" = 'prod' ]; then
    echo -e "[${GREEN}Building production image...${NONE}]"
    docker build -t "$DOCKER_REPO:prod" . -f Dockerfile.prod
    docker push "$DOCKER_REPO:prod"
else
    echo -e "[${RED}ERROR${NONE}] Unknown mode: $MODE. Please specify 'prod' or 'staging'."
    exit 1
fi

echo -e "[${GREEN}DONE${NONE}] ${MODE} build and push successfully!"
