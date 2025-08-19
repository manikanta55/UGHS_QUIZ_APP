#!/bin/bash
set -e

echo "🚀 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories if they don't exist
mkdir -p logs