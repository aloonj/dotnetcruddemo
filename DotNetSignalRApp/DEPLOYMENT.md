# Kubernetes Deployment Guide

This guide explains how to deploy the Real-Time CRUD Dashboard application to Kubernetes.

## Prerequisites

- Kubernetes cluster (local or cloud)
- Docker installed
- kubectl configured
- NGINX Ingress Controller (optional, for external access)

## Architecture

The application consists of two main components:

1. **SignalR API**: .NET 8 Web API with SignalR hub
2. **React Frontend**: Static React app served by NGINX

## Quick Deployment

### 1. Build Docker Images

Build the API image:
```bash
docker build -t signalr-api:latest .
```

Build the Frontend image:
```bash
cd react-signalr-app
docker build -t signalr-frontend:latest .
cd ..
```

### 2. Deploy to Kubernetes

Deploy using Kustomize (recommended):
```bash
kubectl apply -k k8s/
```

Or deploy individual manifests:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### 3. Verify Deployment

Check pods status:
```bash
kubectl get pods -n signalr-app
```

Check services:
```bash
kubectl get services -n signalr-app
```

Check ingress:
```bash
kubectl get ingress -n signalr-app
```

## Configuration

### Environment Variables

The application uses the following environment variables:

**API (.NET)**:
- `ASPNETCORE_ENVIRONMENT`: Set to "Production"
- `ASPNETCORE_URLS`: Set to "http://+:80"

**Frontend (React)**:
- `REACT_APP_API_URL`: API endpoint URL
- `REACT_APP_SIGNALR_URL`: SignalR hub URL

### ConfigMap

Environment variables are managed through the ConfigMap in `k8s/configmap.yaml`. Update values as needed for your environment.

## Accessing the Application

### Local Development (Port Forward)

Forward the frontend service:
```bash
kubectl port-forward -n signalr-app service/signalr-frontend-service 3000:80
```

Forward the API service:
```bash
kubectl port-forward -n signalr-app service/signalr-api-service 5000:80
```

Access the application at:
- Frontend: http://localhost:3000
- API/Swagger: http://localhost:5000/swagger

### External Access (Ingress)

If you have an Ingress Controller installed:

1. Update the host in `k8s/ingress.yaml` to your domain
2. Add the domain to your `/etc/hosts` file (for local testing):
   ```
   <INGRESS_IP> signalr-demo.local
   ```
3. Access the application at: http://signalr-demo.local

## Scaling

Scale the API deployment:
```bash
kubectl scale deployment signalr-api -n signalr-app --replicas=3
```

Scale the frontend deployment:
```bash
kubectl scale deployment signalr-frontend -n signalr-app --replicas=3
```

## Monitoring

View logs:
```bash
# API logs
kubectl logs -f deployment/signalr-api -n signalr-app

# Frontend logs
kubectl logs -f deployment/signalr-frontend -n signalr-app
```

## Troubleshooting

### Common Issues

1. **SignalR Connection Issues**:
   - Ensure WebSocket support is enabled in your ingress
   - Check proxy timeouts are set appropriately
   - Verify CORS configuration

2. **Image Pull Errors**:
   - Make sure images are built and tagged correctly
   - For remote registries, ensure proper image registry configuration

3. **Service Discovery**:
   - Verify service names match between deployments and configurations
   - Check that services are in the same namespace

### Debugging Commands

```bash
# Check pod status
kubectl describe pod <pod-name> -n signalr-app

# Check service endpoints
kubectl get endpoints -n signalr-app

# Check ingress details
kubectl describe ingress signalr-app-ingress -n signalr-app

# View events
kubectl get events -n signalr-app --sort-by=.metadata.creationTimestamp
```

## Production Considerations

1. **Resource Limits**: Adjust CPU and memory limits based on your workload
2. **Replicas**: Set appropriate replica counts for high availability
3. **Persistent Storage**: Consider if you need persistent volumes for data
4. **SSL/TLS**: Use the TLS-enabled ingress for production deployments
5. **Monitoring**: Implement proper monitoring and alerting
6. **Security**: Review security contexts and network policies

## Clean Up

Remove the entire application:
```bash
kubectl delete namespace signalr-app
```

Or remove individual components:
```bash
kubectl delete -k k8s/
```