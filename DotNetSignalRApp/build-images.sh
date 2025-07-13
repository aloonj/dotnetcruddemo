#!/bin/bash

# Build Docker images for the SignalR application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building SignalR Application Docker Images...${NC}"

# Build API image
echo -e "${YELLOW}Building API image...${NC}"
docker build -t signalr-api:latest .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API image built successfully${NC}"
else
    echo -e "${RED}✗ Failed to build API image${NC}"
    exit 1
fi

# Build Frontend image
echo -e "${YELLOW}Building Frontend image...${NC}"
cd react-signalr-app
docker build -t signalr-frontend:latest .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend image built successfully${NC}"
else
    echo -e "${RED}✗ Failed to build Frontend image${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}All images built successfully!${NC}"

# List built images
echo -e "${YELLOW}Built images:${NC}"
docker images | grep -E "(signalr-api|signalr-frontend)"

# Optional: Tag for registry
read -p "Do you want to tag images for a registry? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter registry URL (e.g., your-registry.com/namespace): " REGISTRY
    if [ ! -z "$REGISTRY" ]; then
        docker tag signalr-api:latest $REGISTRY/signalr-api:latest
        docker tag signalr-frontend:latest $REGISTRY/signalr-frontend:latest
        echo -e "${GREEN}Images tagged for registry: $REGISTRY${NC}"
        
        read -p "Push to registry? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker push $REGISTRY/signalr-api:latest
            docker push $REGISTRY/signalr-frontend:latest
            echo -e "${GREEN}Images pushed to registry!${NC}"
        fi
    fi
fi