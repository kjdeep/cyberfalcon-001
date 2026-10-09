"""Deterministic simulation mode for demos and CI; no physical hardware required."""
from dataclasses import dataclass
from typing import Iterator
from .telemetry import FleetTelemetry


@dataclass(slots=True)
class SimRobot:
    robot_id: str
    vendor: str
    model: str
    failure: str | None = None


class FleetSimulator:
    def __init__(self, site_id: str = "site-reno", robot_count: int = 60) -> None:
        vendors = [("MiR", "MiR250"), ("Geekplus", "P800"), ("Locus", "Vector"), ("Zebra", "FlexiCart"), ("Omron", "LD-250"), ("KUKA", "KMP600")]
        self.robots = [SimRobot(f"sim-{index + 1:03d}", *vendors[index % len(vendors)], {7: "motor_temp", 19: "battery", 31: "encoder", 47: "comms"}.get(index)) for index in range(robot_count)]
        self.site_id = site_id
        self.tick = 0

    def tick_once(self) -> list[FleetTelemetry]:
        self.tick += 1
        readings: list[FleetTelemetry] = []
        for index, robot in enumerate(self.robots):
            battery = max(12.0, 86 - ((self.tick + index) % 45) * .22)
            motor = 42 + ((self.tick + index * 3) % 8)
            drift = 1.1
            loss = 0.002
            faults: list[str] = []
            status = "nominal"
            if robot.failure == "motor_temp" and self.tick > 3:
                motor += min(34, (self.tick - 3) * 4.5); status = "fault" if motor >= 68 else "degraded"; faults = ["MOTOR_TEMP_RAMP"] if motor >= 68 else []
            if robot.failure == "battery" and self.tick > 2:
                battery -= min(60, (self.tick - 2) * 3.2); status = "degraded" if battery < 45 else "nominal"; faults = ["BATT_CAPACITY_LOW"] if battery < 30 else []
            if robot.failure == "encoder" and self.tick > 4:
                drift = min(9.2, 1.1 + (self.tick - 4) * 1.1); status = "degraded" if drift > 4.5 else "nominal"; faults = ["ENCODER_DRIFT"] if drift > 4.5 else []
            if robot.failure == "comms" and self.tick % 5 in (0, 1):
                loss = .18; status = "offline"; faults = ["COMMS_DROPOUT"]
            readings.append(FleetTelemetry(self.site_id, robot.robot_id, f"2026-10-09T12:{self.tick:02d}:00Z", battery, drift, motor, loss, 18000 + self.tick, 4200 + self.tick * 3, faults, status, "simulator"))
        return readings

    def mqtt_messages(self) -> Iterator[tuple[str, dict]]:
        for telemetry in self.tick_once():
            yield f"fleet/{self.site_id}/robot/{telemetry.robot_id}/telemetry/1hz", telemetry.to_dict()
