#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Populate sample alerts for historical data visualization
"""
import sqlite3
from datetime import datetime, timedelta
import random

def populate_sample_alerts():
    """Add sample alerts to the database for the last 7 days"""
    
    # Connect to database
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    # Clear existing alerts
    cursor.execute("DELETE FROM alerts")
    
    # Alert types and sample messages
    alert_types = [
        ('boil_notice', [
            'Boil water advisory issued due to bacterial contamination',
            'Precautionary boil water notice for maintenance work',
            'Boil water alert - water main break detected'
        ]),
        ('contamination', [
            'High lead levels detected in water supply',
            'Chemical contamination reported in water source',
            'Bacterial contamination exceeds safe limits'
        ]),
        ('outage', [
            'Water service interruption due to pump failure',
            'Scheduled maintenance causing water outage',
            'Emergency water service disruption'
        ])
    ]
    
    locations = [
        'Downtown District', 'Riverside Area', 'Industrial Zone',
        'Residential Complex A', 'North Side Community', 'South End District',
        'Central Business District', 'Suburban Area B'
    ]
    
    # Generate alerts for the last 7 days
    base_date = datetime.now() - timedelta(days=7)
    
    for day in range(7):
        current_date = base_date + timedelta(days=day)
        
        # Generate random number of alerts per day (0-4 per type)
        for alert_type, messages in alert_types:
            num_alerts = random.randint(0, 4)
            
            for _ in range(num_alerts):
                message = random.choice(messages)
                location = random.choice(locations)
                
                # Add some random hours/minutes to spread throughout the day
                alert_time = current_date + timedelta(
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59)
                )
                
                cursor.execute("""
                    INSERT INTO alerts (type, message, location, issued_at)
                    VALUES (?, ?, ?, ?)
                """, (alert_type, message, location, alert_time.isoformat()))
    
    # Commit changes
    conn.commit()
    
    # Verify data
    cursor.execute("SELECT COUNT(*) FROM alerts")
    total_alerts = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT type, COUNT(*) 
        FROM alerts 
        GROUP BY type
    """)
    type_counts = cursor.fetchall()
    
    print(f"Successfully populated {total_alerts} sample alerts")
    print("Alert distribution:")
    for alert_type, count in type_counts:
        print(f"  - {alert_type}: {count} alerts")
    
    conn.close()

if __name__ == "__main__":
    populate_sample_alerts()