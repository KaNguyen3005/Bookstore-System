# 📋 Deployment Checklist & Quick Reference

## ✅ Pre-Deployment Checklist

### Environment Setup

- [ ] Python 3.8+ installed
- [ ] MySQL 5.7+ running and accessible
- [ ] Docker installed (for Qdrant)
- [ ] Virtual environment created
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file configured with correct DATABASE_URL

### Database Setup

- [ ] Database created (`katila_db`)
- [ ] Required tables exist:
  - [ ] `books`
  - [ ] `book_order`
  - [ ] `orders`
  - [ ] `users`
  - [ ] `interact_events`
  - [ ] `authors`
  - [ ] `categories`
  - [ ] `book_author`
  - [ ] `book_category`
- [ ] Database indexes created (see SETUP.md)
- [ ] Test data exists (at least 100 books, 50 ratings)

### Qdrant Setup

- [ ] Docker running
- [ ] Qdrant container started
- [ ] Qdrant accessible at `http://localhost:6333`
- [ ] Health check passes: `curl http://localhost:6333/health`

### Code Quality

- [ ] No syntax errors: `python -m py_compile app/**/*.py`
- [ ] All imports resolve correctly
- [ ] No circular dependencies

### Testing

- [ ] Database connection works: `python -m app.data_access.database`
- [ ] Health endpoint responds: `curl http://localhost:8000/health`
- [ ] Quick start passes: `python quick_start.py`

---

## 🚀 Deployment Steps

### Step 1: Prepare Environment

```bash
# 1. Navigate to project
cd e:\2026\ProjectWebBanSach\recommendation-service

# 2. Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy and configure .env
cp .env.example .env
# Edit .env with your settings
```

### Step 2: Start Services

```bash
# Terminal 1: Start Qdrant (Vector Database)
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant

# Wait 10 seconds for Qdrant to start
sleep 10

# Terminal 2: Start FastAPI Application
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 3: Train Models

```bash
# Option A: Via API
curl -X POST "http://localhost:8000/api/recommendations/train" \
  -H "Content-Type: application/json" \
  -d '{"retrain_collaborative": true, "retrain_content": true}'

# Option B: Via Python Script
python train_models.py
```

### Step 4: Verify Deployment

```bash
# Run comprehensive tests
python quick_start.py

# Check all endpoints working
curl http://localhost:8000/health
curl http://localhost:8000/api/info
curl "http://localhost:8000/api/recommendations/user/1?top_n=5"
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# 1. Build and start all services
docker-compose up -d

# 2. Wait for services to be healthy
docker-compose ps

# 3. Check logs
docker-compose logs -f recommender

# 4. Test
curl http://localhost:8000/health

# 5. Stop services
docker-compose down
```

### Manual Docker

```bash
# Build image
docker build -t katila-recommender:1.0 .

# Run container
docker run -d \
  --name recommender \
  -e DATABASE_URL=mysql+pymysql://... \
  -e QDRANT_HOST=localhost \
  -p 8000:8000 \
  katila-recommender:1.0

# View logs
docker logs -f recommender

# Stop container
docker stop recommender
docker rm recommender
```

---

## 📊 Post-Deployment

### Verify Everything Works

```bash
# 1. Health check
curl http://localhost:8000/health
# Expected: {"status": "healthy", ...}

# 2. Database connection
curl http://localhost:8000/test-db
# Expected: {"status": "success", "total_books": ...}

# 3. Get recommendations
curl "http://localhost:8000/api/recommendations/user/1?top_n=5"
# Expected: recommendations list with books

# 4. Find related books
curl "http://localhost:8000/api/books/1/related?top_n=5"
# Expected: related books list

# 5. API documentation
# Open in browser: http://localhost:8000/docs
```

### Monitor Performance

```bash
# Check API response times
time curl "http://localhost:8000/api/recommendations/user/25?top_n=10"

# Monitor Qdrant
curl http://localhost:6333/collections
curl http://localhost:6333/collections/item_item_cf

# Database query performance
# Check MySQL slow query log
```

### Set Up Monitoring

1. **Application Logs**: Check console/file logs
2. **API Metrics**: Monitor response times and errors
3. **Database**: Monitor connection pool usage
4. **Qdrant**: Monitor vector search performance
5. **Health Checks**: Regular health endpoint checks

---

## 🔄 Scheduled Tasks

### Daily Training (Cron Job)

```bash
# Linux/Mac: Add to crontab
0 2 * * * /path/to/venv/bin/python /path/to/recommendation-service/train_models.py

# Windows: Task Scheduler
# Schedule: Daily at 2:00 AM
# Task: python C:\path\to\train_models.py
```

### Weekly Optimization

```bash
# 1. Update database statistics
mysql -u root katila_db -e "ANALYZE TABLE books, book_order, orders;"

