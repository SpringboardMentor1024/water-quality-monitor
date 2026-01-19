import sqlite3
import os
from datetime import datetime, timedelta
import random

def add_predictive_data():
    """Add predictive alerts data"""
    
    os.chdir('backend')
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    print("Adding predictive alerts data...")
    
    # Clear existing predictions
    cursor.execute("DELETE FROM predictions")
    
    # Add sample predictions
    stations = [1, 2, 3, 4, 5]  # Station IDs
    parameters = ['pH', 'turbidity', 'DO', 'temperature']
    
    for station_id in stations:
        for param in parameters:
            current_val = round(random.uniform(5, 9), 2)
            predicted_val = round(current_val + random.uniform(-1, 1), 2)
            probability = round(random.uniform(20, 80), 1)
            
            cursor.execute("""
                INSERT INTO predictions 
                (station_id, parameter, current_value, predicted_value, probability, 
                 trend, risk_level, expected_alert_date, review_content)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station_id, param, current_val, predicted_val, probability,
                random.choice(['Increasing', 'Decreasing', 'Stable']),
                random.choice(['Low', 'Medium', 'High']),
                (datetime.now() + timedelta(days=random.randint(1, 7))).isoformat(),
                f"Analysis shows {param} trending towards threshold limits"
            ))
    
    conn.commit()
    
    # Verify
    cursor.execute("SELECT COUNT(*) FROM predictions")
    count = cursor.fetchone()[0]
    print(f"Added {count} predictions")
    
    conn.close()
    print("Predictive data added successfully!")

if __name__ == "__main__":
    add_predictive_data()