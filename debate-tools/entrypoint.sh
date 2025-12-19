#!/bin/sh
# When Switching to linux prod environment, run 'chmod +x entrypoint.sh' to turn this file to an executable

echo "Running Migrations..."
python manage.py migrate

echo "Starting Server..."
python manage.py runserver 0.0.0.0:8000