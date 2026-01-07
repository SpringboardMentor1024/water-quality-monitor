#!/usr/bin/env python3
"""
Simple Backend Starter
"""
import subprocess
import sys
import requests

def check_backend():
    try:
        response = requests.get("http://localhost:8000/", timeout=2)
        if response.status_code == 200:
            print("Backend is RUNNING on http://localhost:8000")
            print("API docs: http://localhost:8000/docs")
            return True
    except:
        pass
    
    print("Backend is NOT running")
    return False

def start_backend():
    print("Starting backend server...")
    print("Server: http://localhost:8000")
    print("API docs: http://localhost:8000/docs")
    print("Press Ctrl+C to stop")
    print("-" * 40)
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("Backend stopped")
    except Exception as e:
        print(f"Error: {e}")
        print("Try: pip install uvicorn[standard]")

if __name__ == "__main__":
    print("BACKEND STATUS")
    print("=" * 20)
    
    if not check_backend():
        start_backend()
    else:
        print("Backend already running!")
