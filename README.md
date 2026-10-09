# FalconFleetOps

**MDM for physical robots.** Cross-brand fleet health, predictive maintenance, firmware assurance, repair workflows and downtime-cost proof for warehouse robot fleets.

The repository ships a demo-ready React console plus production-shaped gateway, backend, firmware tooling, infrastructure, tests and GTM artifacts. The supplied falcon mark is used from `public/falcon-logo.png`.

## Quickstart

```bash
pnpm install
pnpm run build
pnpm run dev -- --host 0.0.0.0 --port 4205
```

Open `http://localhost:4205/fleet`. The UI is seeded instantly with three sites and a 400-robot fleet. The built-in simulator and gateway tests run without hardware:

```bash
python -m unittest discover -s gateway/tests -v
node --check firmware-tooling/fleetops-sign.mjs
node --check firmware-tooling/verify-audit.mjs
```

To start the full local service graph (TimescaleDB/PostgreSQL, Redis, MQTT, simulator, backend and web), use:

```bash
docker compose -f infra/docker-compose.yml up --build
```

## Demo path

1. `/fleet` — Observe: KPI grid, uptime trend, asset-state filters and robot tiles.
2. `/robots/robot-008` — Predict: telemetry curves, evidence, confidence and diagnose action.
3. `/updates` — Update: signed canary rollout, health gate and rollback interlock.
4. `/tickets` and `/parts` — Fix: kanban workflow, recommendation matching and supplier RFQ.
5. `/reports` — Value: prevented vs realized downtime cost and scheduled retention reports.
6. `/audit` and `/raas` — Prove: verified audit chain, Insurer Pack and partner SLA posture.

See [`docs/demo-script.md`](docs/demo-script.md) for the exact six-minute investor narration.

## Repository map

| Path | Responsibility |
| --- | --- |
| `src/web` | React + TypeScript + Tailwind v4 + Recharts operational console |
| `gateway` | Python 3.11 adapters, normalized schema, anomaly filter, simulator and offline ring buffer |
| `backend` | NestJS/Prisma module boundaries and services for telemetry, firmware and audit |
| `firmware-tooling` | `fleetops-sign` and audit-chain verification CLIs |
| `docs` | Architecture, security, schema, firmware trust chain, hardware BOM, demo and completeness |
| `gtm` | One-pager, pilot offer, pricing and objection handling |
| `infra` | Docker Compose, Terraform and MQTT config |

## Named architecture decisions

TimescaleDB is selected for v1 because PostgreSQL transactions, tenant row-level security and append-only audit writes matter more than introducing a second query language. MQTT is abstracted behind a transport interface because patchy warehouse Wi-Fi and embedded Linux are primary constraints. Gateway firmware uses signed A/B slots and safe mode when a vendor-specific rollback path is unavailable. Predictive maintenance starts with rolling baselines and transparent rules; `MLAnomalyModel` is the documented upgrade seam.

Read [`docs/architecture.md`](docs/architecture.md), [`docs/security.md`](docs/security.md), [`docs/firmware.md`](docs/firmware.md), [`docs/schema.sql`](docs/schema.sql) and [`docs/README-completeness.md`](docs/README-completeness.md) before extending the product.
