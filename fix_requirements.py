#!/usr/bin/env python
"""
Aggressively fix requirements.txt by completely rewriting it cleanly.
Run this in your repo root directory.
"""
import sys

# Define clean requirements list
REQUIREMENTS = [
    "requests",
    "Django==4.2.15",
    "django-cors-headers==4.4.0",
    "djangorestframework==3.15.2",
    "django-shortuuidfield==0.1.3",
    "pillow==10.4.0",
    "whitenoise==6.7.0",
    "gunicorn==23.0.0",
    "django-storages==1.14.4",
    "psycopg2-binary==2.9.9",
    "djangorestframework-simplejwt==5.3.1",
    "supabase==2.7.4",
    "pycountry==24.6.1",
    "beautifulsoup4==4.12.3",
]

requirements_path = "requirements.txt"

try:
    # Read old file to show what was there
    print("Reading old requirements.txt...")
    try:
        with open(requirements_path, 'rb') as f:
            old_content = f.read()
        print(f"Old file size: {len(old_content)} bytes")
        print(f"First 20 bytes (hex): {old_content[:20].hex()}")
    except Exception as e:
        print(f"Warning: Could not read old file: {e}")
    
    # Write clean file with proper UTF-8 encoding (no BOM)
    print("\nWriting clean requirements.txt...")
    clean_content = '\n'.join(REQUIREMENTS) + '\n'
    
    with open(requirements_path, 'w', encoding='utf-8') as f:
        f.write(clean_content)
    
    print("✅ requirements.txt rewritten successfully")
    
    # Verify
    print("\nVerifying...")
    with open(requirements_path, 'rb') as f:
        new_content = f.read()
    
    if new_content.startswith(b'\xef\xbb\xbf'):
        print("❌ BOM still present!")
        sys.exit(1)
    
    print(f"✅ New file size: {len(new_content)} bytes")
    print(f"First 20 bytes (hex): {new_content[:20].hex()}")
    
    # Show content
    print("\nFile content:")
    print(new_content.decode('utf-8')[:100])
    print("...")
    
except Exception as e:
    print(f"❌ Error: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)