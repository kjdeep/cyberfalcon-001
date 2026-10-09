# FalconFleetOps Brand Specification

## Identity

- **Product:** FalconFleetOps
- **Positioning:** Cross-brand robot uptime control for warehouse operators who need one accountable system for health, maintenance, firmware, and proof.
- **Voice:** Exacting, alert, accountable. Use short operational sentences, name the evidence, and make the next action obvious.
- **Mark:** `/falcon-logo.png` — supplied by the customer and retained as the recognition asset.

## Visual Tokens

| Token | Value | Use |
| --- | --- | --- |
| Slate 950 | `#0B1014` | App background |
| Slate 900 | `#11191F` | Rail and dense surfaces |
| Slate 800 | `#1A252D` | Elevated panels |
| Slate 700 | `#2A3842` | Dividers and muted controls |
| Text 100 | `#F4F7F8` | Primary text |
| Text 400 | `#9BAAB3` | Supporting text |
| Amber 500 | `#F2B84B` | Signature brand and active signal |
| Red 500 | `#E56666` | Faults and failed safety gates |
| Mint 500 | `#78D6B2` | Verified health |
| Blue 400 | `#7FB7D8` | Informational state |

## Typography

- UI and display: Space Grotesk, 400/500/600/700.
- Metrics, IDs, timestamps and data tables: IBM Plex Mono, 400/500/600.
- Body copy: system sans fallback for high legibility.

## Component Grammar

- Rail: 72px desktop, 64px tablet; logo mark centered with wordmark only above 1100px.
- Panels: 14px radius for main surfaces, 10px for controls, no decorative shadow in dark mode.
- Tap targets: minimum 48px for all actionable controls.
- Status chips: semantic fill at 12% opacity with a 1px border; never communicate status by color alone.
- Charts: open plot with light grid, semantic series colors, direct labels where possible.
- Motion: 160–220ms ease-out for hover/focus/route transitions; reduced-motion overrides all nonessential animation.

## Asset Rules

All UI code references the real mark with `<img src="/falcon-logo.png" alt="FalconFleetOps falcon mark" />`. Do not recreate, recolor, trace or replace the supplied mark with a CSS shape.
