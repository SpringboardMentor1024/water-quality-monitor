#!/usr/bin/env python3
"""
Add sample alerts to the database for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import engine, get_db
import models
from datetime import datetime, timedelta

def add_sample_alerts():
    """Add sample alerts to the database"""
    db = Session(bind=engine)
    
    try:
        # Create sample alerts
        sample_alerts = [
            {
                "type": models.AlertType.contamination,
                "message": "High Turbidity Detected - Turbidity levels exceed 10 NTU at monitoring station",
                "location": "Station Alpha - Downtown Water Treatment",
                "issued_at": datetime.utcnow() - timedelta(minutes=5)
            },
            {
                "type": models.AlertType.boil_notice,
                "message": "Low Dissolved Oxygen - DO levels critical at 2.1 mg/L, immediate attention required",
                "location": "River Delta Station - Industrial District",
                "issued_at": datetime.utcnow() - timedelta(minutes=15)
            },
            {
                "type": models.AlertType.contamination,
                "message": "Bacteria Contamination - E. coli levels above safety limit of 100 CFU/100ml",
                "location": "Lake Reservoir - Recreation Area",
                "issued_at": datetime.utcnow() - timedelta(minutes=30)
            },
            {
                "type": models.AlertType.outage,
                "message": "Water System Outage - Pump failure at main distribution center",
                "location": "Central Distribution Hub",
                "issued_at": datetime.utcnow() - timedelta(hours=1)
            },
            {
                "type": models.AlertType.boil_notice,
                "message": "Precautionary Boil Notice - Maintenance work on main water line completed",
                "location": "Residential District - Zones 5-8",
                "issued_at": datetime.utcnow() - timedelta(hours=2)
            }
        ]
        
        # Clear existing alerts
        db.query(models.Alert).delete()
        
        # Add new alerts
        for alert_data in sample_alerts:
            alert = models.Alert(**alert_data)
            db.add(alert)
        
        db.commit()
        print(f"✅ Successfully added {len(sample_alerts)} sample alerts")
        
        # Verify alerts were added
        alert_count = db.query(models.Alert).count()
        print(f"📊 Total alerts in database: {alert_count}")
        
    except Exception as e:
        print(f"❌ Error adding sample alerts: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Adding sample alerts to database...")
    add_sample_alerts()
    print("✅ Sample alerts setup complete!")