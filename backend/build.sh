#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line to run any necessary migrations
python manage.py migrate

# Create static directory if it doesn't exist
mkdir -p static

# Collect static files
python manage.py collectstatic --no-input
