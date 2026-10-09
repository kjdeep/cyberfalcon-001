# FalconFleetOps 6-minute investor demo

**0:00–0:45 — Dashboard / Observe.** Open `/fleet`. Lead with the sentence: “This is the first screen an ops manager sees at shift handoff.” Point to 99.42% fleet uptime, 3 active faults, 12 projected failures and the $18,420 downtime cost MTD. Click the Fault filter so the 400-robot mixed fleet becomes a decision queue, not a vendor portal.

**0:45–1:55 — Anomaly evidence / Predict.** Click AMR-008. Show the live battery and motor curve, the 68°C threshold and the 96% confidence prediction. Explain that the rule, slope and raw curve are stored as evidence; there is no black-box alert. Press “Diagnose now” and mention that the request is dispatched to the gateway.

**1:55–2:45 — OTA console / Update.** Open Updates. Show `FW-2026.10.04`, the canary cohort at 72%, signature verified, and the health gate. Explain the 5% → 20% → 50% → 100% rollout bands. Click “Roll back canary” to demonstrate the safety interlock and the vendor-agnostic A/B safe-mode path.

**2:45–3:45 — Repair + parts / Fix.** Open Tickets. Show the anomaly-created ticket in progress and a second ticket waiting for parts. Advance the wheel encoder ticket through the kanban. Open Parts, show match percentage, stock and lead time, then generate a generic webhook RFQ.

**3:45–4:45 — Downtime report / Value.** Open Reports. Show $31,600 saved this month, 17 caught anomalies and the prevented-vs-realized cost chart. Explain rules-first attribution: fault code, firmware changelog and parts-wait status are combined before an operator can override.

**4:45–5:40 — Compliance / Prove.** Open Audit. Show the verified SHA-256 chain, the append-only event ledger and the Verifiable JSON export. Click Insurer Pack and call out firmware hash, last safety check, 90-day uptime, maintenance history and incident log.

**5:40–6:00 — Distribution.** Open RaaS portal. Show site SLA posture and at-risk assets. Close with: “FleetOps is MDM for physical robots: observe every brand, predict the next failure, update safely, fix faster, and prove what happened.”
