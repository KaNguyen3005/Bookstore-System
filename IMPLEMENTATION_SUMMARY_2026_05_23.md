# Implementation Summary - May 23, 2026

## Overview
Thêm frontend service vào Docker Compose stack và sửa lỗi schema validation trong backend.

## Changes Made

### 1. Frontend Service - Docker Compose Integration
**File: `docker-compose.yml`**
- Thêm service `frontend` chạy image `morex3/bookstore-frontend:latest`
- Frontend server chạy trên port `3000` (Nginx)
- Depends on `backend` service

### 2. Frontend API Configuration
**File: `frontend/src/services/axiosClient.ts`**
- Thay đổi từ hardcode `http://localhost:8080/bookstore/api/v1` 
- Sang sử dụng biến môi trường `VITE_API_BASE_URL`
- Fallback values cho development: `http://localhost:8080/bookstore/api/v1`

**File: `frontend/.env.example`**
```env
VITE_GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
VITE_API_BASE_URL="http://localhost:8080/bookstore/api/v1"
```

**File: `frontend/.env.local`**
```env
VITE_GOOGLE_CLIENT_ID="792560388634-ce149cikhu3i84tbim33rd01kvi9loih.apps.googleusercontent.com"
VITE_API_BASE_URL="http://localhost:8080/bookstore/api/v1"
```

### 3. Frontend Docker Image
**File: `frontend/Dockerfile`**
- Simplified runtime image (Nginx only, no build stage in container)
- Serve prebuilt `dist` folder
- Expose port 80 (mapped to 3000 in Compose)
- Production-ready with `nginx.conf` for SPA fallback

**File: `frontend/nginx.conf`**
- SPA routing support: `try_files $uri $uri/ /index.html`
- Static asset caching: `expires 1y` for `/assets/`

### 4. Backend Schema Fix
**File: `backend/bookstore/src/main/resources/init.sql`**
- Fixed `shipments` table schema
- Changed: `weight DOUBLE NULL` → `weight INT NULL`
- Matches JPA entity definition in `Shipment.java` (Integer type)

### 5. Docker Hub Images
All images rebuilt and pushed:
- `morex3/bookstore-backend:latest` (with schema correction)
- `morex3/bookstore-recommendation:latest`
- `morex3/bookstore-frontend:latest`

## Stack Architecture

```
┌─────────────────────────────────────────┐
│         Docker Compose Stack            │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (Nginx)                       │
│  └─ Port 3000                          │
│  └─ Image: morex3/bookstore-frontend   │
│                                         │
│  Backend (Spring Boot)                  │
│  └─ Port 8080                          │
│  └─ Image: morex3/bookstore-backend    │
│  └─ DB User: app (via grant script)    │
│                                         │
│  Recommendation Service (Python/Uvicorn)│
│  └─ Port 8000                          │
│  └─ Image: morex3/bookstore-recommendation│
│                                         │
│  MySQL 8.0                              │
│  └─ Port 3307 → 3306                   │
│  └─ Scripts: init.sql, seed.sql, grant │
│                                         │
│  Qdrant (Vector DB)                     │
│  └─ Port 6333                          │
│  └─ Image: qdrant/qdrant:latest       │
│                                         │
└─────────────────────────────────────────┘
```

## Database Security
- MySQL root user: only for container initialization
- Application (backend) uses: `app` user (via docker-app-grants.sql)
- No application code runs as root
- Grant script limits `app` to necessary tables only

## Quick Start
```bash
# Pull latest images
docker compose pull

# Start stack
docker compose up -d

# Check logs
docker compose logs backend    # Check for schema errors
docker compose logs frontend   # Check for Nginx errors

# Stop stack
docker compose down
```

## Verification
- Frontend UI: http://localhost:3000
- Backend API: http://localhost:8080/bookstore/api/v1
- Backend Swagger: http://localhost:8080/bookstore/swagger-ui.html
- Recommendation Service: http://localhost:8000
- Qdrant: http://localhost:6333

## Notes
1. Frontend API calls use `http://localhost:8080/bookstore/api/v1` (same origin as browser launch)
2. Backend CORS already configured to allow `localhost:5173` and related dev origins
3. MySQL schema now consistent between entity and init.sql (shipments.weight is INT)
4. All images pushed to Docker Hub under `morex3/` namespace

## Future Improvements
- Add environment variables for API base URL in docker-compose.yml
- Consider reverse proxy (Nginx) to serve frontend and proxy API on same port
- Add health checks for frontend service
- Implement CI/CD pipeline to rebuild images on source changes

