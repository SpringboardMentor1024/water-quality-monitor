#!/usr/bin/env python3
"""
Script to reduce the number of active alerts in the database
Keeps only recent alerts and removes older ones
"""

import sys
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import engine, get_db
import models

def reduce_alerts():
    """Reduce the number of alerts in the database"""
    db = next(get_db())
    
    try:
        print("Checking current alert count...")
        
        # Get current alert count
        total_alerts = db.query(models.Alert).count()
        print(f"Current alerts: {total_alerts}")
        
        if total_alerts <= 10:
            print("Alert count is already low. No action needed.")
            return
        
        # Keep only the last 7 days of alerts
        cutoff_date = datetime.utcnow() - timedelta(days=7)
        
        # Delete older alerts
        deleted_count = db.query(models.Alert).filter(
            models.Alert.issued_at < cutoff_date
        ).delete()
        
        db.commit()
        
        # Get new count
        remaining_alerts = db.query(models.Alert).count()
        
        print(f"Deleted {deleted_count} old alerts")
        print(f"Remaining alerts: {remaining_alerts}")
        
        # If still too many, keep only the most recent 15
        if remaining_alerts > 15:
            # Get the 15 most recent alerts
            recent_alerts = db.query(models.Alert).order_by(
                models.Alert.issued_at.desc()
            ).limit(15).all()
            
            recent_ids = [alert.id for alert in recent_alerts]
            
            # Delete all others
            additional_deleted = db.query(models.Alert).filter(
                ~models.Alert.id.in_(recent_ids)
            ).delete(synchronize_session=False)
            
            db.commit()
            
            final_count = db.query(models.Alert).count()
            print(f"Deleted {additional_deleted} additional alerts")
            print(f"Final alert count: {final_count}")
        
        print("Alert reduction completed successfully!")
        
    except Exception as e:
        print(f"Error reducing alerts: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting alert reduction...")
    reduce_alerts()