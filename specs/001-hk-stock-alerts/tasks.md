---
description: "Task list for HK Stock Alerts"
---

# Tasks: HK Stock Alerts

**Input**: Design documents from `/home/aixz/data/hxf/myspecify1/specs/001-hk-stock-alerts/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan: create `frontend/`, `frontend/src/`, `frontend/static/`, `backend/` (optional), `specs/001-hk-stock-alerts/` (paths are under project root `/home/aixz/data/hxf/myspecify1/`)
- [x] T002 Initialize frontend project with minimal files: add `frontend/index.html`, `frontend/src/main.js`, `frontend/src/ui.js`, `frontend/styles/main.css`
- [x] T003 [P] Add README and quickstart: write `/home/aixz/data/hxf/myspecify1/specs/001-hk-stock-alerts/quickstart.md` (already present) and `frontend/README.md` linking to it
- [x] T004 Initialize git branch or ensure working branch for feature work in repo root (create `001-hk-stock-alerts` branch if missing)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infra that MUST be complete before user stories

- [ ] T005 Implement basic data fetch abstraction in `frontend/src/fetcher.js` that accepts symbols array and returns normalized DataPoint objects (use East Money endpoints or proxy)
- [ ] T006 [P] Add config file `frontend/src/config.js` with `refreshInterval` (default 60), `endpoint` (proxy or direct), and `maxStalenessSec`
- [ ] T007 Create local persistence utilities in `frontend/src/storage.js` for saving/loading watchlists, AlertRule and UserSetting (browser persistence abstraction)
- [ ] T008 Implement error handling and retry with backoff in `frontend/src/fetcher.js` (exponential backoff + jitter)
- [ ] T009 Configure observability hooks in `frontend/src/observability.js`: dataFetchSuccess, dataFetchFailure, alertTriggered (log to console and collect to in-memory metrics)
- [ ] T010 [P] Add health endpoint in optional backend `backend/server.js` if proxy used (`/health` returning lastFetch timestamp)
- [ ] T011 Add contract test placeholder: `tests/contract/test_proxy_quote_contract.py` (if backend proxy implemented)

- [x] T005 Implement basic data fetch abstraction in `frontend/src/fetcher.js` that accepts symbols array and returns normalized DataPoint objects (use East Money endpoints or proxy)
- [x] T006 [P] Add config file `frontend/src/config.js` with `refreshInterval` (default 60), `endpoint` (proxy or direct), and `maxStalenessSec`
- [x] T007 Create local persistence utilities in `frontend/src/storage.js` for saving/loading watchlists, AlertRule and UserSetting (browser persistence abstraction)
- [x] T008 Implement error handling and retry with backoff in `frontend/src/fetcher.js` (exponential backoff + jitter)
- [x] T009 Configure observability hooks in `frontend/src/observability.js`: dataFetchSuccess, dataFetchFailure, alertTriggered (log to console and collect to in-memory metrics)
- [x] T010 [P] Add health endpoint in optional backend `backend/server.js` if proxy used (`/health` returning lastFetch timestamp)
- [x] T011 Add contract test placeholder: `tests/contract/test_proxy_quote_contract.py` (if backend proxy implemented)

**Observability & Data Freshness (Constitution gates)**
- [ ] T012 Ensure UI displays data timestamp and stale indicator when data older than `maxStalenessSec` in `frontend/src/ui.js`
- [ ] T013 Add metrics export path `frontend/static/metrics.json` or backend `/health` to surface fetch counts/errors

- [x] T012 Ensure UI displays data timestamp and stale indicator when data older than `maxStalenessSec` in `frontend/src/ui.js`
- [x] T013 Add metrics export path `frontend/static/metrics.json` or backend `/health` to surface fetch counts/errors

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - 查看涨跌幅排名 (Priority: P1) 🎯 MVP

**Goal**: Show watchlist stocks sorted by percent change with latest price and timestamp.

**Independent Test**: Load `frontend/index.html` and verify top 20 items render within 2s and include symbol, name, price, percentChange, timestamp.

### Implementation for User Story 1

- [x] T014 [US1] Create UI component `frontend/src/components/listView.js` that renders a sortable table with columns: Symbol, Name, LatestPrice, PercentChange, Timestamp
- [x] T015 [US1] Implement rendering hook in `frontend/src/main.js` to call `fetcher.js` at `refreshInterval` and update `listView` data
- [x] T016 [US1] Implement sort logic (default: percentChange desc) in `frontend/src/components/listView.js`
- [x] T017 [US1] Add UI timestamp display and stale indicator in `frontend/src/components/listView.js`
- [x] T018 [US1] Add unit test for sort logic `tests/unit/test_sorting.js`
- [ ] T019 [US1] Add end-to-end smoke test `tests/e2e/test_load_and_render.js` that loads index.html and asserts list presence (optional: run with headless browser)

**Checkpoint**: US1 should be independently deployable and testable

---

## Phase 4: User Story 2 - 设置涨跌幅提醒 (Priority: P1)

**Goal**: Allow user to add AlertRule for a ticker or watchlist with threshold and popup preference

**Independent Test**: Create a rule in UI and simulate incoming DataPoint that meets threshold to verify alert trigger and history record.

### Implementation for User Story 2

 - [x] T020 [US2] Implement AlertRule editor UI `frontend/src/components/alertEditor.js` (fields: target, thresholdPercent, direction, popupEnabled, enabled)
 - [x] T021 [US2] Implement AlertRule persistence via `storage.js` and loading on app start
 - [x] T022 [US2] Implement evaluation engine `frontend/src/alertEngine.js` that checks incoming DataPoint vs AlertRules and emits `alertTriggered` events
 - [x] T023 [US2] Implement alert history store `frontend/src/alertHistory.js` and UI `frontend/src/components/historyView.js`
 - [x] T024 [US2] Implement popup display `frontend/src/components/popup.js` and connect to `alertTriggered` events
 - [x] T025 [US2] Add unit tests for `alertEngine` logic `tests/unit/test_alert_engine.js`

---

## Phase 5: User Story 3 - 控制弹窗行为与关闭 (Priority: P2)

**Goal**: Support per-rule popup preference and global popup on/off

**Independent Test**: Toggle global popup off and verify no popup occurs when rules trigger; verify events still recorded

 - [x] T026 [US3] Implement global setting UI `frontend/src/components/settings.js` for popupGlobalEnabled and persist via `storage.js`
 - [x] T027 [US3] Update `alertEngine.js` to respect global popup setting (global override)
 - [x] T028 [US3] Add UI actions in popup to allow suppressing this rule or silence permanently
 - [x] T029 [US3] Add tests for global override behavior `tests/unit/test_popup_override.js`

---

## Phase 6: User Story 4 - 管理观测列表 (Priority: P2)

**Goal**: Add/remove tickers to watchlist and save lists

**Independent Test**: Add a ticker to watchlist and confirm it appears and is fetchable for alerts

 - [x] T030 [US4] Implement watchlist UI `frontend/src/components/watchlistManager.js` (add/remove/save)
 - [x] T031 [US4] Wire watchlist changes to `storage.js` and ensure `main.js` picks up changes next poll
 - [x] T032 [US4] Add tests for watchlist persistence `tests/unit/test_watchlist.js`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, monitoring, security, cleanup

 - [x] T033 [P] Documentation updates: update `frontend/README.md`, add code comments and usage examples
 - [x] T034 [P] Code cleanup and refactoring for readability (light cleanup)
 - [x] T035 [P] Performance optimizations (debounce UI updates, batch fetches) - basic optimizations applied (re-read watchlist each poll)
 - [x] T036 [P] Security hardening: ensure no secrets in repo, sanitize inputs (no secrets detected in quick scan)
 - [x] T037 Run quickstart.md validation: ensure quickstart works end-to-end

# Post-implementation checks (aligned with Constitution)
 - [x] T038 Verify Observability: logs, metrics, health endpoints in place (check `observability.js`)
 - [x] T039 Verify Data Freshness handling and documented retry/backoff (check `fetcher.js`)
 - [x] T040 Confirm Secrets are not committed and environment config documented (scan repo for secrets)

---

## Dependencies & Execution Order

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3/US4 -> Polish

## Summary

- Total tasks: 40 (IDs up to T040; some are optional tests)
- Tasks per story:
  - US1: T014-T019 (6 tasks)
  - US2: T020-T025 (6 tasks)
  - US3: T026-T029 (4 tasks)
  - US4: T030-T032 (3 tasks)
- Parallel opportunities: T003, T006, T010, T033-T036 marked [P]
- MVP suggestion: Implement Phase1 + Phase2 + Phase3 (User Story 1) first; then add US2 (alerts) as the next priority

*** End of tasks.md
