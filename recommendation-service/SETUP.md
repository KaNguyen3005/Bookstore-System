# 🔧 Setup Guide - KaTiLa AI Recommender Service

Complete setup instructions for the Hybrid Recommendation System.

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Installation](#-installation)
3. [Configuration](#-configuration)
4. [Running Services](#-running-services)
5. [Initial Training](#-initial-training)
6. [Verification](#-verification)
7. [Deployment](#-deployment)
8. [Troubleshooting](#-troubleshooting)

---

## ✅ Prerequisites

### System Requirements

- **OS**: Windows, macOS, or Linux
- **Python**: 3.8 or higher
- **RAM**: Minimum 4GB (8GB+ recommended)
- **Storage**: 10GB+ free space (for vector indexes)
- **CPU**: 2+ cores

### Required Services

- ✅ **MySQL** 5.7+ (for data)
- ✅ **Qdrant** 2.7+ (for vector search)
- ✅ **Docker** (to run Qdrant easily)

### Check Prerequisites

```bash
# Check Python version
python --version
# Should be 3.8+

# Check MySQL
mysql --version
# Should be 5.7+

# Check Docker
docker --version
# Should be 20.10+
```

---

## 🚀 Installation

### Step 1: Clone/Navigate to Project

```bash
cd e:\2026\ProjectWebBanSach\recommendation-service
```

### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Upgrade pip

```bash
python -m pip install --upgrade pip
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected output:**

```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 sqlalchemy-2.0.23 ... (40+ packages)
```

### Step 5: Verify Installation

```bash
pip list | grep -E "fastapi|sqlalchemy|qdrant"
```

Should show versions for:

- `fastapi` (0.104+)
- `sqlalchemy` (2.0+)
- `qdrant-client` (2.7+)

---

## ⚙️ Configuration

### Step 1: Create `.env` File

```bash
# Copy example config
cp .env.example .env
```

### Step 2: Edit `.env` with Your Settings

```ini
# Database
DATABASE_URL=mysql+pymysql://your_user:your_password@your_host:3306/katila_db

# Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333

# Weights
COLLAB_WEIGHT=0.6
CONTENT_WEIGHT=0.4
```

### Step 3: Verify Database Connection

Create a test script `test_connection.py`:

```python
from app.data_access.database import get_books_data

try:
    df = get_books_data()
    print(f"✅ Connected! Found {len(df)} books")
    print(f"Columns: {df.columns.tolist()}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
```

Run it:

```bash
python test_connection.py
```

---

## 🐳 Running Services

### Start Qdrant (Vector Database)

#### Option A: Using Docker (Recommended)

```bash
# Pull image
docker pull qdrant/qdrant

# Run container
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

#### Option B: Verify Qdrant is Running

```bash
# Check status
curl http://localhost:6333/health

# Should return:
# {"ok":true}
```

#### Option C: Stop Qdrant (if needed)

```bash
docker stop qdrant
docker rm qdrant
```

### Start FastAPI Application

#### Development Mode (with auto-reload)

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

#### Production Mode (with Gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 "app.main:app"
```

### Verify Service is Running

```bash
# Health check
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","database":"connected","total_books":...}

# API info
curl http://localhost:8000/api/info
```

---

## 📚 Initial Training

### Option 1: Train via API

```bash
curl -X POST "http://localhost:8000/api/recommendations/train" \
  -H "Content-Type: application/json" \
  -d '{"retrain_collaborative": true, "retrain_content": true}'
```

### Option 2: Train via Python Script

Create `train_models.py`:

```python
from app.services.hybrid_engine import HybridRecommendationEngine

print("🔄 Starting model training...")

engine = HybridRecommendationEngine()
result = engine.train_engines(
    retrain_collaborative=True,
    retrain_content=True
)

print(f"✅ Status: {result['status']}")
print(result['message'])
```

Run it:

```bash
python train_models.py
```

**⏱️ Expected duration:** 5-30 minutes depending on data size

### Monitor Training

```bash
# Check Qdrant collections
curl http://localhost:6333/collections

# Should show:
# {
#   "result": {
#     "collections": [
#       {"name": "item_item_cf"},
#       {"name": "books_collection"},
#       {"name": "users_collection"}
#     ]
#   }
# }
```

---

## ✔️ Verification

### Test 1: Health Check

```bash
curl http://localhost:8000/health
```

**Expected response:**

```json
{
  "status": "healthy",
  "database": "connected",
  "total_books": 5000,
  "message": "Service is operational"
}
```

### Test 2: Get Recommendations

```bash
curl "http://localhost:8000/api/recommendations/user/25?top_n=5"
```

**Expected response:**

```json
{
  "user_id": 25,
  "recommendations": [
    {
      "book_id": 123,
      "title": "...",
      "score": 0.95,
      "predicted_rating": 4.75,
      "type": "hybrid"
    }
  ],
  "total_count": 5,
  "method": "hybrid"
}
```

### Test 3: Find Related Books

```bash
curl "http://localhost:8000/api/books/1/related?top_n=5"
```

### Test 4: Run Quick Start

```bash
python quick_start.py
```

This will run 9 comprehensive tests of all major endpoints.

---

## 🌐 Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in `.env`
- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Enable CORS appropriately
- [ ] Set up proper logging
- [ ] Configure database backups
- [ ] Set up monitoring
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up health check monitoring

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
# Build image
docker build -t katila-recommender:1.0 .

# Run container
docker run -d \
  -e DATABASE_URL=... \
  -e QDRANT_HOST=... \
  -p 8000:8000 \
  katila-recommender:1.0
```

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage
    environment:
      QDRANT_API_KEY: your_api_key

  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: mysql+pymysql://user:pass@mysql:3306/db
      QDRANT_HOST: qdrant
      QDRANT_PORT: 6333
    depends_on:
      - qdrant
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: katila_db
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  qdrant_storage:
  mysql_data:
```

Run:

```bash
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Issue 1: "ModuleNotFoundError: No module named 'app'"

**Solution:**

```bash
# Make sure you're in the project root
cd e:\2026\ProjectWebBanSach\recommendation-service

# Check Python path
python -c "import sys; print('\n'.join(sys.path))"
```

### Issue 2: "Failed to connect to Qdrant"

**Solution:**

```bash
# Check if Qdrant is running
docker ps | grep qdrant

# Start Qdrant
docker run -d -p 6333:6333 qdrant/qdrant

# Test connection
curl http://localhost:6333/health
```

### Issue 3: "MySQL connection failed"

**Solution:**

```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test connection
python
>>> from sqlalchemy import create_engine
>>> engine = create_engine(os.getenv('DATABASE_URL'))
>>> engine.connect()
```

### Issue 4: "Port 8000 already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Issue 5: Slow recommendations

**Solutions:**

1. Train models with more data
2. Increase `COLLAB_WEIGHT` for faster collaborative filtering
3. Add database indexes
4. Increase Qdrant memory
5. Use caching layer (Redis)

---

## 📊 Database Setup

### Create Required Indexes

```sql
-- For performance
CREATE INDEX idx_book_order_user_id ON book_order(book_id);
CREATE INDEX idx_book_order_rate ON book_order(rate);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_interact_user_book ON interact_events(user_id, book_id);
```

### Sample Query to Check Data

```sql
-- Check books count
SELECT COUNT(*) FROM books WHERE is_active = 1;

-- Check ratings
SELECT COUNT(*) FROM book_order WHERE rate IS NOT NULL;

-- Check interactions
SELECT COUNT(*) FROM interact_events;

-- Check users
SELECT COUNT(DISTINCT customer_id) FROM orders;
```

---

## 📈 Performance Tuning

### Database Optimization

```sql
-- Add indexes
ALTER TABLE book_order ADD INDEX idx_rate (rate);
ALTER TABLE orders ADD INDEX idx_customer (customer_id);

-- Analyze tables
ANALYZE TABLE books;
ANALYZE TABLE book_order;
ANALYZE TABLE orders;
```

### Qdrant Optimization

```yaml
# Adjust in Qdrant config
snapshot_interval: 300 # Seconds
hnsw:
  m: 16
  ef_construct: 200
  ef_search: 100
  full_scan_threshold: 10000
```

### Application Optimization

```python
# Increase caching
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_books_data():
    ...
```

---

## ✨ Next Steps

1. ✅ Run `python quick_start.py` for testing
2. ✅ Set up scheduled retraining (cron job)
3. ✅ Configure monitoring/alerting
4. ✅ Set up CI/CD pipeline
5. ✅ Integrate with frontend
6. ✅ Monitor performance metrics

---

## 📞 Support

- 📖 Full Documentation: [README.md](README.md)
- 📚 API Documentation: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- 🔍 Interactive Docs: http://localhost:8000/docs
- 🐛 Check logs for errors

---

**Happy recommending! 🎉**
