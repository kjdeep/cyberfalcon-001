"""Vendor protocol adapters.

Real transport calls are intentionally isolated behind small async methods so the
simulator can exercise normalization and firmware flows without physical hardware.
"""
from typing import Any
from .telemetry import FleetTelemetry, ProtocolAdapter, now_iso


class ROS2ZenohAdapter:
    """ROS2 robot_state_publisher subscriber via a zenoh/DDS-shaped shim."""

    def __init__(self, site_id: str, discovered: list[str] | None = None) -> None:
        self.site_id = site_id
        self.discovered = discovered or ["ros2://amr-001", "ros2://amr-002"]

    async def discover(self) -> list[str]:
        return self.discovered

    async def poll(self, endpoint: str) -> dict[str, Any]:
        return {"topic": "/robot_state_publisher", "battery": 82.0, "wheel_encoder": 124.4, "motor_temp": 43.2, "lidar_loss": 0.001, "runtime": 21000, "distance": 4420, "fault_codes": []}

    def to_normalized_telemetry(self, payload: dict[str, Any], robot_id: str) -> FleetTelemetry:
        return FleetTelemetry(self.site_id, robot_id, now_iso(), float(payload["battery"]), float(payload["wheel_encoder"]), float(payload["motor_temp"]), float(payload["lidar_loss"]), int(payload["runtime"]), float(payload["distance"]), list(payload.get("fault_codes", [])), "nominal", "ros2-zenoh")

    async def read_firmware_version(self, endpoint: str) -> str:
        return "ros2-nav-3.4.2"

    async def push_firmware(self, endpoint: str, signed_image: bytes, simulation: bool = True) -> bool:
        return simulation and bool(signed_image)


class MiRMqttAdapter:
    """MiR REST/MQTT-shaped adapter; topic names match the typical fleet API shape."""

    def __init__(self, site_id: str, discovered: list[str] | None = None) -> None:
        self.site_id = site_id
        self.discovered = discovered or ["mir://amr-101", "mir://amr-102"]

    async def discover(self) -> list[str]:
        return self.discovered

    async def poll(self, endpoint: str) -> dict[str, Any]:
        return {"robot_name": endpoint.rsplit("/", 1)[-1], "battery_percentage": 76.0, "left_wheel_encoder": 9.2, "temperature": 46.0, "lidar": {"packet_loss_rate": 0.002}, "runtime_seconds": 18020, "distance_meters": 3200, "errors": []}

    def to_normalized_telemetry(self, payload: dict[str, Any], robot_id: str) -> FleetTelemetry:
        return FleetTelemetry(self.site_id, robot_id, now_iso(), float(payload["battery_percentage"]), float(payload["left_wheel_encoder"]), float(payload["temperature"]), float(payload["lidar"]["packet_loss_rate"]), int(payload["runtime_seconds"]), float(payload["distance_meters"]), list(payload.get("errors", [])), "nominal", "mir-mqtt")

    async def read_firmware_version(self, endpoint: str) -> str:
        return "mir-os-2.8.1"

    async def push_firmware(self, endpoint: str, signed_image: bytes, simulation: bool = True) -> bool:
        return simulation and signed_image.startswith(b"FLEETOPS-SIGNED")


class GenericCANAdapter:
    """CAN 2.0B adapter with a documented canned ID mapping for simulation."""

    CAN_MAP = {0x180: "battery_pct", 0x281: "wheel_encoder_m", 0x381: "motor_temp_c", 0x481: "fault_code"}

    def __init__(self, site_id: str, can_ids: list[int] | None = None) -> None:
        self.site_id = site_id
        self.can_ids = can_ids or list(self.CAN_MAP)

    async def discover(self) -> list[str]:
        return [f"can://0x{can_id:X}" for can_id in self.can_ids]

    async def poll(self, endpoint: str) -> dict[str, Any]:
        return {"0x180": 68.0, "0x281": 120.1, "0x381": 49.0, "0x481": 0}

    def to_normalized_telemetry(self, payload: dict[str, Any], robot_id: str) -> FleetTelemetry:
        faults = [] if int(payload.get("0x481", 0)) == 0 else [f"CAN_{int(payload['0x481']):04X}"]
        return FleetTelemetry(self.site_id, robot_id, now_iso(), float(payload["0x180"]), float(payload["0x281"]), float(payload["0x381"]), 0.0, 15000, 2700.0, faults, "fault" if faults else "nominal", "can-2.0b")

    async def read_firmware_version(self, endpoint: str) -> str:
        return "can-node-1.4.0"

    async def push_firmware(self, endpoint: str, signed_image: bytes, simulation: bool = True) -> bool:
        return simulation and bool(signed_image)


ADAPTERS: dict[str, type[ProtocolAdapter]] = {"ros2": ROS2ZenohAdapter, "mir_mqtt": MiRMqttAdapter, "can": GenericCANAdapter}
