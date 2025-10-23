# Frontend for HK Stock Alerts (MVP)

This folder contains a minimal static frontend.

How to run:
- Serve the project root with a static file server (e.g., `npx http-server .`),
  then open `http://localhost:8080/frontend/index.html`.
- Configure watchlist and endpoint in `frontend/src/config.js`.

Notes:
- By default the frontend expects a `/quote?symbols=...` endpoint returning JSON `{data:[{symbol,latestPrice,percentChange,timestamp}]}`.
- If East Money blocks client requests, run an optional backend proxy (see quickstart.md).