# 2. Reindex Qdrant
curl -X POST "http://localhost:6333/collections/item_item_cf/snapshots"

# 3. Review logs and metrics
```

### Monthly Maintenance

- [ ] Review recommendation accuracy metrics
- [ ] Check database size and optimize if needed
- [ ] Update dependencies: `pip list --outdated`
- [ ] Backup database and vector indexes
- [ ] Review and adjust hybrid weights if needed

---

## 🐛 Troubleshooting Quick Guide

### Issue: "Cannot connect to database"

```bash
# Check MySQL is running
mysql -u root -e "SELECT 1"

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test SQLAlchemy connection
python
>>> from sqlalchemy import create_engine
>>> import os
>>> engine = create_engine(os.getenv('DATABASE_URL'))
>>> engine.execute("SELECT 1")
```

### Issue: "Qdrant connection refused"

```bash
# Check Qdrant is running
docker ps | grep qdrant

# Check Qdrant health
curl http://localhost:6333/health

# Restart Qdrant
docker restart qdrant

# Or run new Qdrant
docker run -d -p 6333:6333 qdrant/qdrant
```

### Issue: "No recommendations found"

```bash
# Check if user has ratings
mysql katila_db -e "SELECT COUNT(*) FROM book_order WHERE customer_id = 1"

# Check if books are in Qdrant
curl http://localhost:6333/collections

# Retrain models
curl -X POST "http://localhost:8000/api/recommendations/train"
```

### Issue: "Slow recommendations"

```bash
# Check API response time
time curl "http://localhost:8000/api/recommendations/user/1?top_n=5"

# Check Qdrant performance
curl http://localhost:6333/collections/item_item_cf

# Add database indexes
mysql katila_db -e "CREATE INDEX idx_rate ON book_order(rate);"

# Increase COLLAB_WEIGHT for faster results
```

---

## 📈 Performance Optimization

### Database Optimization

```sql
-- Add these indexes for better performance
CREATE INDEX idx_book_id ON book_order(book_id);
CREATE INDEX idx_user_id ON orders(customer_id);
CREATE INDEX idx_rate ON book_order(rate);
CREATE INDEX idx_interact_user_book ON interact_events(user_id, book_id);

-- Analyze tables
ANALYZE TABLE books, book_order, orders, interact_events;

-- Check query performance
EXPLAIN SELECT ... (your slow query);
```

### Application Optimization

```python
# Enable caching
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_books_data():
    return cached_books

# Add Redis for distributed caching
# Adjust weights for faster execution
HybridRecommendationEngine(collab_weight=0.7, content_weight=0.3)

# Batch process requests
```

### Qdrant Optimization

```yaml
# Increase search performance
performance:
  snapshot_interval: 300
  hnsw:
    m: 16
    ef_construct: 200
    ef_search: 100
```

---

## 📚 API Quick Reference

| Endpoint                                | Method | Purpose                  |
| --------------------------------------- | ------ | ------------------------ |
| `/`                                     | GET    | Welcome message          |
| `/health`                               | GET    | Health check             |
| `/api/info`                             | GET    | API information          |
| `/api/recommendations/user/{id}`        | GET    | Get recommendations      |
| `/api/recommendations/user/{id}/simple` | GET    | Recommendations (simple) |
| `/api/recommendations/train`            | POST   | Train models             |
| `/api/recommendations/stats`            | GET    | Engine statistics        |
| `/api/books/{id}/related`               | GET    | Find related books       |
| `/api/books/{id}/info`                  | GET    | Book information         |
| `/api/books/search/by-title`            | GET    | Search books             |

---

## 📞 Support & Resources

### Documentation

- **README.md**: Project overview
- **API_DOCUMENTATION.md**: Full API reference
- **SETUP.md**: Installation guide
- **IMPLEMENTATION_SUMMARY.md**: Technical details
- **This file**: Deployment checklist

### Interactive Testing

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### Quick Testing

```bash
# Run comprehensive tests
python quick_start.py

# Or use individual test commands
curl http://localhost:8000/health
curl "http://localhost:8000/api/recommendations/user/25?top_n=10"
```

---

## ✨ Success Indicators

✅ Service is running without errors  
✅ All 3 services healthy (MySQL, Qdrant, FastAPI)  
✅ Health endpoint returns `"status": "healthy"`  
✅ Recommendations API returns results  
✅ Response time < 1 second  
✅ Related books API working  
✅ Models trained successfully

---

## 🎯 Next Steps After Deployment

1. ✅ Set up monitoring & alerting
2. ✅ Configure log aggregation
3. ✅ Set up automated backups
4. ✅ Create user feedback system
5. ✅ Implement metrics collection
6. ✅ A/B test recommendation weights
7. ✅ Optimize database queries
8. ✅ Scale to multiple instances

---

**🎉 Ready to deploy! Follow the checklist and you're good to go!**
