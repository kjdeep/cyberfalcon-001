# FleetOps Node illustrative BOM

Target is **≤ USD 60 at 1,000 units** before enclosure tooling, certification, LTE subscription and factory labor. The BOM is an engineering target for a Rockchip RK3566-class ARM gateway, not a purchasing quote.

| Line | Component | Target unit cost |
| --- | --- | ---: |
| RK3566-class SoC module, 4GB RAM / 32GB eMMC | compute | $21.50 |
| Dual GbE PHY + magnetics + RJ45 | wired robot/site links | $3.80 |
| 802.11ac Wi-Fi module + antenna | local connectivity | $3.20 |
| CAN 2.0B transceiver + isolated connector | diagnostics bus | $1.45 |
| RS485 transceiver + protection | legacy bus | $0.65 |
| USB-C console / ESD / power switch | service access | $1.10 |
| ATECC608-class secure element | key storage / attestation | $1.80 |
| LTE CAT-4 socket + RF passives | optional modem slot | $1.75 |
| 9–36V DC input, buck/TVS/reverse protection | vehicle/industrial power | $2.40 |
| 2-layer industrial PCB, assembly | board | $7.50 |
| IP54 polycarbonate DIN-rail enclosure | mechanical | $4.80 |
| thermal pad, shield, fasteners, labels | mechanical / EMC | $1.25 |
| factory test + pairing fixture allocation | manufacturing | $2.40 |
| **Illustrative total** |  | **$53.60** |

The production gate remains: ARM SoC, 4GB RAM, 32GB eMMC, dual GbE, CAN 2.0B, RS485, USB-C console, 802.11ac, optional LTE CAT-4 slot, DIN/robot mounting, 9–36V DC input, IP54 enclosure and secure element. Gateway OTA uses A/B partitions with signed-image health checks and automatic rollback.
