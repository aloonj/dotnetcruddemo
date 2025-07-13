#!/bin/bash

# Deploy SignalR application to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="signalr-app"

echo -e "${YELLOW}Deploying SignalR Application to Kubernetes...${NC}"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl is not installed or not in PATH${NC}"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}✗ Cannot connect to Kubernetes cluster${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Kubernetes cluster is accessible${NC}"

# Deploy using Kustomize if available
if command -v kubectl kustomize &> /dev/null; then
    echo -e "${YELLOW}Deploying using Kustomize...${NC}"
    kubectl apply -k k8s/
else
    echo -e "${YELLOW}Deploying individual manifests...${NC}"
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/api-deployment.yaml
    kubectl apply -f k8s/frontend-deployment.yaml
    kubectl apply -f k8s/ingress.yaml
fi

echo -e "${GREEN}✓ Manifests applied successfully${NC}"

# Wait for deployments to be ready
echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"

kubectl wait --for=condition=available --timeout=300s deployment/signalr-api -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/signalr-frontend -n $NAMESPACE

echo -e "${GREEN}✓ All deployments are ready${NC}"

# Show status
echo -e "${BLUE}Deployment Status:${NC}"
kubectl get pods -n $NAMESPACE
echo
kubectl get services -n $NAMESPACE
echo
kubectl get ingress -n $NAMESPACE

# Show access instructions
echo -e "${YELLOW}Access Instructions:${NC}"
echo -e "${BLUE}1. Port Forward (Local Access):${NC}"
echo "   Frontend: kubectl port-forward -n $NAMESPACE service/signalr-frontend-service 3000:80"
echo "   API:      kubectl port-forward -n $NAMESPACE service/signalr-api-service 5000:80"
echo
echo -e "${BLUE}2. Ingress (External Access):${NC}"
echo "   Update /etc/hosts with your ingress IP:"
echo "   <INGRESS_IP> signalr-demo.local"
echo "   Then access: http://signalr-demo.local"

# Check if ingress controller is available
INGRESS_CLASS=$(kubectl get ingressclass -o name 2>/dev/null | head -1)
if [ -z "$INGRESS_CLASS" ]; then
    echo -e "${YELLOW}⚠ No ingress controller detected. Install NGINX Ingress Controller for external access.${NC}"
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"