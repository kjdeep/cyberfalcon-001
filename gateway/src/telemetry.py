"""Canonical gateway-to-cloud telemetry contract.

The schema deliberately uses vendor-neutral fields so rollups and anomaly rules do not
know whether a reading came from ROS2, MiR MQTT or CAN.
"""
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Protocol


@dataclass(slots=True)
class FleetTelemetry:
    site_id: str
    robot_id: str
    ts: str
    battery_pct: float
    wheel_encoder_m: float
    motor_temp_c: float
    lidar_packet_loss_rate: float
    runtime_s: int
    distance_m: float
    fault_codes: list[str] = field(default_factory=list)
    status: str = "nominal"
    source: str = "simulator"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class ProtocolAdapter(Protocol):
    """Interface implemented by every robot protocol adapter."""

    async def discover(self) -> list[str]: ...
    async def poll(self, endpoint: str) -> dict[str, Any]: ...
    def to_normalized_telemetry(self, payload: dict[str, Any], robot_id: str) -> FleetTelemetry: ...
    async def read_firmware_version(self, endpoint: str) -> str: ...
    async def push_firmware(self, endpoint: str, signed_image: bytes, simulation: bool = True) -> bool: ...


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
