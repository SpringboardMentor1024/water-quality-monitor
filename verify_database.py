#!/usr/bin/env python3
import sqlite3
import os

def verify_database_schema():
    db_path = "backend/water_quality.db"
    
    if not os.path.exists(db_path):
        print("❌ Database not found at backend/water_quality.db")
        return
    
    print("🗄️  Database Schema Verification")
    print("=" * 60)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check existing tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print(f"\n📋 Found {len(tables)} tables:")
    for table in tables:
        print(f"   • {table[0]}")
    
    # Check if NGO-related tables exist
    required_tables = ['ngos', 'projects', 'collaborations', 'station_assignments']
    existing_tables = [table[0].lower() for table in tables]
    
    print(f"\n🏢 NGO Collaboration Tables Status:")
    for table in required_tables:
        if table in existing_tables:
            print(f"   ✅ {table} - EXISTS")
            
            # Show table structure
            cursor.execute(f"PRAGMA table_info({table});")
            columns = cursor.fetchall()
            print(f"      Columns: {', '.join([col[1] for col in columns])}")
            
            # Show sample data count
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"      Records: {count}")
        else:
            print(f"   ❌ {table} - MISSING")
    
    # Check core tables
    print(f"\n💧 Core Water Quality Tables:")
    core_tables = ['waterstations', 'stationreadings', 'alerts', 'users']
    for table in core_tables:
        if table in existing_tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"   ✅ {table}: {count} records")
        else:
            print(f"   ❌ {table} - MISSING")
    
    conn.close()
    
    print(f"\n📸 DATABASE SCREENSHOT CHECKLIST:")
    print("✓ Open database in DB Browser for SQLite or similar tool")
    print("✓ Capture table structure for: ngos, projects, collaborations")
    print("✓ Show foreign key relationships")
    print("✓ Capture sample data from each table")
    print("✓ Show indexes and constraints")

def create_sample_ngo_data():
    """Create sample NGO data for screenshots"""
    db_path = "backend/water_quality.db"
    
    if not os.path.exists(db_path):
        print("❌ Database not found")
        return
    
    print("\n🏗️  Creating Sample NGO Data...")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create NGOs table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ngos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                contact_email VARCHAR(255),
                contact_phone VARCHAR(20),
                region VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create Projects table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                start_date DATE,
                end_date DATE,
                status VARCHAR(20) DEFAULT 'planned',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create Collaborations table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS collaborations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                ngo_id INTEGER,
                role VARCHAR(100),
                assigned_from DATE,
                assigned_to DATE,
                FOREIGN KEY (project_id) REFERENCES projects(id),
                FOREIGN KEY (ngo_id) REFERENCES ngos(id)
            )
        ''')
        
        # Insert sample NGOs
        sample_ngos = [
            ("Clean Water Foundation", "contact@cleanwater.org", "+91-9876543210", "Maharashtra"),
            ("Aqua Guard NGO", "info@aquaguard.org", "+91-9876543211", "Karnataka"),
            ("Pure Water Initiative", "hello@purewater.org", "+91-9876543212", "Tamil Nadu"),
            ("Water Watch Society", "admin@waterwatch.org", "+91-9876543213", "Gujarat"),
            ("Blue Planet Foundation", "contact@blueplanet.org", "+91-9876543214", "Rajasthan")
        ]
        
        cursor.executemany('''
            INSERT OR IGNORE INTO ngos (name, contact_email, contact_phone, region)
            VALUES (?, ?, ?, ?)
        ''', sample_ngos)
        
        # Insert sample projects
        sample_projects = [
            ("Mumbai Water Quality Initiative", "Comprehensive monitoring of Mumbai water sources", "2024-01-01", "2024-12-31", "active"),
            ("Bangalore Lake Restoration", "Restoration and monitoring of Bangalore lakes", "2024-02-01", "2024-11-30", "active"),
            ("Chennai Groundwater Project", "Groundwater quality assessment in Chennai", "2024-03-01", "2024-10-31", "planned"),
            ("Gujarat Coastal Monitoring", "Coastal water quality monitoring in Gujarat", "2024-01-15", "2024-12-15", "active"),
            ("Rajasthan Desert Water Study", "Water scarcity and quality study in Rajasthan", "2024-04-01", "2024-09-30", "planned")
        ]
        
        cursor.executemany('''
            INSERT OR IGNORE INTO projects (name, description, start_date, end_date, status)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_projects)
        
        # Insert sample collaborations
        sample_collaborations = [
            (1, 1, "Lead Monitoring Partner", "2024-01-01", "2024-12-31"),
            (2, 2, "Technical Consultant", "2024-02-01", "2024-11-30"),
            (3, 3, "Data Collection Lead", "2024-03-01", "2024-10-31"),
            (4, 4, "Regional Coordinator", "2024-01-15", "2024-12-15"),
            (5, 5, "Research Partner", "2024-04-01", "2024-09-30"),
            (1, 2, "Support Partner", "2024-01-01", "2024-06-30"),
            (2, 1, "Quality Assurance", "2024-02-01", "2024-08-31")
        ]
        
        cursor.executemany('''
            INSERT OR IGNORE INTO collaborations (project_id, ngo_id, role, assigned_from, assigned_to)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_collaborations)
        
        conn.commit()
        print("✅ Sample NGO data created successfully!")
        
        # Show what was created
        cursor.execute("SELECT COUNT(*) FROM ngos")
        ngo_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM projects")
        project_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM collaborations")
        collab_count = cursor.fetchone()[0]
        
        print(f"   📊 Created: {ngo_count} NGOs, {project_count} projects, {collab_count} collaborations")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    verify_database_schema()
    create_sample_ngo_data()
    verify_database_schema()  # Verify again after creating data