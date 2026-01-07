#!/usr/bin/env python3
"""
Water Quality Monitor Backend Startup Script
Handles database setup, seeding, and server startup
"""
import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stdout:
            print(f"Output: {e.stdout}")
        if e.stderr:
            print(f"Error: {e.stderr}")
        return False

def setup_backend():
    """Complete backend setup and startup"""
    print("🚀 Water Quality Monitor Backend Setup")
    print("=" * 50)
    
    # Check if we're in the backend directory
    if not Path("main.py").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Step 1: Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        print("⚠️ Continuing anyway...")
    
    # Step 2: Create database tables
    print("🔄 Creating database tables...")
    try:
        from database import engine
        import models
        models.Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        print("⚠️ Continuing anyway...")
    
    # Step 3: Seed database with sample data
    print("🔄 Seeding database with sample data...")
    try:
        from seed_database import seed_database
        seed_database()
    except Exception as e:
        print(f"❌ Database seeding failed: {e}")
        print("⚠️ Continuing anyway...")
    
    # Step 4: Start the server
    print("\\n🌟 Starting FastAPI server...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API documentation at: http://localhost:8000/docs")
    print("\\n🛑 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        subprocess.run("uvicorn main:app --reload --host 0.0.0.0 --port 8000", shell=True, check=True)
    except KeyboardInterrupt:
        print("\\n\\n👋 Server stopped by user")
    except Exception as e:
        print(f"\\n❌ Server error: {e}")

def run_tests():
    """Run the test suite"""
    print("🧪 Running Backend Tests")
    print("=" * 30)
    
    # Run the comprehensive test
    if run_command("python test_complete_backend.py", "Running comprehensive API tests"):
        print("\\n🎉 All tests passed!")
    else:
        print("\\n❌ Some tests failed")

def show_help():
    """Show help information"""
    print("🔧 Water Quality Monitor Backend Manager")
    print("=" * 40)
    print("Usage: python startup.py [command]")
    print("\\nCommands:")
    print("  start    - Setup and start the backend server (default)")
    print("  test     - Run the test suite")
    print("  seed     - Seed database with sample data")
    print("  help     - Show this help message")
    print("\\nExamples:")
    print("  python startup.py")
    print("  python startup.py start")
    print("  python startup.py test")

def main():
    """Main function"""
    command = sys.argv[1] if len(sys.argv) > 1 else "start"
    
    if command == "start":
        setup_backend()
    elif command == "test":
        run_tests()
    elif command == "seed":
        print("🌱 Seeding database...")
        try:
            from seed_database import seed_database
            seed_database()
        except Exception as e:
            print(f"❌ Seeding failed: {e}")
    elif command == "help":
        show_help()
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main()