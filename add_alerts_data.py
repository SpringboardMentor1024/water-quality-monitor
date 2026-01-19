import sqlite3
import os
from datetime import datetime, timedelta

def add_sample_alerts():
    """Add sample alerts for charts"""
    
    os.chdir('backend')
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    print("Adding sample alerts...")
    
    # Clear existing alerts
    cursor.execute("DELETE FROM alerts")
    
    # Add sample alerts
    alerts = [
        ('contamination', 'High turbidity detected at Thane Creek', 'NGO-MH-002'),
        ('contamination', 'Ammonia levels elevated in Yamuna River', 'NGO-DL-003'),
        ('boil_notice', 'pH levels outside safe range', 'NGO-GJ-005'),
        ('contamination', 'Temperature spike detected', 'NGO-MH-001'),
        ('boil_notice', 'Dissolved oxygen below threshold', 'NGO-KA-004'),
    ]
    
    base_date = datetime.now() - timedelta(days=3)
    
    for i, (alert_type, message, location) in enumerate(alerts):
        alert_date = base_date + timedelta(hours=i*6)
        cursor.execute("""
            INSERT INTO alerts (type, message, location, issued_at)
            VALUES (?, ?, ?, ?)
        """, (alert_type, message, location, alert_date.isoformat()))
        print(f"Added alert: {alert_type} - {message}")
    
    conn.commit()
    
    # Verify
    cursor.execute("SELECT COUNT(*) FROM alerts")
    count = cursor.fetchone()[0]
    print(f"Added {count} alerts")
    
    conn.close()
    print("Sample alerts added successfully!")

if __name__ == "__main__":
    add_sample_alerts()