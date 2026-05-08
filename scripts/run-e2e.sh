#!/usr/bin/env bash
set -euo pipefail

rm -rf .next

LOG_FILE="${TMPDIR:-/tmp}/zhiyu-e2e-next.log"
next dev -p 3100 >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 60); do
  status=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3100 || true)
  if [ "$status" = "200" ]; then
    npx playwright test
    exit $?
  fi
  sleep 1
done

echo "Next dev server did not become ready. Last log lines:" >&2
tail -80 "$LOG_FILE" >&2 || true
exit 1
