#!/usr/bin/env python3
"""
Database Schema Sync Script
Ensures both laptops have identical database structure
"""

import sqlite3
import os
from pathlib import Path

def sync_database():
    """Sync database schema to match latest version"""
    
    # Database path
    db_path = Path(__file__).parent / "backend" / "water_quality.db"
    
    print(f"Syncing database: {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if custom_id column exists
        cursor.execute("PRAGMA table_info(water_stations)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'custom_id' not in columns:
            print("Adding custom_id column...")
            cursor.execute("ALTER TABLE water_stations ADD COLUMN custom_id TEXT")
            conn.commit()
            print("✅ Added custom_id column")
        else:
            print("✅ custom_id column already exists")
            
        # Verify schema
        cursor.execute("PRAGMA table_info(water_stations)")
        columns = [col[1] for col in cursor.fetchall()]
        print(f"Current columns: {columns}")
        
        print("✅ Database schema synchronized!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    sync_database()