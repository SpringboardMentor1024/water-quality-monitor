#!/usr/bin/env python3
"""
Initialize database tables
"""
import sys
import os
sys.path.append(os.path.dirname(__file__))

from database import engine
import models

def init_database():
    print("Creating database tables...")
    try:
        models.Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        return True
    except Exception as e:
        print(f"Error creating database tables: {e}")
        return False

if __name__ == "__main__":
    init_database()