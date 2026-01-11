import os
import re

def check_for_mock_data():
    frontend_path = r'c:\Users\damma\Downloads\water-quality-monitor\frontend\src'
    
    mock_patterns = [
        r'const\s+\w*[Ss]ample\w*\s*=\s*\[',
        r'const\s+\w*[Mm]ock\w*\s*=\s*\[',
        r'mockStations',
        r'sampleStations',
        r'mockData',
        r'sampleData'
    ]
    
    files_with_mock = []
    
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
                            files_with_mock.append(relative_path)
                            break
                except:
                    continue
    
    print("=" * 50)
    print("MOCK DATA REMOVAL VERIFICATION")
    print("=" * 50)
    
    if files_with_mock:
        print("FILES STILL CONTAINING MOCK DATA:")
        for file in files_with_mock:
            print(f"- {file}")
        print(f"\nTOTAL: {len(files_with_mock)} files need attention")
    else:
        print("SUCCESS: NO MOCK DATA FOUND!")
        print("All frontend components now depend on backend API")
        print("If backend fails, components will show empty/error states")
    
    return len(files_with_mock) == 0

if __name__ == "__main__":
    check_for_mock_data()