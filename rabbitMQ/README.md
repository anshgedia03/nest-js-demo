# Real-Time Leaderboard with NestJS, RabbitMQ, and Redis

This project is a medium-level NestJS microservices example built with event-driven architecture.

## Services

- `score_producer`
  Exposes a REST API to receive score updates and publishes events to RabbitMQ.
- `score_consumer`
  Listens to RabbitMQ events with `@EventPattern`, stores leaderboard data in Redis using a Sorted Set, and exposes an HTTP API to read the current leaderboard.

## Flow

1. Client sends `POST /leaderboard/score` to `score_producer`
2. `score_producer` publishes `score_updated` to RabbitMQ
3. `score_consumer` receives the event
4. `score_consumer` stores the score in Redis ZSET
5. Client reads sorted leaderboard from `score_consumer`

## Tech

- NestJS
- RabbitMQ
- Redis
- `ioredis`
- Redis Sorted Set with `ZREVRANGE`

## APIs

### Producer

`POST /leaderboard/score`

Request body:

```json
{
  "userId": "user-1",
  "userName": "Ansh",
  "score": 250
}
```

Response:

```json
{
  "message": "Score update accepted and published.",
  "data": {
    "userId": "user-1",
    "userName": "Ansh",
    "score": 250,
    "updatedAt": "2026-05-04T00:00:00.000Z"
  }
}
```

### Consumer

`GET /leaderboard?limit=10`

Response:

```json
{
  "total": 2,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user-2",
      "userName": "John",
      "score": 300
    },
    {
      "rank": 2,
      "userId": "user-1",
      "userName": "Ansh",
      "score": 250
    }
  ]
}
```

## Environment variables

Set these before running the services:

```bash
export RABBITMQ_URL=amqp://localhost:5672
export RABBITMQ_QUEUE=leaderboard_score_queue
export REDIS_URL=redis://localhost:6379
```

Optional ports:

```bash
export PORT=4000
```

Use port `4000` for `score_producer` and `4001` for `score_consumer` by default.

## Local setup

Install dependencies:

```bash
npm install
```

Start RabbitMQ with Docker:

```bash
docker run -d --hostname rabbitmq --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```

Start Redis with Docker:

```bash
docker run -d --name redis -p 6379:6379 redis:7
```

## Run the services

Terminal 1:

```bash
cd "/Users/ztlab104/Documents/Development /nest js /rabbitMQ"
export RABBITMQ_URL=amqp://localhost:5672
export RABBITMQ_QUEUE=leaderboard_score_queue
export REDIS_URL=redis://localhost:6379
PORT=4001 npm run start:dev:score_consumer
```

Terminal 2:

```bash
cd "/Users/ztlab104/Documents/Development /nest js /rabbitMQ"
export RABBITMQ_URL=amqp://localhost:5672
export RABBITMQ_QUEUE=leaderboard_score_queue
PORT=4000 npm run start:dev:score_producer
```

## Test the flow

Submit scores:

```bash
curl -X POST http://localhost:4000/leaderboard/score \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-1","userName":"Ansh","score":250}'
```

```bash
curl -X POST http://localhost:4000/leaderboard/score \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-2","userName":"John","score":300}'
```

```bash
curl -X POST http://localhost:4000/leaderboard/score \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-3","userName":"Riya","score":275}'
```

Read leaderboard:

```bash
curl http://localhost:4001/leaderboard?limit=10
```

Expected order is highest score first because Redis uses `ZREVRANGE`.

## Scripts

```bash
npm run start:dev:score_producer
npm run start:dev:score_consumer
npm run build
npm test -- --runInBand
```
