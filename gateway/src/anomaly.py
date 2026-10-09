"""Transparent gateway anomaly rules and offline ring buffer."""
import json
import sqlite3
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from .telemetry import FleetTelemetry


@dataclass(slots=True)
class AnomalyEvent:
    robot_id: str
    rule: str
    severity: str
    evidence: dict[str, Any]
    recommended_action: str


class LocalAnomalyFilter:
    """Cheap edge-side filter: rules first, then a rolling z-score on battery."""

    def __init__(self, window: int = 30) -> None:
        self.battery_history: dict[str, deque[float]] = {}
        self.window = window

    def evaluate(self, telemetry: FleetTelemetry) -> list[AnomalyEvent]:
        history = self.battery_history.setdefault(telemetry.robot_id, deque(maxlen=self.window))
        events: list[AnomalyEvent] = []
        if telemetry.motor_temp_c >= 68:
            events.append(AnomalyEvent(telemetry.robot_id, "WHEEL.MOTOR_TEMP_RAMP", "critical", {"motor_temp_c": telemetry.motor_temp_c, "threshold_c": 68}, "Stop asset after current mission and inspect motor bearing."))
        if telemetry.lidar_packet_loss_rate >= 0.05:
            events.append(AnomalyEvent(telemetry.robot_id, "LIDAR.PACKET_LOSS_RATE", "high", {"packet_loss_rate": telemetry.lidar_packet_loss_rate, "threshold": 0.05}, "Run lidar cable and sensor health check."))
        if telemetry.wheel_encoder_m >= 4.5:
            events.append(AnomalyEvent(telemetry.robot_id, "ENCODER.DRIFT", "medium", {"drift_mm_per_m": telemetry.wheel_encoder_m, "threshold": 4.5}, "Schedule wheel calibration and inspect tread wear."))
        if len(history) >= 5:
            mean = sum(history) / len(history)
            variance = sum((value - mean) ** 2 for value in history) / len(history)
            std = variance ** 0.5
            z_score = (telemetry.battery_pct - mean) / std if std else 0.0
            if z_score < -3:
                events.append(AnomalyEvent(telemetry.robot_id, "CALL.BATT_CYCLE_COUNT_BASELINE", "high", {"battery_pct": telemetry.battery_pct, "mean": mean, "z_score": z_score}, "Schedule battery pack inspection."))
        history.append(telemetry.battery_pct)
        return events


class TelemetryRingBuffer:
    """SQLite-backed ring buffer sized for >=72 hours of 1Hz telemetry."""

    def __init__(self, path: str | Path = ":memory:", max_rows: int = 259200) -> None:
        self.path = str(path)
        self.max_rows = max_rows
        self.db = sqlite3.connect(self.path)
        self.db.execute("CREATE TABLE IF NOT EXISTS telemetry_buffer (id INTEGER PRIMARY KEY AUTOINCREMENT, robot_id TEXT, ts TEXT, payload TEXT NOT NULL)")
        self.db.commit()

    def append(self, telemetry: FleetTelemetry) -> None:
        self.db.execute("INSERT INTO telemetry_buffer(robot_id, ts, payload) VALUES (?, ?, ?)", (telemetry.robot_id, telemetry.ts, json.dumps(telemetry.to_dict())))
        self.db.execute("DELETE FROM telemetry_buffer WHERE id NOT IN (SELECT id FROM telemetry_buffer ORDER BY id DESC LIMIT ?)", (self.max_rows,))
        self.db.commit()

    def drain(self, limit: int = 1000) -> list[dict[str, Any]]:
        rows = self.db.execute("SELECT id, payload FROM telemetry_buffer ORDER BY id LIMIT ?", (limit,)).fetchall()
        self.db.executemany("DELETE FROM telemetry_buffer WHERE id = ?", [(row[0],) for row in rows])
        self.db.commit()
        return [json.loads(row[1]) for row in rows]
