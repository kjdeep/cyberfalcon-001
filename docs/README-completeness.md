# FalconFleetOps completeness checklist

| Requirement | Delivered in |
| --- | --- |
| React dashboard with dark/light theme and tablet layout | `src/web/` |
| Fleet health, robot detail, anomaly evidence | `src/web/pages/fleetops.tsx` |
| OTA console, signed image trust chain, rollback | `src/web/pages/fleetops.tsx`, `docs/firmware.md`, `firmware-tooling/` |
| Repair ticketing, kanban, parts recommendation and RFQ | `src/web/pages/fleetops.tsx` |
| Downtime cost accounting and retention report | `src/web/pages/fleetops.tsx` |
| Hash-chained audit and compliance / Insurer Pack | `src/web/pages/fleetops.tsx`, `backend/src/modules/audit/audit.service.ts`, `docs/security.md` |
| RaaS partner portal | `src/web/pages/fleetops.tsx` |
| Three gateway adapters | `gateway/src/adapters.py` |
| Offline buffer and simulator | `gateway/src/anomaly.py`, `gateway/src/simulator.py` |
| PostgreSQL/Timescale model and tenant policies | `docs/schema.sql`, `backend/prisma/schema.prisma` |
| Hardware BOM | `docs/hardware-bom.md` |
| Docker, Terraform, Semgrep, CI | `infra/`, `.github/workflows/ci.yml`, `.semgrep.yml` |
| GTM one-pager, pilot, pricing | `gtm/` |
| Demo script and architecture | `docs/demo-script.md`, `docs/architecture.md`, `docs/architecture.mmd` |
| Completion evidence | `README.md`, `CHANGELOG.md` |
