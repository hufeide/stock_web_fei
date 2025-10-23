# StockConnect Monitor Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

<!--
Sync Impact Report

Version change: template -> 1.0.0

Modified principles:
- PRINCIPLE_1_NAME -> I. Web-First
- PRINCIPLE_2_NAME -> II. Observability & Monitoring (NON-NEGOTIABLE)
- PRINCIPLE_3_NAME -> III. Minimal Viable Product & Iterative Delivery
- PRINCIPLE_4_NAME -> IV. Data Accuracy & Timeliness
- PRINCIPLE_5_NAME -> V. Security & Privacy

Added sections:
- Development Workflow (concrete guidance for web feature delivery)

Removed sections:
- None

Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/spec-template.md ⚠ pending review
- .specify/templates/agent-file-template.md ⚠ pending review
- .specify/templates/checklist-template.md ⚠ pending review

Follow-up TODOs:
- RATIFICATION_DATE: TODO(RATIFICATION_DATE): original ratification date unknown — please set when known
-->

# StockConnect Monitor Constitution

## Core Principles

### I. Web-First
All user-facing features are designed primarily as web experiences. Implementations
MUST provide a usable single-page or progressive web interface for the primary
user journey. Backends exist to support the web UI and MUST expose stable, testable
APIs. Rationale: the project goal is a lightweight monitoring webpage; design for
fast iteration and deployment to common web hosts.

### II. Observability & Monitoring (NON-NEGOTIABLE)
Every feature that provides runtime behavior MUST include structured logging,
basic metrics (request rates, error rates, data freshness), and a simple
health/readiness endpoint. Monitoring configuration and alert thresholds for
critical failures (data source unreachability, stale data beyond configured
thresholds) MUST be defined in the feature plan. Rationale: monitoring is the core
responsibility of a system that reports real-time financial data.

### III. Minimal Viable Product & Iterative Delivery
Deliver small, independently testable increments. Each user story MUST be
independently deployable and have acceptance tests that validate the user
experience (UI) and data correctness (backend). Prioritize high-value P1
stories that deliver observable results to users quickly. Rationale: reduces
risk and accelerates feedback for correctness of market data display.

### IV. Data Accuracy & Timeliness
Data sources and ingestion strategies MUST be documented for every feature that
relies on external feeds. Implementations MUST handle rate limits, retries with
backoff, and graceful degradation when the primary data source is unavailable
(e.g., cached values with clear staleness indicators). Rationale: financial
monitoring requires explicit handling of freshness and accuracy.

### V. Security & Privacy
Secrets (API keys, credentials) MUST never be checked into source control. The
project MUST use environment-based configuration and follow least-privilege
principles for any credentials. Any user data, logs, or telemetry that may contain
identifiers MUST be minimized or redacted. Rationale: protect sensitive data and
comply with standard security practices.

## Additional Constraints

Target platform: web/ (single-page webapp) with an optional lightweight backend
service for proxying protected APIs. Preferred runtime: Linux-hosted containers
or serverless functions for API work. For the minimal requirement (monitor a
small set of Hong Kong Stock Connect stocks), the implementation MAY be a static
frontend that reads a small backend endpoint; the backend MAY be implemented in
Node.js, Python (FastAPI/Flask), or similar lightweight frameworks.

Performance constraints for MVP: page load under 1.5s on typical broadband;
data refresh interval configurable (default 60s) with an option for manual
refresh. Rate limits and caching MUST be documented in the plan.

## Development Workflow

- Code reviews: All PRs MUST have at least one reviewer and include a
  short testing checklist describing how to validate the feature manually.
- Quality gates: Unit tests for logic, integration or contract tests for
  backend endpoints ingesting external data, and a lightweight end-to-end test
  for the primary UI flow (load page and display latest percent changes).
- CI: Linting and tests run on each PR. Releases include a changelog entry
  referencing the constitution principle(s) the change affects.

## Governance

Amendments: Changes to the constitution MUST be proposed in a PR that includes
the rationale, a migration plan (if required), and semantic version bump
recommendation. For non-substantive wording fixes, a PATCH bump is expected.
Adding a new principle or removing an existing one requires at least a MINOR
bump and a two-person approval. Redefining an existing principle in a way that
breaks prior compliance expectations requires a MAJOR bump and documented
migration steps.

Compliance review: PRs that implement features with external data sources or
security-sensitive code (Secrets handling, auth) MUST include a checklist that
verifies Principles II, IV, and V.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-10-23
