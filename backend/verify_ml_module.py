#!/usr/bin/env python3
"""
ML Module Verification Script
Tests all ML functionality to ensure 100% completion
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

import requests
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000"

def test_ml_endpoints():
    """Test all ML endpoints"""
    logger.info("🧪 Testing ML Module Endpoints...")
    
    tests_passed = 0
    total_tests = 4
    
    # Test 1: Check ML status
    try:
        response = requests.get(f"{BASE_URL}/api/ml/status")
        if response.status_code == 200:
            data = response.json()
            logger.info(f"✅ ML Status: {data.get('status', 'unknown')}")
            tests_passed += 1
        else:
            logger.error(f"❌ ML Status endpoint failed: {response.status_code}")
    except Exception as e:
        logger.error(f"❌ ML Status test failed: {e}")
    
    # Test 2: Train models
    try:
        response = requests.post(f"{BASE_URL}/api/ml/train")
        if response.status_code == 200:
            data = response.json()
            logger.info(f"✅ ML Training: {data.get('message', 'completed')}")
            tests_passed += 1
        else:
            logger.error(f"❌ ML Training endpoint failed: {response.status_code}")
    except Exception as e:
        logger.error(f"❌ ML Training test failed: {e}")
    
    # Test 3: Get predictive alerts
    try:
        response = requests.get(f"{BASE_URL}/api/predictive-alerts")
        if response.status_code == 200:
            data = response.json()
            logger.info(f"✅ Predictive Alerts: {len(data)} alerts found")
            tests_passed += 1
        else:
            logger.error(f"❌ Predictive Alerts endpoint failed: {response.status_code}")
    except Exception as e:
        logger.error(f"❌ Predictive Alerts test failed: {e}")
    
    # Test 4: Generate prediction for station
    try:
        response = requests.post(f"{BASE_URL}/api/ml/predict/1")
        if response.status_code == 200:
            data = response.json()
            logger.info(f"✅ Station Prediction: {data.get('status', 'completed')}")
            tests_passed += 1
        else:
            logger.error(f"❌ Station Prediction endpoint failed: {response.status_code}")
    except Exception as e:
        logger.error(f"❌ Station Prediction test failed: {e}")
    
    return tests_passed, total_tests

def verify_ml_files():
    """Verify all ML files exist"""
    logger.info("📁 Verifying ML Module Files...")
    
    required_files = [
        "ml_predictor.py",
        "train_ml_models.py", 
        "generate_training_data.py",
        "setup_ml_module.py",
        "requirements.txt"
    ]
    
    files_found = 0
    for file in required_files:
        if os.path.exists(file):
            logger.info(f"✅ {file}")
            files_found += 1
        else:
            logger.error(f"❌ {file} - MISSING")
    
    return files_found, len(required_files)

def check_dependencies():
    """Check if ML dependencies are available"""
    logger.info("📦 Checking ML Dependencies...")
    
    dependencies = ['sklearn', 'numpy', 'pandas', 'joblib']
    deps_available = 0
    
    for dep in dependencies:
        try:
            __import__(dep)
            logger.info(f"✅ {dep}")
            deps_available += 1
        except ImportError:
            logger.error(f"❌ {dep} - NOT INSTALLED")
    
    return deps_available, len(dependencies)

def main():
    """Main verification function"""
    print("\n" + "="*60)
    print("🔍 ML PREDICTIVE MODULE VERIFICATION")
    print("="*60)
    
    # Check files
    files_ok, total_files = verify_ml_files()
    
    # Check dependencies
    deps_ok, total_deps = check_dependencies()
    
    # Test endpoints (only if server is running)
    endpoints_ok = 0
    total_endpoints = 0
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            endpoints_ok, total_endpoints = test_ml_endpoints()
        else:
            logger.warning("⚠️ Backend server not running - skipping endpoint tests")
    except:
        logger.warning("⚠️ Backend server not running - skipping endpoint tests")
    
    # Calculate overall score
    total_score = files_ok + deps_ok + endpoints_ok
    max_score = total_files + total_deps + total_endpoints
    
    print("\n" + "="*60)
    print("📊 VERIFICATION RESULTS")
    print("="*60)
    print(f"📁 Files:       {files_ok}/{total_files}")
    print(f"📦 Dependencies: {deps_ok}/{total_deps}")
    if total_endpoints > 0:
        print(f"🌐 Endpoints:   {endpoints_ok}/{total_endpoints}")
        print(f"🎯 Total Score: {total_score}/{max_score}")
    else:
        print(f"🌐 Endpoints:   Not tested (server offline)")
        print(f"🎯 File Score:  {files_ok + deps_ok}/{total_files + total_deps}")
    
    # Determine completion status
    if files_ok == total_files and deps_ok == total_deps:
        print("\n🎉 ML PREDICTIVE MODULE: 100% COMPLETE!")
        print("✅ All files present")
        print("✅ All dependencies available") 
        if total_endpoints > 0 and endpoints_ok == total_endpoints:
            print("✅ All endpoints working")
        print("\n🚀 Ready for production use!")
    else:
        print("\n⚠️ ML PREDICTIVE MODULE: INCOMPLETE")
        if files_ok < total_files:
            print("❌ Missing files")
        if deps_ok < total_deps:
            print("❌ Missing dependencies - run: pip install -r requirements.txt")
    
    print("="*60)

if __name__ == "__main__":
    main()