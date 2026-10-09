# Firmware tooling

`fleetops-sign.mjs` creates and verifies SHA-256 + detached signature manifests for simulator and CI workflows. `verify-audit.mjs` checks a Verifiable JSON audit export. Production keys must remain in an offline HSM or secure signing environment.
