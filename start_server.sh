#!/bin/bash

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "PHP is not installed. Please install PHP 7.4 or higher."
    exit 1
fi

# Check if SQLite3 extension is enabled
if ! php -m | grep -q sqlite3; then
    echo "SQLite3 extension is not enabled. Please enable it in your PHP configuration."
    exit 1
fi

# Create necessary directories and files
mkdir -p sounds
touch game_data.db
chmod 666 game_data.db

# Start PHP server
echo "Starting PHP server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
php -S localhost:8000 