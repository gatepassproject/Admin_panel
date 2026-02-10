import os

file_path = r'c:\Users\office\Documents\Gate_Pass\admin_panel2\app\api\users\route.ts'
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(f"Total lines: {len(lines)}")
        print("LAST 20 LINES:")
        for i, line in enumerate(lines[-20:]):
            print(f"{len(lines)-20+i+1}: {repr(line)}")
except Exception as e:
    print(f"Error: {e}")
