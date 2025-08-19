#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")/back-end"

# Start the FastAPI server
exec python -m uvicorn main:app --host 0.0.0.0 --port $PORT