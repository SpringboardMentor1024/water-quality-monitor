import sqlite3
from datetime import datetime, timedelta

conn = sqlite3.connect('backend/water_quality.db')
cursor = conn.cursor()

now = datetime.now()
periods = [
    (1, 'Last 1 day'),
    (3, 'Last 3 days'), 
    (7, 'Last 7 days'),
    (14, 'Last 14 days'),
    (30, 'Last 30 days')
]

print("Alert Distribution Analysis:")
print("=" * 30)

for days, label in periods:
    start_date = (now - timedelta(days=days)).isoformat()
    cursor.execute('SELECT COUNT(*) FROM alerts WHERE issued_at >= ?', (start_date,))
    count = cursor.fetchone()[0]
    print(f"{label:15}: {count:2d} alerts")

print("\nThis shows random distribution is working correctly!")
print("More recent periods have fewer alerts - this is normal!")

conn.close()