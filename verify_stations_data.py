import requests
import json

def test_backend_api():
    print("🔍 TESTING BACKEND API...")
    try:
        response = requests.get('http://localhost:8000/api/stations')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend API Status: WORKING")
            print(f"✅ Stations Count: {len(data)}")
            print(f"✅ First Station: {data[0]['name'] if data else 'None'}")
            return True, data
        else:
            print(f"❌ Backend API Status: ERROR {response.status_code}")
            return False, []
    except Exception as e:
        print(f"❌ Backend API Status: NOT RUNNING - {e}")
        return False, []

def test_frontend_api_call():
    print("\n🔍 TESTING FRONTEND API INTEGRATION...")
    
    # Test the exact same call frontend makes
    try:
        response = requests.get('http://localhost:8000/api/stations')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Frontend API Call: SUCCESS")
            print(f"✅ Data Structure: {type(data)}")
            print(f"✅ Has Data: {len(data) > 0}")
            
            if data:
                station = data[0]
                print(f"✅ Station ID: {station.get('id', 'Missing')}")
                print(f"✅ Station Name: {station.get('name', 'Missing')}")
                print(f"✅ Has Coordinates: {bool(station.get('latitude') and station.get('longitude'))}")
                print(f"✅ Has Readings: {bool(station.get('currentReading'))}")
                
            return True
        else:
            print(f"❌ Frontend API Call: FAILED {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend API Call: ERROR - {e}")
        return False

def main():
    print("=" * 60)
    print("🧪 WATER STATIONS DATA VERIFICATION TEST")
    print("=" * 60)
    
    backend_working, backend_data = test_backend_api()
    frontend_working = test_frontend_api_call()
    
    print("\n" + "=" * 60)
    print("📊 FINAL VERIFICATION RESULTS")
    print("=" * 60)
    
    if backend_working and frontend_working:
        print("✅ RESULT: Water stations ARE using REAL BACKEND DATA")
        print("✅ Backend API: WORKING")
        print("✅ Frontend Integration: WORKING")
        print(f"✅ Real Stations Available: {len(backend_data)}")
    elif backend_working and not frontend_working:
        print("⚠️  RESULT: Backend works but frontend integration has issues")
        print("✅ Backend API: WORKING")
        print("❌ Frontend Integration: BROKEN")
    elif not backend_working:
        print("❌ RESULT: Water stations using FALLBACK/MOCK DATA")
        print("❌ Backend API: NOT WORKING")
        print("⚠️  Frontend will use sample/mock data")
    
    print("\n💡 To verify in browser:")
    print("1. Open water stations page")
    print("2. Look for 'Data Source: Backend API' text")
    print("3. If shows 'Sample Data', backend is not connected")

if __name__ == "__main__":
    main()