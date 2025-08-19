#!/bin/bash
cd back-end
uvicorn main:app --host 0.0.0.0 --port $PORT
