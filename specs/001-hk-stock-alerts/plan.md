# Implementation Plan: HK Stock Alerts

**Branch**: `001-hk-stock-alerts` | **Date**: 2025-10-23 | **Spec**: /home/aixz/data/hxf/myspecify1/specs/001-hk-stock-alerts/spec.md
**Input**: Feature specification from `/home/aixz/data/hxf/myspecify1/specs/001-hk-stock-alerts/spec.md`

## Summary

实现最简 MVP：一个前端单页应用（SPA），展示用户 watchlist 中股票的涨跌幅排名，并支持为单只股票或 watchlist 设置涨跌幅提醒。实时数据通过抓取/调用 东方财富（East Money） 提供的行情接口或页面（按 plan 中选型）获取。提醒条件满足时，按照用户偏好触发页面弹窗或仅记录历史。初期匿名用户，本地持久化提醒与设置。

## Technical Context

**Language/Version**: NEEDS CLARIFICATION (前端可采用纯 HTML/JS 或 React/Vite 等；后端（若需要）可选 Node.js/Flask）
**Primary Dependencies**: NEEDS CLARIFICATION (前端：无依赖或小框架；后端：轻量 HTTP server)
**Storage**: Browser local persistence for MVP (no server-side DB)
**Testing**: Unit tests for core logic; end-to-end tests for UX flows (recommended)
**Target Platform**: Web (desktop and mobile responsive)
**Project Type**: web
**Performance Goals**: 页面首屏在 2s 内加载并渲染前 20 条（正常网络）；接口轮询/刷新默认 60s
**Constraints**: 遵守 东方财富 的访问频率与使用条款；避免频繁抓取导致 IP 被封
**Scale/Scope**: MVP 目标单用户 / 单浏览器实例即可；后续扩展到跨设备同步需后端支持

## Constitution Check

- Observability: Plan requires logs for: data fetch success/failure, data freshness timestamp, alert triggers. Add simple metrics endpoint if backend exists; otherwise instrument console/logging and an exportable metrics JSON path.
- Data Freshness: Max acceptable staleness = 60s (default). Strategy: polling every `refreshInterval` (default 60s), fallback to cached values and display stale indicator; retries with exponential backoff for fetch failures.
- Secrets & Security: No secrets required for client-only MVP. If a backend proxy or API key becomes necessary, store keys in environment variables and never in repo.

## Project Structure

Selected structure: Minimal web app with optional backend proxy.

```
frontend/
  index.html
  src/
    main.js
    components/
    styles/
  static/
backend/ (optional proxy)
  server.js or app.py

specs/001-hk-stock-alerts/
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/
```

## Complexity Tracking

No constitution gate violations anticipated for MVP: Observability and Data Freshness handled via polling and clear UI indicators; Secrets not required for client-only MVP.

## Phase 0: Research tasks

- Research task R1: Confirm available East Money endpoints or HTML patterns for fetching HK stock quotes suitable for small-scale polling. (Responsible: researcher)
- Research task R2: Determine acceptable scraping/polling frequency in practice to avoid IP blocking and confirm Terms of Service implications.
- Research task R3: Identify simple, minimal frontend approach (pure JS vs small framework) balancing developer speed and maintainability.


*** End of Plan
