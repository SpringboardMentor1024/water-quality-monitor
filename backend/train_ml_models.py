#!/usr/bin/env python3
"""
ML Model Training Script
Trains water quality prediction models using real database data
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from database import get_db
from ml_predictor import ml_predictor
import models
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_models():
    """Train ML models with database data"""
    db = next(get_db())
    
    try:
        logger.info("Starting ML model training...")
        
        # Get all readings from database
        readings = db.query(models.StationReading).all()
        
        if not readings:
            logger.warning("No training data found in database")
            return False
        
        logger.info(f"Found {len(readings)} readings for training")
        
        # Convert to format expected by ML predictor
        readings_data = []
        for reading in readings:
            readings_data.append({
                'station_id': reading.station_id,
                'parameter': reading.parameter.value if hasattr(reading.parameter, 'value') else str(reading.parameter),
                'value': float(reading.value),
                'recorded_at': reading.recorded_at.isoformat() if reading.recorded_at else datetime.utcnow().isoformat()
            })
        
        # Train models
        logger.info("Training ML models...")
        results = ml_predictor.train_models(readings_data)
        
        if results:
            logger.info("✅ ML models trained successfully!")
            for parameter, metrics in results.items():
                logger.info(f"  {parameter}: MAE={metrics['mae']:.3f}, R2={metrics['r2_score']:.3f}")
            return True
        else:
            logger.warning("⚠️ No models were trained (insufficient data)")
            return False
            
    except Exception as e:
        logger.error(f"❌ Training failed: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = train_models()
    sys.exit(0 if success else 1)