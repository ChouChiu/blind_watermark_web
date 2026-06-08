#!/bin/bash
# Start both backend and frontend for development

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting Blind Watermark Web..."

# Start backend
echo "[1/2] Starting FastAPI backend on port 8000..."
cd "$ROOT_DIR/backend"
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start frontend
echo "[2/2] Starting Next.js frontend on port 3000..."
cd "$ROOT_DIR/frontend"
bun run dev &
FRONTEND_PID=$!

echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press 'q' to stop both services"

cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

while true; do
    read -r -n 1 key
    if [[ "$key" == "q" || "$key" == "Q" ]]; then
        cleanup
    fi
done
