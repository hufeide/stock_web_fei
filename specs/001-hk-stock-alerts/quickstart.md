# quickstart.md

## HK Stock Alerts - Quickstart (MVP)

This quickstart shows how to run the minimal prototype locally.

### Option A: Static frontend only (no proxy)
1. Open `frontend/index.html` in a browser.
2. Configure the default watchlist in `src/main.js` (array of ticker symbols).
3. The page will poll East Money endpoints; if blocked by CORS, use Option B.

### Option B: With optional Node.js proxy
1. Create `backend/server.js` with a small express server that implements `/quote` by fetching/parsing East Money pages (example in `templates/proxy-example.js`).
2. Install dependencies and run:

```bash
# in backend/
npm install express node-fetch
node server.js
```

3. Open `frontend/index.html`, configure the proxy URL in `src/main.js`.

### Notes
- Default refresh interval: 60s (configurable in UI).
- If web scraping is required, ensure the proxy includes rate limiting and respects East Money TOS.

*** End of quickstart.md
