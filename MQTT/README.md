# NestJS MQTT Microservices Example

This project is a medium-level NestJS monorepo that demonstrates MQTT-based communication between two services:

- `sensor-producer`: an HTTP service that publishes MQTT events
- `warehouse-consumer`: an MQTT microservice that subscribes to warehouse topics

It uses:

- `@nestjs/microservices`
- `Transport.MQTT`
- `MqttRecordBuilder` for per-message QoS
- `@EventPattern`, `@Payload`, and `@Ctx`
- `MqttContext#getTopic()` and `MqttContext#getPacket()`
- MQTT client/server status streams
- MQTT internal error listeners
- wildcard topic subscription

## Project Structure

```text
MQTT/
├── apps/
│   ├── sensor-producer/
│   │   └── src/
│   │       ├── app.controller.ts
│   │       ├── app.module.ts
│   │       ├── app.service.ts
│   │       └── main.ts
│   └── warehouse-consumer/
│       └── src/
│           ├── app.controller.ts
│           ├── app.module.ts
│           ├── app.service.ts
│           └── main.ts
├── docker-compose.yml
├── mosquitto.conf
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## Installation

```bash
npm install
```

If you are building this from scratch, install the MQTT-specific packages with:

```bash
npm install @nestjs/microservices mqtt
```

## MQTT Broker Setup

### Option 1: Mosquitto with Docker

```bash
docker compose up -d mosquitto
```

Both services connect to:

```bash
mqtt://localhost:1883
```

### Option 2: Local Mosquitto

If Mosquitto is installed locally:

```bash
mosquitto -c mosquitto.conf
```

## Run the Services

Start the HTTP producer:

```bash
npm run start:producer:dev
```

Start the MQTT consumer in another terminal:

```bash
npm run start:consumer:dev
```

## MQTT Topics and QoS

| Topic | Purpose | QoS |
|---|---|---|
| `warehouse/temperature` | normal telemetry | `0` |
| `warehouse/smoke` | smoke alert | `1` |
| `warehouse/fire-alert` | critical fire event | `2` |
| `warehouse/+/status` | wildcard device status subscription | `0` |

## Complete Communication Flow

1. A REST client calls the `sensor-producer` HTTP API.
2. The producer creates an MQTT record with `MqttRecordBuilder`.
3. The producer sets QoS based on the event type.
4. The record is published to Mosquitto on the topic for that event.
5. `warehouse-consumer` subscribes through `@EventPattern(...)`.
6. The consumer receives:
   - event data through `@Payload()`
   - transport metadata through `@Ctx() context: MqttContext`
7. The consumer reads:
   - `context.getTopic()` to identify the exact topic
   - `context.getPacket()` to inspect `qos`, `dup`, `retain`, and user properties
8. The event is logged and processed by the warehouse service.

## QoS Explained with Real Examples

### QoS 0 for Normal Data

Topic: `warehouse/temperature`

- No acknowledgment is required.
- Fastest delivery mode.
- Best for frequent telemetry.

Real example:

- A sensor sends temperature every 2 seconds.
- If one packet is lost, the next reading quickly replaces it.

### QoS 1 for Alerts

Topic: `warehouse/smoke`

- Delivered at least once.
- The broker expects acknowledgment.
- The consumer may receive duplicates.

Real example:

- Smoke detection should not be dropped silently.
- Duplicate alert handling is acceptable if processing is idempotent.

### QoS 2 for Critical Events

Topic: `warehouse/fire-alert`

- Delivered exactly once using a stricter handshake.
- Highest reliability with more protocol overhead.

Real example:

- A fire evacuation event must not be lost.
- This is the right place to use QoS 2.

## Sample API Requests

### Temperature event with QoS 0

```bash
curl -X POST http://localhost:3000/sensors/temperature \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "temp-01",
    "celsius": 24.6,
    "unit": "C",
    "recordedAt": "2026-05-05T10:30:00.000Z"
  }'
```

### Smoke alert with QoS 1

```bash
curl -X POST http://localhost:3000/sensors/smoke \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "smoke-02",
    "ppm": 86,
    "severity": "high",
    "reportedAt": "2026-05-05T10:31:00.000Z"
  }'
```

### Fire alert with QoS 2

```bash
curl -X POST http://localhost:3000/sensors/fire-alert \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "fire-01",
    "zone": "A-17",
    "level": "evacuate",
    "triggeredAt": "2026-05-05T10:32:00.000Z"
  }'
```

### Wildcard status event

```bash
curl -X POST http://localhost:3000/sensors/gateway-01/status \
  -H "Content-Type: application/json" \
  -d '{
    "state": "online",
    "battery": 91,
    "updatedAt": "2026-05-05T10:33:00.000Z"
  }'
```

## Advanced MQTT Concepts Included

### Status streams

Producer:

- `client.status.subscribe(...)`

Consumer:

- `app.status.subscribe(...)`

These provide runtime connection updates such as `connected`, `disconnected`, `reconnecting`, and `closed`.

### Internal error listeners

Producer:

- `client.on('error', ...)`

Consumer:

- `app.on('error', ...)`

### Wildcard subscription

The consumer listens to:

```ts
@EventPattern('warehouse/+/status', { extras: { qos: 0 } })
```

This allows topics such as:

- `warehouse/gateway-01/status`
- `warehouse/sensor-88/status`
- `warehouse/loading-bay-2/status`

## Useful Commands

```bash
docker compose up -d mosquitto
npm run build
npm run start:producer
npm run start:consumer
npm run start:producer:dev
npm run start:consumer:dev
```
