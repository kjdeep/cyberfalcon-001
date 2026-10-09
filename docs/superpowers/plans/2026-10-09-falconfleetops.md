# FalconFleetOps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a demo-ready v1 of FalconFleetOps, an industrial cross-brand robot fleet operations console backed by a Python gateway simulator and production-shaped backend, firmware, infra, GTM, and compliance documentation.

**Architecture:** Keep the current Vite/React host as the operational UI and use a small, deterministic seed layer so every feature is demonstrable without external services. Add a production-shaped monorepo around it: NestJS/Prisma module boundaries, Python gateway adapters and simulator, firmware signing CLI, PostgreSQL schema, Docker/CI/Terraform, and decision-grade docs. The UI consumes typed local seed data now while the backend contracts, audit chain, anomaly rules, and simulator are executable independently.

**Tech Stack:** React + TypeScript + Vite + Tailwind v4 + Lucide + Recharts; TypeScript/NestJS/Prisma contract; Python 3.11/asyncio/SQLite/MQTT adapter interfaces; PostgreSQL + Redis + TimescaleDB decision; Docker Compose; Terraform; GitHub Actions; Playwright contract.

**Spec:** `/home/ubuntu/upload/pasted_content.txt`

## Global Constraints

- Product name is **FalconFleetOps**; use the supplied falcon image as the real product mark.
- Product pillars are Observe, Predict, Update, Fix, and Prove; all five must be visible in the v1 experience.
- The default view is a fleet health dashboard with KPI header, live heartbeat, filters, robot tiles, and drill-down.
- Dark and light themes, responsive 768px+ tablet behavior, and tap targets of at least 48px are required.
- Gateway adapters must implement discover(), poll(), to_normalized_telemetry(), read_firmware_version(), and push_firmware().
- The simulator must generate mixed-fleet telemetry and scripted battery, motor-temperature, encoder-drift, and communications failures.
- Firmware updates must show staged rollout, signature verification, health-gated rollback, and an explicit trust-chain design.
- Audit events are append-only, SHA-256 hash chained, and exportable as Verifiable JSON.
- No secrets in code; all tenant and safety assumptions must be documented.
- Every deliverable is shipped with tests or an executable verification path, and no document may contain unfilled placeholder copy.

## Design System

- **Design Read:** operational dashboard for warehouse ops managers and RaaS/insurance partners; restrained industrial control-room language; greenfield extension of the supplied falcon identity.
- **Dials:** visual variance 4 (stable rail and grid, deliberate asymmetry in the hero telemetry panel), motion 3 (state feedback and one live pulse), information density 9 (high scanability), asset dependence 4 (logo carries recognition; interface carries the rest), brand fidelity 8 (retain red falcon and technical feel while moving away from cyber-neon).
- **Movement:** information architecture / Bloomberg-terminal discipline translated into a warm industrial SaaS console.
- **Core principles:** signal before decoration; evidence beside action; dense but calm; every status has a semantic color and a next step.
- **Color philosophy:** deep slate surfaces lower glare on warehouse tablets; amber is the ownable safety signal; red is reserved for faults; mint means verified health; blue is informational only.
- **Layout paradigm:** fixed left rail + compact command header + asymmetric dashboard grid; charts and tables use open canvas and dividers instead of card stacks everywhere.
- **Signature elements:** falcon mark in the rail, amber live-heartbeat line, monospaced KPI numerals with status glyphs.
- **Interaction:** every action exposes consequence and evidence; destructive firmware controls require a visible safety interlock state; hover is secondary to focus/tap states.
- **Animation:** 160–220ms ease-out transitions, no decorative loops except the heartbeat pulse; all motion collapses under prefers-reduced-motion.
- **Typography:** Space Grotesk for UI/display, IBM Plex Mono for metrics and IDs, system sans for long-form readability.
- **Brand essence:** cross-brand robot uptime control for warehouses that cannot afford siloed vendor portals. Personality: exacting, alert, accountable.
- **Brand voice:** direct and evidence-led. Example lines: “3 assets need a decision before the next shift.” “Every alert includes the curve, threshold, and recommended action.”
- **Wordmark/logo:** use the supplied falcon image as a compact mark beside the FalconFleetOps wordmark; never redraw it with CSS or substitute a generic icon.
- **Signature brand color:** `#F2B84B` hazard amber.

## Project Structure

