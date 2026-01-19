#!/usr/bin/env python3
"""
Mock Data Verification Script
Verifies that all mock data has been removed from the frontend
"""

import os
import re
from pathlib import Path

# Define patterns to search for (mock data indicators)
MOCK_DATA_PATTERNS = [
    r'mockStations\s*=',
    r'mockProjects\s*=',
    r'mockActivities\s*=',
    r'mockAlerts\s*=',
    r'mockReports\s*=',
    r'mockData\s*=',
    r'sampleData\s*=',
    r'const\s+\w+\s*=\s*\[\s*\{\s*id\s*:\s*1',  # Hardcoded array data
    r'fakeData',
]

# Paths to exclude
EXCLUDE_PATTERNS = [
    'node_modules',
    '.git',
    '.next',
    'build',
    'dist',
]

def should_exclude(path):
    """Check if path should be excluded"""
    path_str = str(path).lower()
    return any(exclude.lower() in path_str for exclude in EXCLUDE_PATTERNS)

def find_mock_data(directory):
    """Find all mock data patterns in JavaScript files"""
    results = []
    
    js_files = Path(directory).rglob('*.js')
    
    for js_file in js_files:
        if should_exclude(js_file):
            continue
            
        try:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                
                for i, line in enumerate(lines, 1):
                    for pattern in MOCK_DATA_PATTERNS:
                        if re.search(pattern, line, re.IGNORECASE):
                            # Check if it's a real mock data definition (not a comment or string)
                            if not line.strip().startswith('//') and not line.strip().startswith('*'):
                                results.append({
                                    'file': str(js_file),
                                    'line': i,
                                    'content': line.strip(),
                                    'pattern': pattern
                                })
        except Exception as e:
            print(f"Error reading {js_file}: {e}")
    
    return results

def main():
    """Main verification function"""
    print("=" * 80)
    print("MOCK DATA VERIFICATION SCRIPT")
    print("=" * 80)
    print()
    
    frontend_dir = Path(__file__).parent / 'frontend' / 'src'
    
    if not frontend_dir.exists():
        print(f"❌ Frontend directory not found: {frontend_dir}")
        return False
    
    print(f"Scanning: {frontend_dir}")
    print()
    
    results = find_mock_data(frontend_dir)
    
    if not results:
        print("✅ NO MOCK DATA FOUND!")
        print()
        print("Status: VERIFIED - All mock data has been removed from frontend")
        print()
        return True
    else:
        print(f"❌ FOUND {len(results)} POTENTIAL MOCK DATA INSTANCES:")
        print()
        
        for result in results:
            print(f"File: {result['file']}")
            print(f"Line: {result['line']}")
            print(f"Content: {result['content']}")
            print(f"Pattern: {result['pattern']}")
            print("-" * 80)
        
        return False

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)
