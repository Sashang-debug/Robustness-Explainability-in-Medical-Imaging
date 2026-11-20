#!/usr/bin/env bash

# Kill any existing processes on port 3000 or 8000
echo "Checking existing ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

echo "Starting Local AI Backend (Port 8000)..."
node server.js &
SERVER_PID=$!

echo "Starting Vite Frontend (Port 3000)..."
npm run dev &
VITE_PID=$!

# Wait 2 seconds for servers to initialize
sleep 2

echo "Opening dashboard in browser..."
open http://localhost:3000

echo ""
echo "=========================================================="
echo " Trustworthy Medical AI Dashboard running locally!"
echo " - Frontend: http://localhost:3000"
echo " - Backend:  http://localhost:8000"
echo " Press Ctrl+C to stop both servers."
echo "=========================================================="

trap "kill $SERVER_PID $VITE_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
