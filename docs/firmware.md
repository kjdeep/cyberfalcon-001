# Firmware trust chain and OTA design

Firmware assurance is a product boundary, not a button that blindly copies bytes.

## Trust chain

1. An image curator builds a vendor/model/version artifact in an isolated build environment.
2. `fleetops-sign` computes SHA-256 and creates a detached signature plus a manifest containing image identity, digest, risk flags, minimum gateway version and expiry.
3. The public trust anchor is provisioned at the factory. The private signing key stays offline; the FleetOps Node private device key stays inside its ATECC608-class secure element.
4. Cloud ingress verifies the manifest signature before the image is eligible for rollout.
5. The gateway verifies the same signature and SHA-256 before it writes to the inactive A/B partition or sends a vendor-specific push request.
6. The node runs a health check: process heartbeat, motor temperature, battery telemetry, communications and vendor self-test. It commits the new slot only after the health gate passes.
7. If any robot in a batch reports `fault` or `offline` after install, promotion aborts. The node rolls back the A/B slot, enters safe mode when vendor rollback is unavailable, and opens a technician ticket.

## Rollout strategies

- **Immediate:** only for a single robot or an explicitly approved emergency patch.
- **Canary 5%:** install on a small cohort and hold for the configured soak window.
- **Staged:** promote through 5%, 20%, 50% and 100% bands after health-gated checks.

The browser console exposes signature status, cohort progress, fault interlock state and the rollback command. It does not expose raw private keys.

## CLI

```bash
node firmware-tooling/fleetops-sign.mjs sign image.bin --key signing.key --out image.manifest.json
node firmware-tooling/fleetops-sign.mjs verify image.bin --manifest image.manifest.json --public-key signing.pub
```

The repository CLI uses standard Node crypto and is suitable for CI simulation. Production signing keys must be supplied through an offline HSM or secure build environment.
