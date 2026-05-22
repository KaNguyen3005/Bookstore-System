"""
🚀 Quick Start Guide - KaTiLa AI Recommender

This script demonstrates how to use the Hybrid Recommendation Engine
"""

import requests
import json

# ============ Configuration ============
BASE_URL = "http://localhost:8000"
USER_ID = 25
BOOK_ID = 123
TOP_N = 10

# ============ Helper Functions ============

def print_header(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def print_recommendations(recs):
    """Pretty print recommendations"""
    for i, rec in enumerate(recs['recommendations'], 1):
        print(f"{i:2d}. [{rec['book_id']:5d}] {rec['title'][:45]:45s}")
        print(f"     Score: {rec['score']:.2%} | Rating: ★{'★'*int(rec['predicted_rating']/1.25)} "
              f"({rec['predicted_rating']:.1f}/5) | Type: {rec['type']}")

def print_related(data):
    """Pretty print related books"""
    print(f"📚 Related to: {data['book_title']}\n")
    for i, rec in enumerate(data['related_books'], 1):
        print(f"{i:2d}. [{rec['book_id']:5d}] {rec['title'][:45]:45s}")
        print(f"     Score: {rec['score']:.2%} | Rating: ★{'★'*int(rec['predicted_rating']/1.25)} "
              f"({rec['predicted_rating']:.1f}/5)")

# ============ API Tests ============

def test_health():
    """Test 1: Health Check"""
    print_header("1️⃣  HEALTH CHECK")
    try:
        response = requests.get(f"{BASE_URL}/health")
        data = response.json()
        print(f"✅ Status: {data['status'].upper()}")
        print(f"   Database: {data.get('database', 'N/A')}")
        print(f"   Total Books: {data.get('total_books', 'N/A')}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_recommendations():
    """Test 2: Get Recommendations for User"""
    print_header("2️⃣  USER RECOMMENDATIONS")
    try:
        print(f"👤 Getting recommendations for User #{USER_ID}...\n")
        response = requests.get(
            f"{BASE_URL}/api/recommendations/user/{USER_ID}",
            params={"top_n": TOP_N}
        )
        data = response.json()
        
        print(f"📊 Method: {data['method'].upper()}")
        print(f"   Total: {data['total_count']} books\n")
        
        print_recommendations(data)
    except Exception as e:
        print(f"❌ Error: {e}")

def test_recommendations_simple():
    """Test 3: Get Recommendations (Simple Format)"""
    print_header("3️⃣  RECOMMENDATIONS (SIMPLE FORMAT)")
    try:
        print(f"👤 Getting recommendations for User #{USER_ID} (simple format)...\n")
        response = requests.get(
            f"{BASE_URL}/api/recommendations/user/{USER_ID}/simple",
            params={"top_n": 5}
        )
        data = response.json()
        
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"❌ Error: {e}")

def test_related_books():
    """Test 4: Find Related Books"""
    print_header("4️⃣  RELATED BOOKS")
    try:
        print(f"🔍 Finding books related to Book #{BOOK_ID}...\n")
        response = requests.get(
            f"{BASE_URL}/api/books/{BOOK_ID}/related",
            params={"top_n": 5}
        )
        data = response.json()
        
        print_related(data)
    except Exception as e:
        print(f"❌ Error: {e}")

def test_book_info():
    """Test 5: Get Book Info"""
    print_header("5️⃣  BOOK INFORMATION")
    try:
        print(f"📖 Getting info for Book #{BOOK_ID}...\n")
        response = requests.get(f"{BASE_URL}/api/books/{BOOK_ID}/info")
        data = response.json()
        
        print(f"📚 Title: {data.get('title')}")
        print(f"   Authors: {data.get('authors', 'N/A')}")
        print(f"   Categories: {data.get('categories', 'N/A')}")
        print(f"\n   Description:\n   {data.get('description', 'N/A')[:200]}...")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_search_books():
    """Test 6: Search Books by Title"""
    print_header("6️⃣  SEARCH BOOKS")
    try:
        search_term = "Python"
        print(f"🔎 Searching for '{search_term}'...\n")
        response = requests.get(
            f"{BASE_URL}/api/books/search/by-title",
            params={"title": search_term, "limit": 5}
        )
        data = response.json()
        
        print(f"📊 Found {len(data)} books:\n")
        for i, book in enumerate(data, 1):
            print(f"{i}. [{book['book_id']:5d}] {book['title']}")
            print(f"   Authors: {book.get('authors', 'N/A')}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_engine_stats():
    """Test 7: Get Engine Stats"""
    print_header("7️⃣  ENGINE STATISTICS")
    try:
        response = requests.get(f"{BASE_URL}/api/recommendations/stats")
        data = response.json()
        
        print(f"✅ Status: {data['status'].upper()}\n")
        print(f"🎛️  Hybrid Engine:")
        print(f"   - Collaborative weight: {data['hybrid_engine']['collaborative_weight']*100:.0f}%")
        print(f"   - Content weight: {data['hybrid_engine']['content_weight']*100:.0f}%")
        print(f"\n📚 Content Engine:")
        print(f"   - Vector size: {data['content_engine']['vector_size']}")
        print(f"   - Book collection: {data['content_engine']['book_collection']}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_train_models():
    """Test 8: Train Models (Optional - takes time)"""
    print_header("8️⃣  TRAIN MODELS")
    try:
        print("⏳ Starting model training... (this may take a few minutes)\n")
        response = requests.post(
            f"{BASE_URL}/api/recommendations/train",
            json={
                "retrain_collaborative": True,
                "retrain_content": True
            }
        )
        data = response.json()
        
        print(f"✅ Status: {data['status'].upper()}")
        print(f"\n📋 Details:")
        for line in data['message'].split('\n'):
            print(f"   {line}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_api_info():
    """Test 9: Get API Info"""
    print_header("9️⃣  API INFORMATION")
    try:
        response = requests.get(f"{BASE_URL}/api/info")
        data = response.json()
        
        print(f"🚀 Service: {data['service_name']}")
        print(f"   Version: {data['version']}\n")
        print(f"✨ Features:")
        for feature, desc in data['features'].items():
            print(f"   • {feature}: {desc}")
        print(f"\n📍 Main Endpoints:")
        for endpoint, path in data['endpoints'].items():
            print(f"   • {endpoint}: {path}")
    except Exception as e:
        print(f"❌ Error: {e}")

# ============ Main ============

def main():
    """Run all tests"""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*15 + "🎯 KaTiLa AI Recommender - Quick Start" + " "*14 + "║")
    print("╚" + "="*68 + "╝")
    
    # Run tests
    test_health()
    test_api_info()
    test_recommendations()
    test_recommendations_simple()
    test_related_books()
    test_book_info()
    test_search_books()
    test_engine_stats()
    
    # Optional: Train models
    # test_train_models()
    
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*20 + "✅ All tests completed!" + " "*22 + "║")
    print("╚" + "="*68 + "╝\n")
    
    print("📚 Documentation: http://localhost:8000/docs")
    print("📖 Full API Docs: Check API_DOCUMENTATION.md\n")

if __name__ == "__main__":
    main()
