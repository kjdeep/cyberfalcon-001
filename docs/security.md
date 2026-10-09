# FalconFleetOps security model

This document is intentionally strict because the compliance and insurance modules depend on trustworthy evidence. The v1 UI demo uses local seed data. The Compose profile is intentionally isolated to a local Docker network and is not a production security profile; the production contract below is the non-negotiable boundary for any cloud deployment.

## Trust boundaries

The robot/vendor network is untrusted. A FleetOps Node is paired to a customer site through a QR enrollment flow that issues a unique device identity and mTLS certificate. The cloud accepts telemetry only from a valid device certificate scoped to one customer/site. Browser users authenticate through OIDC/OAuth2 and receive RBAC claims: `SuperAdmin`, `OpsManager`, `Technician`, `Viewer`, `RaaSProvider`, or `InsuranceAuditor`.

All gateway-to-cloud traffic uses TLS 1.3 with certificate rotation and a deny-by-default broker ACL. Firmware images are signed offline, verified by the node against the configured trust anchor before push and again before apply. The gateway secure element stores the private key and attestation material; application code never reads the private key.

## Data controls

Every request carries customer and site scope. PostgreSQL row-level security is enabled on site-scoped tables and a transaction sets `app.customer_id`; repositories must not accept a free-form customer ID from the browser. Secrets are injected through a vault-style environment interface, never committed. API endpoints are rate limited and payloads are schema-validated. Semgrep rules cover hard-coded secrets, unsafe SQL and weak hash usage.

Audit events are append-only. The database trigger rejects update and delete operations, and `hash_self = SHA-256(canonical_event + hash_prev)`. Exports include the ordered events, schema version, tenant scope, export timestamp and verification result. A tampered record breaks chain verification and must fail the export, not silently repair itself.

## Role boundaries

`InsuranceAuditor` is read-only and may access only signed compliance snapshots. `RaaSProvider` is read-only across financed sites and sees SLA posture, not operator write controls. `Technician` can acknowledge and resolve tickets but cannot approve firmware image curation. `OpsManager` can stage updates and change downtime cost assumptions. `SuperAdmin` manages tenants and policy configuration.

## Operational controls

Production deployment requires locked dependency versions, SAST in CI, database backups, rotation of gateway certificates, alerting on baseline drift, and a manual approval gate for firmware promotion beyond the canary band. The rollback path is safe-mode plus technician alert if a vendor adapter cannot restore a prior firmware image.
