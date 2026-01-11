#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reduce alerts to only 5 total for cleaner demo
"""
import sqlite3
from datetime import datetime, timedelta
import random

def reduce_alerts_to_5():
    """Keep only 5 alerts total for demo purposes"""
    
    # Connect to database
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    # Clear existing alerts
    cursor.execute("DELETE FROM alerts")
    
    # Create exactly 5 alerts spread over the last 7 days
    alerts_data = [
        {
            'type': 'boil_notice',
            'message': 'Boil water advisory issued due to bacterial contamination',
            'location': 'Downtown District',
            'days_ago': 6
        },
        {
            'type': 'contamination',
            'message': 'High lead levels detected in water supply',
            'location': 'Riverside Area',
            'days_ago': 4
        },
        {
            'type': 'outage',
            'message': 'Water service interruption due to pump failure',
            'location': 'Industrial Zone',
            'days_ago': 3
        },
        {
            'type': 'boil_notice',
            'message': 'Precautionary boil water notice for maintenance work',
            'location': 'Residential Complex A',
            'days_ago': 1
        },
        {
            'type': 'contamination',
            'message': 'Chemical contamination reported in water source',
            'location': 'North Side Community',
            'days_ago': 0
        }
    ]
    
    # Insert the 5 alerts
    for alert in alerts_data:
        alert_time = datetime.now() - timedelta(days=alert['days_ago'])
        # Add some random hours to spread throughout the day
        alert_time = alert_time + timedelta(
            hours=random.randint(8, 18),
            minutes=random.randint(0, 59)
        )
        
        cursor.execute("""
            INSERT INTO alerts (type, message, location, issued_at)
            VALUES (?, ?, ?, ?)
        """, (alert['type'], alert['message'], alert['location'], alert_time.isoformat()))
    
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
    
    print(f"Successfully reduced to {total_alerts} total alerts")
    print("Alert distribution:")
    for alert_type, count in type_counts:
        print(f"  - {alert_type}: {count} alerts")
    
    # Show all alerts with details
    cursor.execute("""
        SELECT type, message, location, issued_at 
        FROM alerts 
        ORDER BY issued_at DESC
    """)
    alerts = cursor.fetchall()
    
    print("\nAll alerts:")
    for i, (alert_type, message, location, issued_at) in enumerate(alerts, 1):
        print(f"  {i}. {alert_type.upper()}: {message[:50]}... ({location})")
    
    conn.close()

if __name__ == "__main__":
    reduce_alerts_to_5()