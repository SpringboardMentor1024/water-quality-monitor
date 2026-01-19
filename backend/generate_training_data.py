#!/usr/bin/env python3
"""
Generate Sample Training Data for ML Models
Creates realistic water quality readings for training
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from database import get_db
import models
from datetime import datetime, timedelta
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_training_data():
    """Generate sample training data for ML models"""
    db = next(get_db())
    
    try:
        logger.info("Generating sample training data...")
        
        # Get all stations
        stations = db.query(models.WaterStation).all()
        
        if not stations:
            logger.warning("No stations found in database")
            return False
        
        parameters = ['pH', 'temperature', 'turbidity', 'DO']
        
        # Generate data for the last 30 days
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        readings_created = 0
        
        for station in stations:
            logger.info(f"Generating data for station {station.name}")
            
            # Generate hourly readings for each parameter
            current_date = start_date
            
            # Base values for each parameter (realistic ranges)
            base_values = {
                'pH': random.uniform(6.5, 8.0),
                'temperature': random.uniform(20, 30),
                'turbidity': random.uniform(1, 8),
                'DO': random.uniform(5, 12)
            }
            
            while current_date <= end_date:
                for param in parameters:
                    # Add some realistic variation
                    base = base_values[param]
                    
                    if param == 'pH':
                        value = base + random.uniform(-0.5, 0.5)
                        value = max(5.5, min(9.0, value))  # Keep in realistic range
                    elif param == 'temperature':
                        # Temperature varies with time of day
                        hour_factor = 0.3 * (current_date.hour - 12) / 12
                        value = base + hour_factor + random.uniform(-2, 2)
                        value = max(15, min(35, value))
                    elif param == 'turbidity':
                        value = base + random.uniform(-1, 2)
                        value = max(0.1, min(15, value))
                    else:  # DO
                        value = base + random.uniform(-1, 1)
                        value = max(3, min(15, value))
                    
                    # Create reading
                    reading = models.StationReading(
                        station_id=station.id,
                        parameter=models.WaterParameter(param),
                        value=round(value, 2),
                        recorded_at=current_date
                    )
                    db.add(reading)
                    readings_created += 1
                
                # Move to next hour
                current_date += timedelta(hours=1)
        
        db.commit()
        logger.info(f"✅ Generated {readings_created} training data points")
        return True
        
    except Exception as e:
        logger.error(f"❌ Data generation failed: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = generate_training_data()
    sys.exit(0 if success else 1)