import asyncio
import unittest
from src.adapters import GenericCANAdapter, MiRMqttAdapter, ROS2ZenohAdapter
from src.anomaly import LocalAnomalyFilter, TelemetryRingBuffer
from src.simulator import FleetSimulator
from src.telemetry import FleetTelemetry


class GatewayTests(unittest.TestCase):
    def test_three_adapters_normalize(self):
        async def run():
            for adapter in (ROS2ZenohAdapter("site-a"), MiRMqttAdapter("site-a"), GenericCANAdapter("site-a")):
                endpoint = (await adapter.discover())[0]
                telemetry = adapter.to_normalized_telemetry(await adapter.poll(endpoint), "robot-1")
                self.assertEqual(telemetry.robot_id, "robot-1")
                self.assertGreaterEqual(telemetry.battery_pct, 0)
                self.assertTrue(await adapter.push_firmware(endpoint, b"FLEETOPS-SIGNED-v1"))
        asyncio.run(run())

    def test_simulator_has_scripted_failures(self):
        simulator = FleetSimulator(robot_count=60)
        readings = []
        for _ in range(20):
            readings.extend(simulator.tick_once())
        self.assertEqual(len(readings[-60:]), 60)
        self.assertEqual({"MOTOR_TEMP_RAMP", "BATT_CAPACITY_LOW", "ENCODER_DRIFT", "COMMS_DROPOUT"}, {code for reading in readings for code in reading.fault_codes})

    def test_rule_engine_emits_machine_readable_evidence(self):
        engine = LocalAnomalyFilter()
        reading = FleetTelemetry("site-a", "robot-1", "now", 60, 1, 72, .01, 1, 1, [], "fault")
        events = engine.evaluate(reading)
        self.assertEqual(events[0].rule, "WHEEL.MOTOR_TEMP_RAMP")
        self.assertIn("threshold_c", events[0].evidence)

    def test_ring_buffer_drain_round_trip(self):
        buffer = TelemetryRingBuffer(max_rows=2)
        for index in range(3):
            buffer.append(FleetTelemetry("site-a", f"robot-{index}", str(index), 70, 1, 40, 0, 1, 2))
        drained = buffer.drain(10)
        self.assertEqual(len(drained), 2)
        self.assertEqual(drained[0]["robot_id"], "robot-1")


if __name__ == "__main__":
    unittest.main()
