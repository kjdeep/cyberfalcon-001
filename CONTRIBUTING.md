# Contributing to FalconFleetOps

Use a short branch and keep every feature ticket in the format **Spec → Implementation → Tests → Docs**. Start with a failing unit or contract test, implement the smallest boundary-preserving change, then run the focused test, full frontend build and gateway suite before opening a PR.

Do not add secrets, vendor credentials, or real customer telemetry. Firmware changes require a trust-chain review. Any tenant, audit, rate-limit or safety-interlock change needs an explicit architecture note. Preserve 48px tap targets and reduced-motion behavior in UI work.

Recommended checks:

```bash
pnpm install
pnpm run build
pnpm run lint
python -m unittest discover -s gateway/tests -v
```
