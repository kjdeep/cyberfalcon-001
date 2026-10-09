# FalconFleetOps Delivery Todo

- [ ] **Product console:** Deliver all ten v1 feature sections in the FalconFleetOps web UI with dark/light themes, 768px+ tablet usability, 48px tap targets, loading skeletons, empty states, error toasts, saved filters and CSV export.
- [ ] **Observe dashboard:** Show fleet uptime, active faults, robots in maintenance, projected failures in 7 days, downtime cost MTD, heartbeat, vendor/model filters, robot tiles and detail drill-down.
- [ ] **Predict engine:** Show rolling-baseline z-score alerts, known failure signatures, remaining-useful-life estimate with confidence interval, predicted failure timestamp, raw curve, threshold and machine-readable evidence.
- [ ] **Update console:** Demonstrate signed firmware upload, verification, immediate/canary/staged rollout, live progress, health-gated promotion, automatic abort and rollback/safe-mode alert.
- [ ] **Fix workflow:** Demonstrate anomaly-to-ticket creation, kanban statuses, technician assignment, waiting-parts recommendation, parts consumed, root cause and resolution.
- [ ] **Prove/compliance:** Demonstrate hash-chained append-only audit log, filters, Verifiable JSON export, chain verification, robot compliance snapshot and Insurer Pack report.
- [ ] **RaaS portal:** Show financed sites, uptime SLA panels and at-risk asset alerts for the RaaSProvider role.
- [ ] **Gateway:** Implement three concrete adapters with discover/poll/normalize/read firmware/push firmware methods, local 72-hour buffer, MQTT topic output and simulator mode.
- [ ] **Data/security contracts:** Add PostgreSQL/Timescale schema, tenant/site isolation, RBAC roles, mTLS/TLS 1.3, rate limits, vault-style env configuration and Semgrep rules.
- [ ] **GTM/docs:** Generate complete `/gtm` and `/docs` files, architecture diagram, security and firmware trust-chain docs, completion checklist and exact 6-minute demo script.
- [ ] **Quality:** `docker-compose up` is demo-ready, seed data is instant, gateway tests and audit verification pass, Playwright happy-path contract exists, README is under 15 commands, and the build/lint checks are clean.
