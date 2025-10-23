# data-model.md

**Feature**: HK Stock Alerts
**Date**: 2025-10-23

## Entities

### Ticker
- id: string (unique symbol code, e.g., 00700.HK)
- name: string
- exchange: string (e.g., HK)

### DataPoint
- tickerId: string (references Ticker.id)
- latestPrice: number
- percentChange: number (e.g., +1.23)
- timestamp: ISO8601 string

### Watchlist
- id: string
- name: string
- tickers: array of tickerId
- createdAt: ISO8601

### AlertRule
- id: string
- targetType: enum [TICKER, WATCHLIST]
- targetId: string (tickerId or watchlistId)
- thresholdPercent: number (positive for upward thresholds, negative for downward)
- direction: enum [UP, DOWN]
- popupEnabled: boolean
- enabled: boolean
- createdAt: ISO8601

### UserSetting
- popupGlobalEnabled: boolean
- defaultRefreshInterval: integer (seconds)
- displayPreferences: object

## Validation Rules
- percentChange must be a finite number (can be negative)
- thresholdPercent absolute value > 0
- timestamp must be ISO8601 and not in the future
- Watchlist tickers must reference existing Ticker ids

## State Transitions
- AlertRule: enabled -> trigger -> record TriggerEvent (id, ruleId, timestamp, dataSnapshot)

*** End of data-model.md
