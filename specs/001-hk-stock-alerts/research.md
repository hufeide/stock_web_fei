# research.md

**Feature**: HK Stock Alerts
**Date**: 2025-10-23

## R1: East Money data access options

Decision: Use East Money's public market summary endpoints or, if unavailable for HK tickers, fetch the minimal necessary fields by scraping the East Money mobile/desktop quote pages and parsing the DOM for the latest price and percent change.

Rationale: East Money commonly exposes market data in pages that include JSON blobs or predictable DOM elements; for a small-scale internal tool this is the fastest route to live data without integrating paid APIs.

Alternatives considered:
- Official paid market data APIs (more reliable/legal but require keys/fees)
- Other free APIs (may have rate limits, coverage issues)

## R2: Polling frequency and IP safety

Decision: Default polling interval 60s; implement random jitter (±10s) and exponential backoff on repeated failures. Limit concurrent fetches and batch tickers into a single request when possible to reduce request count.

Rationale: 60s balances freshness and load; jitter and batching reduce burst patterns that could lead to blocking.

## R3: Frontend approach

Decision: Implement MVP as a minimal vanilla JavaScript single-page app (single index.html + small src/main.js). Keep code dependency-free to simplify hosting and reduce build complexity. Provide an optional Node.js proxy implementation (server.js) if cross-origin or scraping protection requires server-side fetching.

Rationale: Fastest to prototype and deploy; optional proxy available for more robust data fetching and to protect any server-side credentials.

## Research follow-ups

- Verify East Money DOM selectors or API endpoints for the specific HK tickers to be monitored (implement small test fetch script during Phase 1).
- Determine CORS behavior: if East Money blocks client-side fetches, enable proxy.

*** End of research.md
