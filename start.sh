#!/bin/bash

# Navigate to the backend directory
cd back-end

# Start the FastAPI server with auto-reload in development
uvicorn main:app --host 0.0.0.0 --port $PORT --reload
