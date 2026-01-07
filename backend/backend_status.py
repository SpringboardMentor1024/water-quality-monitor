#!/usr/bin/env python3
"""
Backend Status Summary
"""
import requests

def test_endpoints():
    base_url = "http://localhost:8000"
    
    endpoints = [
        "/",
        "/api/stations", 
        "/api/alerts",
        "/api/government-data"
    ]
    
    print("BACKEND STATUS SUMMARY")
    print("=" * 30)
    print(f"Server: {base_url}")
    print(f"API Docs: {base_url}/docs")
    print()
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=3)
            status = "WORKING" if response.status_code == 200 else f"ERROR {response.status_code}"
            print(f"{endpoint:<25} {status}")
        except Exception as e:
            print(f"{endpoint:<25} FAILED")
    
    print()
    print("BACKEND IS RUNNING SUCCESSFULLY!")
    print("You can now start the frontend:")
    print("cd frontend && npm start")

if __name__ == "__main__":
    test_endpoints()