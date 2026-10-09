import asyncio
from .simulator import FleetSimulator


async def main() -> None:
    simulator = FleetSimulator()
    for topic, payload in simulator.mqtt_messages():
        print(topic, payload)
    await asyncio.sleep(0)


if __name__ == "__main__":
    asyncio.run(main())
