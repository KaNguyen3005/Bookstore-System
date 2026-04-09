# ============================================
# Makefile for Bookstore Docker Management
# ============================================

.PHONY: help build up down logs clean dev prod test backup restore

# Default target
help: ## Show this help message
	@echo "Bookstore Docker Management Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ============================================
# Development Environment
# ============================================

build: ## Build development Docker images
	docker-compose build

up: ## Start all services in development
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-app: ## View application logs only
	docker-compose logs -f bookstore-app

logs-db: ## View database logs only
	docker-compose logs -f mysql-db

restart: ## Restart all services
	docker-compose restart

restart-app: ## Restart application only
	docker-compose restart bookstore-app

# ============================================
# Production Environment
# ============================================

build-prod: ## Build production Docker images
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

up-prod: ## Start services in production mode
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down-prod: ## Stop production services
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

logs-prod: ## View production logs
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# ============================================
# Database Management
# ============================================

db-connect: ## Connect to MySQL database
	docker exec -it bookstore-mysql mysql -u root -p

db-connect-user: ## Connect to MySQL with application user
	docker exec -it bookstore-mysql mysql -u bookstore_user -p bookstore_pass db_bookstore

backup: ## Backup database to backup.sql
	docker exec bookstore-mysql mysqldump -u root -p db_bookstore > backup.sql
	@echo "Database backup saved to backup.sql"

restore: ## Restore database from backup.sql
	docker exec -i bookstore-mysql mysql -u root -p db_bookstore < backup.sql
	@echo "Database restored from backup.sql"

# ============================================
# Testing & Health Checks
# ============================================

test: ## Run health checks
	@echo "Checking application health..."
	@curl -f http://localhost:8080/bookstore/api/v1/health || echo "Application health check failed"
	@echo ""
	@echo "Checking database connection..."
	@docker exec bookstore-mysql mysqladmin ping -u root -p || echo "Database health check failed"

status: ## Show container status
	docker ps --filter "name=bookstore"

stats: ## Show container resource usage
	docker stats bookstore-app bookstore-mysql

# ============================================
# Cleanup
# ============================================

clean: ## Remove containers and networks
	docker-compose down --remove-orphans

clean-all: ## Remove containers, networks, and volumes (WARNING: deletes data)
	docker-compose down -v --remove-orphans

clean-images: ## Remove Docker images
	docker image prune -f

deep-clean: ## Complete cleanup (containers, images, volumes, networks)
	docker-compose down -v --remove-orphans
	docker system prune -f --volumes

# ============================================
# Development Helpers
# ============================================

shell: ## Open shell in application container
	docker exec -it bookstore-app /bin/bash

shell-db: ## Open shell in database container
	docker exec -it bookstore-mysql /bin/bash

update: ## Pull latest changes and rebuild
	git pull
	docker-compose build --no-cache
	docker-compose up -d

# ============================================
# Quick Commands
# ============================================

dev: up logs-app ## Start development environment and show logs

prod: up-prod logs-prod ## Start production environment and show logs

stop: down ## Stop all services

reset: clean up ## Reset development environment
