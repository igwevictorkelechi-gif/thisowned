#!/bin/bash
set -e

# Install pip with --break-system-packages since environment is managed by uv
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py --break-system-packages

# Remove BOM from requirements.txt if present
python3 -c "
import sys
with open('requirements.txt', 'rb') as f:
    content = f.read()
if content.startswith(b'\xef\xbb\xbf'):
    with open('requirements.txt', 'wb') as f:
        f.write(content[3:])
"

# Install dependencies with --break-system-packages
python3 -m pip install --break-system-packages -r requirements.txt

# Run migrations (uncomment if needed)
# python3 manage.py migrate

# Collect static files
python3 manage.py collectstatic --noinput