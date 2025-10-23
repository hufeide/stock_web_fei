#!/usr/bin/env bash
set -euo pipefail

# One-click runner for local dev (backend + static server + tests)
# Usage: ./scripts/run_all.sh [--no-e2e]

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="/tmp/hkalerts_logs"
mkdir -p "$LOG_DIR"

BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
E2E_LOG="$LOG_DIR/e2e.log"

echo "Starting HK Stock Alerts (root=$ROOT_DIR)"

kill_existing(){
  local name="$1"
  pids=$(pgrep -f "$2" || true)
  if [ -n "$pids" ]; then
    echo "Killing existing $name pids: $pids"
    echo "$pids" | xargs -r kill || true
  fi
}

# stop previous backend and frontend
kill_existing backend "node backend/server.js"
kill_existing frontend "python3 -m http.server 8080"

echo "Starting backend... (logs: $BACKEND_LOG)"
nohup node backend/server.js > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$LOG_DIR/backend.pid"
echo "backend pid: $BACKEND_PID"

echo "Starting static frontend (python3 http.server:8080)... (logs: $FRONTEND_LOG)"
nohup python3 -m http.server 8080 > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$LOG_DIR/frontend.pid"
echo "frontend pid: $FRONTEND_PID"

sleep 1

echo "Running unit tests..."
node tests/unit/test_alert_engine_node.js && node tests/unit/test_popup_override_node.js && node tests/unit/test_watchlist_node.js

if [ "${1:-}" != "--no-e2e" ]; then
  if command -v node >/dev/null 2>&1; then
    if [ -f tests/e2e/inspect_console.js ]; then
      echo "Running E2E (inspect_console.js) - logs: $E2E_LOG"
      node tests/e2e/inspect_console.js > "$E2E_LOG" 2>&1 || true
      echo "E2E logs written to $E2E_LOG"
    fi
  fi
fi

echo "All done. Frontend: http://localhost:8080/frontend/index.html"
echo "Backend health: http://localhost:3000/health"
echo "Logs: $LOG_DIR"
