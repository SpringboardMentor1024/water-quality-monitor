#!/usr/bin/env python3
"""
Initialize Collaboration Tables
This script creates all new tables for NGO collaborations, projects, and predictions
Run this after updating models.py
"""

from database import engine
import models
import sys

def init_collaboration_tables():
    """Create all new collaboration-related tables"""
    try:
        print("🔄 Initializing collaboration tables...")
        
        # This creates all tables defined in models.Base
        models.Base.metadata.create_all(bind=engine)
        
        print("✅ Successfully created all collaboration tables!")
        print("\nTables created:")
        print("  • ngos")
        print("  • projects")
        print("  • collaborations")
        print("  • project_ngo_assignments")
        print("  • project_station_assignments")
        print("  • predictions")
        print("\nNext steps:")
        print("  1. Run: python seed_collaboration_data.py")
        print("  2. Restart backend: python main.py")
        print("  3. Visit: http://localhost:8000/docs for API docs")
        
        return True
        
    except Exception as e:
        print(f"❌ Error initializing tables: {str(e)}")
        return False

if __name__ == "__main__":
    success = init_collaboration_tables()
    sys.exit(0 if success else 1)
