#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Start Gunicorn with the configuration file
echo "Starting Gunicorn..."
exec gunicorn --config gunicorn_config.py backend.wsgi:application
