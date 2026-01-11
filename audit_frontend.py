import os
import re

def check_file_for_mock_data(filepath):
    """Check if a file contains mock/sample data or uses real API calls"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Patterns that indicate mock data
        mock_patterns = [
            r'const\s+\w*[Ss]ample\w*\s*=\s*\[',
            r'const\s+\w*[Mm]ock\w*\s*=\s*\[',
            r'return\s*\[.*\{.*id.*name.*\}',
            r'mockStations',
            r'sampleStations',
            r'mockData',
            r'sampleData',
            r'// Return mock',
            r'// Mock data',
            r'// Sample data'
        ]
        
        # Patterns that indicate real API calls
        api_patterns = [
            r'fetch\s*\(\s*[\'"`].*api/',
            r'await\s+fetch\s*\(',
            r'stationsAPI\.',
            r'alertsAPI\.',
            r'reportsAPI\.',
            r'authAPI\.',
            r'API_BASE',
            r'localhost:8000'
        ]
        
        mock_found = []
        api_found = []
        
        for pattern in mock_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                mock_found.extend(matches)
        
        for pattern in api_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                api_found.extend(matches)
        
        return {
            'has_mock': len(mock_found) > 0,
            'has_api': len(api_found) > 0,
            'mock_patterns': mock_found,
            'api_patterns': api_found
        }
    except Exception as e:
        return {'error': str(e)}

def audit_frontend():
    frontend_path = r'c:\Users\damma\Downloads\water-quality-monitor\frontend\src'
    
    # Files to check
    files_to_check = []
    
    # Walk through all JS/JSX files
    for root, dirs, files in os.walk(frontend_path):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                files_to_check.append(os.path.join(root, file))
    
    print("=" * 80)
    print("FRONTEND MOCK DATA AUDIT")
    print("=" * 80)
    
    problematic_files = []
    good_files = []
    
    for filepath in files_to_check:
        relative_path = filepath.replace(frontend_path, '').replace('\\', '/')
        result = check_file_for_mock_data(filepath)
        
        if 'error' in result:
            continue
            
        if result['has_mock'] and not result['has_api']:
            # File has mock data but no API calls - PROBLEM
            problematic_files.append({
                'file': relative_path,
                'issue': 'USES MOCK DATA ONLY',
                'details': result
            })
        elif result['has_mock'] and result['has_api']:
            # File has both mock and API - might be fallback (OK)
            good_files.append({
                'file': relative_path,
                'status': 'HAS FALLBACK',
                'details': result
            })
        elif result['has_api']:
            # File uses API calls - GOOD
            good_files.append({
                'file': relative_path,
                'status': 'USES REAL API',
                'details': result
            })
    
    # Report problematic files
    if problematic_files:
        print("\nPROBLEMATIC FILES (USING MOCK DATA ONLY):")
        print("-" * 50)
        for item in problematic_files:
            print(f"FILE: {item['file']}")
            print(f"ISSUE: {item['issue']}")
            print(f"MOCK PATTERNS: {item['details']['mock_patterns'][:3]}")
            print()
    
    # Report good files
    print("\nGOOD FILES (USING REAL API):")
    print("-" * 50)
    for item in good_files:
        if 'api' in item['file'].lower() or 'service' in item['file'].lower():
            print(f"FILE: {item['file']} - {item['status']}")
    
    # Summary
    print("\n" + "=" * 80)
    print("AUDIT SUMMARY")
    print("=" * 80)
    print(f"PROBLEMATIC FILES: {len(problematic_files)}")
    print(f"GOOD FILES: {len(good_files)}")
    
    if problematic_files:
        print("\nACTION REQUIRED:")
        print("The following files need to be updated to use real backend data:")
        for item in problematic_files:
            print(f"- {item['file']}")
    else:
        print("\nRESULT: ALL FILES ARE USING REAL BACKEND DATA!")
    
    return problematic_files

if __name__ == "__main__":
    audit_frontend()