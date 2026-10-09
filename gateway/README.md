# FleetOps Node Gateway

The gateway is an asyncio Python 3.11 service for ARM Linux. It discovers mixed-brand robots, adapts vendor telemetry into `FleetTelemetry`, applies transparent edge rules, buffers raw 1Hz readings locally for at least 72 hours, and publishes normalized readings to `fleet/{site_id}/robot/{robot_id}/telemetry/1hz` over MQTT.

## Adapter contract

Every adapter implements `discover()`, `poll()`, `to_normalized_telemetry()`, `read_firmware_version()`, and `push_firmware()`. The v1 repository includes ROS2/zenoh-shaped, MiR MQTT-shaped and generic CAN 2.0B adapters. Firmware push is a simulation stub until vendor-specific safe-mode paths are approved.

## Run simulation

```bash
python -m unittest discover -s tests -v
python -c 'from src.simulator import FleetSimulator; print(next(FleetSimulator().mqtt_messages()))'
```

The simulator emits 60 robots with scripted motor-temperature runaway, battery degradation, encoder drift and communications dropouts. It is deterministic so CI and investor demos render the same failure evidence.
