#!/usr/bin/env python3
"""
Complete ML Predictive Module Setup
Sets up and trains the ML models for water quality prediction
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

import subprocess
import logging
from database import get_db
import models
from ml_predictor import ml_predictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def install_dependencies():
    """Install required ML dependencies"""
    logger.info("Installing ML dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        logger.info("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Failed to install dependencies: {e}")
        return False

def check_training_data():
    """Check if training data exists"""
    db = next(get_db())
    try:
        count = db.query(models.StationReading).count()
        logger.info(f"Found {count} readings in database")
        return count > 0
    finally:
        db.close()

def setup_ml_module():
    """Complete ML module setup"""
    logger.info("🚀 Starting ML Predictive Module Setup...")
    
    # Step 1: Install dependencies
    if not install_dependencies():
        return False
    
    # Step 2: Check for training data
    if not check_training_data():
        logger.info("No training data found. Generating sample data...")
        try:
            from generate_training_data import generate_training_data
            if not generate_training_data():
                logger.error("Failed to generate training data")
                return False
        except ImportError:
            logger.error("Could not import training data generator")
            return False
    
    # Step 3: Train ML models
    logger.info("Training ML models...")
    try:
        from train_ml_models import train_models
        if not train_models():
            logger.error("Failed to train ML models")
            return False
    except ImportError:
        logger.error("Could not import ML trainer")
        return False
    
    # Step 4: Verify models are working
    logger.info("Verifying ML models...")
    try:
        ml_predictor.load_models()
        trained_models = list(ml_predictor.models.keys())
        
        if trained_models:
            logger.info(f"✅ ML models trained for parameters: {trained_models}")
            
            # Test prediction
            test_data = {
                'ph': 7.0,
                'temperature': 25.0,
                'turbidity': 3.0,
                'dissolved_oxygen': 8.0,
                'hour': 12,
                'day_of_week': 1,
                'month': 6
            }
            
            test_prediction = ml_predictor.predict_parameter(
                station_id=1,
                parameter='ph',
                current_data=test_data
            )
            
            logger.info(f"✅ Test prediction successful: {test_prediction}")
            logger.info("🎉 ML Predictive Module setup complete!")
            return True
        else:
            logger.error("❌ No models were trained")
            return False
            
    except Exception as e:
        logger.error(f"❌ Model verification failed: {e}")
        return False

def print_usage_info():
    """Print usage information"""
    print("\n" + "="*60)
    print("🎯 ML PREDICTIVE MODULE - SETUP COMPLETE")
    print("="*60)
    print("\n📋 Available API Endpoints:")
    print("  POST /api/ml/train              - Train ML models")
    print("  POST /api/ml/predict/{station}  - Generate predictions")
    print("  GET  /api/ml/status             - Check model status")
    print("  GET  /api/predictive-alerts     - Get ML predictions")
    print("\n🔧 Manual Commands:")
    print("  python train_ml_models.py       - Train models manually")
    print("  python generate_training_data.py - Generate sample data")
    print("\n✅ The predictive module is now 100% COMPLETE!")
    print("="*60)

if __name__ == "__main__":
    success = setup_ml_module()
    
    if success:
        print_usage_info()
        sys.exit(0)
    else:
        logger.error("❌ ML module setup failed")
        sys.exit(1)