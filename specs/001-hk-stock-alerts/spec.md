# Feature Specification: HK Stock Alerts

**Feature Branch**: `001-hk-stock-alerts`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: 用户描述："我想要一个简要的网页，可以将涨跌幅排名，并且可以设置涨跌幅提醒，如果超过预设的涨跌幅，可以进行网页跳出，也可以关闭跳出来的功能。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 查看涨跌幅排名 (Priority: P1)

作为一个普通用户，打开网页后可以看到所选股票列表，按涨跌幅排序，默认按降序显示（涨幅从高到低）。

**Why this priority**: 这是该产品的核心价值——快速了解涨跌幅排名。

**Independent Test**: 手动打开页面或自动化端到端测试，页面应在加载后显示排名列表并包含时间戳。

**Acceptance Scenarios**:

1. **Given** 页面加载完成, **When** 市场数据正常, **Then** 显示按涨跌幅排序的股票列表，包含：代码/名称、最新价格、涨跌幅（百分比）、数据时间戳。
2. **Given** 网络延迟或部分数据不可用, **When** 页面加载, **Then** 显示已取得数据并对缺失数据项显示“数据暂不可用”并提供刷新按钮。

---

### User Story 2 - 设置涨跌幅提醒 (Priority: P1)

用户可以为单只股票或一个观测列表设置上升或下降的百分比阈值提醒（例如：+3% 或 -2%）。

**Why this priority**: 提醒功能是用户主动管理风险和机会的关键交互。

**Independent Test**: 在界面中创建一个提醒规则；当后端/前端监测到规则条件满足时触发提醒。

**Acceptance Scenarios**:

1. **Given** 用户为股票 A 设置提醒 +2% 并启用弹窗, **When** 实时涨幅 >= +2%, **Then** 浏览器内显示可见的提醒（弹窗/通知），并在提醒面板记录一次触发事件。
2. **Given** 用户为股票 B 设置提醒 -3% 并关闭弹窗, **When** 实时涨幅 <= -3%, **Then** 不弹出窗口，但在提醒历史/通知中心记录该事件，用户可查看。

---

### User Story 3 - 控制弹窗行为与关闭 (Priority: P2)

用户可以在提醒规则中选择是否使用页面弹窗提醒；另可在全局设置中暂停/关闭所有即时弹窗。

**Why this priority**: 给用户控制提醒噪音的能力，避免过多中断。

**Independent Test**: 创建规则开启弹窗并验证触发时弹窗出现；然后在设置中关闭弹窗并验证不再出现。

**Acceptance Scenarios**:

1. **Given** 弹窗已启用并规则满足, **When** 触发, **Then** 弹窗出现且提供“关闭此规则弹窗/永不弹出/稍后提醒”等操作。
2. **Given** 全局关闭弹窗, **When** 任一规则满足, **Then** 不弹出任何窗口，但事件仍记录在提醒历史。

---

### User Story 4 - 管理观测列表 (Priority: P2)

用户可以添加或删除观测的股票代码以构成监控列表（watchlist），并可保存常用列表。

**Why this priority**: 便于用户聚焦关心的股票集合。

**Independent Test**: 在 UI 中添加/删除股票并验证列表即时更新，且提醒规则可关联到该列表或单独股票。

**Acceptance Scenarios**:

1. **Given** 用户在 watchlist 中添加股票 C, **When** 添加成功, **Then** 列表显示股票 C 并可为其设置提醒。

---

### Edge Cases

- 当数据源短时间不可用时，系统应显示缓存或提示 "数据暂不可用" 并允许用户手动刷新。
- 用户同时为大量（>100）只股票设置提醒时，应逐步提示性能/频率限制（实现可采用分页或分批订阅）。
- 重复规则：为同一股票、同一阈值设置重复规则时，界面应提示并合并或让用户确认。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 页面 MUST 显示所选股票的涨跌幅排名列表，包括：股票代码/名称、最新价、涨跌幅（%）、数据时间戳。
- **FR-002**: 用户 MUST 能够添加/删除 watchlist 中的股票。
- **FR-003**: 用户 MUST 能为单只股票或 watchlist 设置提醒规则，规则包含：股票/列表标识、阈值（%）、方向（上升/下降）、是否弹窗启用、是否启用该规则。
- **FR-004**: 当数据满足任一启用规则时，系统 MUST 触发提醒并在提醒历史中记录一条触发事件；如果规则设置为弹窗，页面 MUST 显示明显的弹窗或通知。
- **FR-005**: 用户 MUST 能在全局设置中启用/禁用页面弹窗行为（开/关），该设置优先于单条规则的弹窗偏好（即全局关闭时不弹窗）。
- **FR-006**: 提醒规则和用户设置 MUST 在浏览器刷新后仍然存在（即持久化），并在用户明确删除或重置前保留。
- **FR-007**: 页面 MUST 显示数据最后更新时间戳，且当数据超过配置的最大可接受滞后（默认 60s）时，页面应有明显的“数据已过期/可能不新鲜”提示。

### Key Entities *(include if feature involves data)*

- **Ticker**: 股票标识（代码、名称）
- **DataPoint**: 单个报价记录（最新价、涨跌幅、timestamp）
- **Watchlist**: 用户保存的一组 Ticker
- **AlertRule**: 触发规则（id、targetTicker 或 watchlistId、thresholdPercent、direction、popupEnabled、enabled、createdAt）
- **UserSetting**: 全局设置（popupEnabled 全局开关、defaultRefreshInterval、displayPreferences）

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 页面在正常网络条件下加载并在 2 秒内展示前 20 个股票的涨跌幅信息（从首次请求到渲染）。
- **SC-002**: 当任一启用的提醒规则条件满足时，提醒在不超过 60 秒的刷新窗口内触发并在 UI 中可见（弹窗或通知）。
- **SC-003**: 用户可以在不超过 1 分钟内完成从打开页面到创建第一个提醒规则（端到端操作）。
- **SC-004**: 在 95% 的正常触发场景下，提醒记录应被持久化并可在提醒历史中查询到。
- **SC-005**: 页面在数据滞后超过默认阈值（60s）时，明确显示“数据可能不新鲜”，并在 99% 的测试场景中正确触达该状态。

## Assumptions

- 默认数据刷新间隔为 60s，可配置为更短或更长。
- 初始实现接受匿名用户（无需登录），提醒规则和设置将使用浏览器本地持久化以保留用户偏好（跨设备同步需额外后端支持，为可选扩展）。
- 数据源为可访问的行情 API（项目将记录具体数据源并处理频率限制与重试策略，这些在 plan 阶段详细说明）。

## Dependencies

- 外部行情数据源（需要在 plan 中明确选型与接入方式）
- 如果需要跨设备持久化：后端存储（可选）

## Notes

- 本规范专注于“什么”与“为什么”，不包含具体实现技术栈或 API 细节。
- 在进入 plan 阶段应补充：数据源选型、刷新/订阅策略、持久化策略、性能目标的具体测试配置。


---

SUCCESS: spec ready for planning
