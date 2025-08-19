#!/bin/bash

# Exit on error
set -e

# Upgrade pip
echo "🚀 Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Setup completed successfully!"
