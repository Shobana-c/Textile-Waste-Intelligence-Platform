# TexCycle: Enterprise Cloud Deployment Guide

This guide explains how to package, deploy, and scale the **TexCycle Textile Waste Intelligence Platform** in containerized production environments on **Amazon Web Services (AWS)** and **Microsoft Azure**.

---

## 📦 Container Orchestration (Docker Compose)

The TexCycle platform is fully containerized. To build and run both the FastAPI backend and React frontend locally or in a single VM container, execute:

```bash
# Build and start services in the background
docker-compose up --build -d

# Verify running container states
docker-compose ps
```

* **Frontend Hub:** `http://localhost:3000`
* **Backend API Docs:** `http://localhost:8000/docs`

---

## ☁️ Option A: Deploying on Amazon Web Services (AWS)

For scaling and production resilience, the platform should be deployed using **AWS ECS (Elastic Container Service)** with **AWS Fargate** (serverless container execution).

### Step 1: Push Images to Amazon ECR (Elastic Container Registry)
Create repositories and push the Docker images:

```bash
# Log in to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag the backend
docker build -t texcycle-backend ./backend
docker tag texcycle-backend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/texcycle-backend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/texcycle-backend:latest

# Build and tag the frontend
docker build -t texcycle-frontend ./frontend
docker tag texcycle-frontend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/texcycle-frontend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/texcycle-frontend:latest
```

### Step 2: Set Up AWS RDS (PostgreSQL)
While development uses SQLite, production ECS tasks should hook into a managed database:
1. Provision an **Amazon RDS PostgreSQL** instance.
2. Configure security groups to allow traffic on port `5432` from the ECS tasks.
3. Keep database credentials in **AWS Secrets Manager**.

### Step 3: Define Tasks & Run Fargate Service
1. Create a task definition specifying the container images, CPU, and memory limits (e.g. 0.5 vCPU and 1 GB RAM).
2. Configure environment variables in the task definition (see table below).
3. Create an **Application Load Balancer (ALB)** to route port `80` (HTTP) and `443` (HTTPS) to the target ECS service.
4. Set up an ECS Service inside your VPC.

---

## ☁️ Option B: Deploying on Microsoft Azure

Azure App Service provides the fastest path to host containerized multi-container Web Apps using Docker Compose.

### Step 1: Push Images to Azure Container Registry (ACR)
```bash
# Log in to ACR
az acr login --name texcycleacr

# Tag and push images
docker tag texcycle-backend:latest texcycleacr.azurecr.io/backend:latest
docker push texcycleacr.azurecr.io/backend:latest

docker tag texcycle-frontend:latest texcycleacr.azurecr.io/frontend:latest
docker push texcycleacr.azurecr.io/frontend:latest
```

### Step 2: Provision Azure Database for PostgreSQL
1. Create a managed **Azure Database for PostgreSQL** flexible server.
2. Whitelist the Azure App Service outbound IPs in the server firewall rules.

### Step 3: Create App Service (Web App for Containers)
1. In the Azure Portal, create a **Web App for Containers** using the **Docker Compose** option.
2. Upload your production `docker-compose.yml` configured to point to ACR images.
3. Configure App Settings (environment variables) in the Azure configuration blade.

---

## ⚙️ Production Configuration & Environment Variables

| Variable | Recommended Production Value | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@rds-endpoint:5432/texcycle` | Connection string to RDS/Azure PostgreSQL |
| `SECRET_KEY` | `generate-a-strong-random-hex-key` | Token hash seed |
| `ALGORITHM` | `HS256` | JWT encoding algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Token expiration timeline |
| `ENV` | `production` | Enables/Disables debug logs and docs endpoints |

---

## 🔒 Security, Domains & SSL/TLS Setup

1. **SSL/TLS Certificates:** Set up **AWS Certificate Manager (ACM)** or Azure SSL binding to enforce HTTPS.
2. **CORS Headers:** Update backend `main.py` CORS origins to explicitly allow only the registered custom production domain name of your frontend.
3. **Database Backups:** Configure RDS/Azure PostgreSQL automated daily snapshots with a 7-day retention period.
