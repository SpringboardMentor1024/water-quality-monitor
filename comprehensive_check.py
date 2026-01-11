import os
import re
import requests

def check_all_frontend_backend_connections():
    print("=" * 70)
    print("COMPREHENSIVE FRONTEND-BACKEND CONNECTION AUDIT")
    print("=" * 70)
    
    # 1. Test all backend APIs
    print("\n1. BACKEND API STATUS")
    print("-" * 40)
    
    apis = {
        '/api/stations': 'Water Stations',
        '/api/alerts': 'Alerts',
        '/api/reports': 'User Reports', 
        '/api/stations/1/readings': 'Station Readings',
        '/api/government-data': 'Government Data'
    }
    
    working_apis = []
    failed_apis = []
    
    for endpoint, name in apis.items():
        try:
            response = requests.get(f'http://localhost:8000{endpoint}')
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 1
                print(f"SUCCESS {name}: {count} records")
                working_apis.append(name)
            else:
                print(f"ERROR {name}: Status {response.status_code}")
                failed_apis.append(name)
        except Exception as e:
            print(f"ERROR {name}: Connection failed")
            failed_apis.append(name)
    
    # 2. Check frontend files for errors
    print(f"\n2. FRONTEND FILES ERROR CHECK")
    print("-" * 40)
    
    frontend_path = r'c:\Users\damma\Downloads\water-quality-monitor\frontend\src'
    error_patterns = [
        r'console\.error',
        r'throw new Error',
        r'\.catch\(',
        r'try.*catch',
        r'error',
        r'Error',
        r'failed',
        r'Failed'
    ]
    
    files_with_errors = []
    
    for root, dirs, files in os.walk(frontend_path):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    error_count = 0
                    for pattern in error_patterns:
                        matches = re.findall(pattern, content, re.IGNORECASE)
                        error_count += len(matches)
                    
                    if error_count > 2:  # More than 2 error-related patterns
                        relative_path = filepath.replace(frontend_path, '').replace('\\', '/')
                        files_with_errors.append((relative_path, error_count))
                except:
                    continue
    
    if files_with_errors:
        print("FILES WITH POTENTIAL ERRORS:")
        for file_path, count in files_with_errors[:5]:  # Show top 5
            print(f"  {file_path}: {count} error patterns")
    else:
        print("NO MAJOR ERROR PATTERNS FOUND")
    
    # 3. Check for mock data (should be 0)
    print(f"\n3. MOCK DATA CHECK")
    print("-" * 40)
    
    mock_patterns = [r'mock', r'sample', r'fake', r'demo.*data']
    mock_files = []
    
    for root, dirs, files in os.walk(frontend_path):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    for pattern in mock_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            relative_path = filepath.replace(frontend_path, '').replace('\\', '/')
                            mock_files.append(relative_path)
                            break
                except:
                    continue
    
    if mock_files:
        print(f"ERROR: MOCK DATA FOUND in {len(mock_files)} files")
        for file in mock_files[:3]:
            print(f"  {file}")
    else:
        print("SUCCESS: NO MOCK DATA FOUND")
    
    # 4. Check API connections in files
    print(f"\n4. API CONNECTION CHECK")
    print("-" * 40)
    
    api_patterns = [
        r'fetch\s*\(\s*[\'"`].*localhost:8000',
        r'stationsAPI\.',
        r'alertsAPI\.',
        r'reportsAPI\.',
        r'authAPI\.'
    ]
    
    connected_files = []
    
    for root, dirs, files in os.walk(frontend_path):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    for pattern in api_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            relative_path = filepath.replace(frontend_path, '').replace('\\', '/')
                            connected_files.append(relative_path)
                            break
                except:
                    continue
    
    print(f"SUCCESS: {len(connected_files)} files connected to backend")
    
    # 5. Final status
    print(f"\n" + "=" * 70)
    print("FINAL STATUS")
    print("=" * 70)
    
    if len(working_apis) >= 4 and len(mock_files) == 0 and len(connected_files) >= 20:
        print("SUCCESS: ALL FRONTEND CONNECTED TO REAL BACKEND DATA")
        print(f"Working APIs: {len(working_apis)}/5")
        print(f"Mock Data Files: {len(mock_files)}")
        print(f"Connected Files: {len(connected_files)}")
        print("\nYour milestone deliverables are complete!")
    else:
        print("ISSUES FOUND:")
        if len(working_apis) < 4:
            print(f"- Backend APIs: {len(working_apis)}/5 working")
        if len(mock_files) > 0:
            print(f"- Mock data still exists in {len(mock_files)} files")
        if len(connected_files) < 20:
            print(f"- Only {len(connected_files)} files connected to backend")
    
    return len(working_apis) >= 4 and len(mock_files) == 0

if __name__ == "__main__":
    check_all_frontend_backend_connections()