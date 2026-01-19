#!/usr/bin/env python3
import sqlite3
from datetime import datetime, timedelta
import random

def add_current_alerts():
    """Add current/recent alerts for active alerts display"""
    
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    # Current alerts (last 24 hours)
    current_alerts = [
        {
            'type': 'contamination',
            'message': 'High turbidity levels detected at Station STN-003',
            'location': 'Ganges River Monitoring',
            'issued_at': (datetime.now() - timedelta(hours=2)).isoformat()
        },
        {
            'type': 'boil_notice',
            'message': 'Precautionary boil water notice for maintenance work',
            'location': 'Mumbai Central District',
            'issued_at': (datetime.now() - timedelta(hours=6)).isoformat()
        },
        {
            'type': 'contamination',
            'message': 'Elevated bacteria levels at Lakeview Monitoring Point',
            'location': 'Bangalore, Karnataka',
            'issued_at': (datetime.now() - timedelta(hours=12)).isoformat()
        },
        {
            'type': 'outage',
            'message': 'Temporary water service interruption for pipe repair',
            'location': 'North Delhi District',
            'issued_at': (datetime.now() - timedelta(hours=18)).isoformat()
        },
        {
            'type': 'contamination',
            'message': 'pH levels outside normal range detected',
            'location': 'Chennai Coastal Area',
            'issued_at': (datetime.now() - timedelta(minutes=30)).isoformat()
        }
    ]
    
    # Add current alerts
    for alert in current_alerts:
        cursor.execute("""
            INSERT INTO alerts (type, message, location, issued_at)
            VALUES (?, ?, ?, ?)
        """, (alert['type'], alert['message'], alert['location'], alert['issued_at']))
    
    conn.commit()
    
    # Verify
    cursor.execute("SELECT COUNT(*) FROM alerts WHERE issued_at >= ?", 
                   [(datetime.now() - timedelta(days=1)).isoformat()])
    recent_count = cursor.fetchone()[0]
    
    print(f"Added {len(current_alerts)} current alerts")
    print(f"Total recent alerts (last 24h): {recent_count}")
    
    conn.close()

if __name__ == "__main__":
    add_current_alerts()