- `src/web/` — application shell, typed demo data, routes, reusable UI, charts, interactive workflows.
- `gateway/` — Python normalized telemetry schema, three adapters, local anomaly pre-filter, simulator, tests, and container recipe.
- `backend/` — NestJS modular monolith boundaries, Prisma schema, telemetry/audit/firmware service contracts, and integration test contract.
- `firmware-tooling/` — `fleetops-sign` CLI and trust-chain notes.
- `docs/` — architecture, security, firmware, schema, demo script, completeness checklist, and Mermaid architecture diagram.
- `gtm/` — one-pager, pilot offer, pricing and objection handling copy.
- `infra/` — Docker Compose, Terraform skeleton, Semgrep rules, and GitHub Actions.
- `public/` — supplied falcon mark, favicon and route manifest.

## Review Focus

- Tenant/site isolation: every backend contract carries customer/site scope; UI makes site context visible.
- Fault evidence: anomaly records include raw curve, threshold and machine-readable rule evidence.
- Firmware safety: signature verification and automatic rollback are represented in UI and docs.
- Offline behavior: gateway ring buffer and backfill behavior are explicit and executable in simulator tests.
- Audit integrity: hash-chain export/verification must fail loudly when a record is tampered with.

---

### Task 1: Replace the template with the FalconFleetOps console

**Files:** `src/web/app.tsx`, `src/web/data/fleet.ts`, `src/web/components/fleet-shell.tsx`, `src/web/pages/fleetops.tsx`, `src/web/styles.css`, `index.html`, `public/manus-routes.json`, `app.config.ts`, `brand-spec.md`.

- [ ] Create deterministic 3-site seed data with 400 dashboard-ready robot records, 5 KPI values, telemetry series, anomalies, tickets, parts, updates, reports and audit events.
- [ ] Implement Fleet / Alerts / Tickets / Updates / Parts / Reports / Audit / Settings / RaaS routes with shared shell, theme toggle, site switcher, notification drawer, CSV export and toast feedback.
- [ ] Implement fleet grid, robot detail, anomaly evidence, predictive health, OTA rollout, repair kanban, parts RFQ, downtime report, audit export verification, compliance snapshot and RaaS SLA panel.
- [ ] Add loading, empty, error, permission, focus, disabled and tap-sized states.
- [ ] Use the supplied falcon asset and the declared design system; no placeholder logo or decorative cyber gradients.

### Task 2: Add gateway schemas, adapters and simulator

**Files:** `gateway/src/*.py`, `gateway/tests/*.py`, `gateway/requirements.txt`, `gateway/Dockerfile`, `gateway/README.md`.

- [ ] Implement `FleetTelemetry`, `ProtocolAdapter`, ROS2/zenoh, MiR MQTT and CAN adapters with the five required methods.
- [ ] Implement z-score + rule engine pre-filter and a 72-hour SQLite ring buffer abstraction.
- [ ] Implement deterministic 60-robot simulator with scripted failures and MQTT topic generation.
- [ ] Add unit tests for normalization, adapter contracts, failure curves, filtering and offline backfill.

### Task 3: Add backend/data/security contracts

**Files:** `backend/src/**`, `backend/prisma/schema.prisma`, `docs/schema.sql`, `docs/architecture.md`, `docs/security.md`.

- [ ] Add NestJS modules matching telemetry, devices, firmware, maintenance, tickets, parts, billing, auth and audit boundaries.
- [ ] Choose TimescaleDB for rollups and document the decision; add PostgreSQL DDL with daily partitions, row-version timestamps, tenant isolation and audit append-only trigger.
- [ ] Define RBAC/OIDC, mTLS, TLS 1.3, rate limiting, secret loading, row-level security and audit event contracts.

### Task 4: Add firmware signing and OTA trust chain

**Files:** `firmware-tooling/*`, `docs/firmware.md`, UI update route.

- [ ] Implement deterministic `fleetops-sign` CLI with SHA-256 digest, detached signature verification, manifest output and safe simulation mode.
- [ ] Document factory pairing, secure-element custody, image verification before push/apply, canary/staged health gates and rollback/safe mode.

### Task 5: Add infra, tests, docs, GTM and handoff

**Files:** `infra/*`, `.github/workflows/ci.yml`, `gtm/*`, `docs/*`, `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`.

- [ ] Add Compose, Terraform, Semgrep, CI and Playwright happy-path contract.
- [ ] Write the exact 6-minute investor demo path, completeness checklist, one-pager, 2-week pilot offer, pricing with 500-robot ARR, and objection handling.
- [ ] Run lint, typecheck, build, gateway tests, audit verification and route-manifest checks; record evidence in the final handoff.
