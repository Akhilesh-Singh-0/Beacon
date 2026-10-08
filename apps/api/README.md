<div align="center">

<img src="../web/app/icon.png" alt="Beacon" width="96" />

<h1>Beacon API</h1>

<p>AI workflow observability backend</p>

<p><em>Fastify backend handling OpenTelemetry ingestion, asynchronous span processing, execution graph construction, PostgreSQL persistence, and real-time WebSocket updates.</em></p>

<p>
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Fastify-5-000000?style=flat-square&logo=fastify&logoColor=white" alt="Fastify"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/BullMQ-EF4444?style=flat-square" alt="BullMQ"/>
  <img src="https://img.shields.io/badge/OpenTelemetry-000000?style=flat-square&logo=opentelemetry&logoColor=white" alt="OpenTelemetry"/>
</p>

<p>
  <a href="../../README.md"><strong>Beacon README</strong></a> ·
  <a href="../web/README.md"><strong>Frontend README</strong></a>
</p>

</div>

---

## What This Does

The Beacon API is the backend responsible for turning OpenTelemetry spans from AI workflows into persistent execution data and real-time dashboard updates.

An AI workflow sends telemetry to Beacon:

```text
AI Workflow
   ↓
OpenTelemetry
   ↓
Fastify API
   ↓
BullMQ
   ↓
Span Worker
   ↓
PostgreSQL
```

At the same time, processed spans are published through Redis so connected dashboards can see the execution as it happens:

```text
Span Worker
   ↓
Redis Pub/Sub
   ↓
WebSocket
   ↓
Dashboard
```

The important design decision is that **telemetry ingestion and span processing are asynchronous**.

The HTTP request does not wait for PostgreSQL graph construction to finish.

---

## Architecture

```mermaid
flowchart TB

    A["AI Workflow"] --> O["OpenTelemetry"]

    O -->|"OTLP traces"| API["Fastify API"]
    API -->|"Validate API key"| Q["BullMQ"]
    Q --> W["Span Worker"]

    W -->|"Persist runs, nodes & edges"| DB[("PostgreSQL")]

    W -->|"Publish execution events"| R[("Redis")]
    R -->|"Pub/Sub"| WS["WebSocket"]
    WS -->|"Live execution events"| UI["Next.js Dashboard"]

    classDef workflow fill:#111827,stroke:#60a5fa,color:#f8fafc
    classDef backend fill:#111827,stroke:#a78bfa,color:#f8fafc
    classDef storage fill:#111827,stroke:#34d399,color:#f8fafc
    classDef frontend fill:#111827,stroke:#38bdf8,color:#f8fafc

    class A,O workflow
    class API,Q,W,WS backend
    class DB,R storage
    class UI frontend
```

---

## Request Lifecycle

Every telemetry request follows this path:

```text
POST /v1/traces
        │
        ▼
Read x-api-key
        │
        ▼
Validate request payload
        │
        ▼
Find active API key
        │
        ▼
Resolve workspace
        │
        ▼
Add span to BullMQ
        │
        ▼
Return 202 Accepted
        │
        │
        └───────────────┐
                        │
                        ▼
                  Span Worker
                        │
                        ▼
                 Find/Create Run
                        │
                        ▼
                   Create Node
                        │
                        ▼
                 Resolve Parent
                        │
                        ▼
                   Create Edge
                        │
                        ▼
                  PostgreSQL
                        │
                        ▼
                 Redis Pub/Sub
                        │
                        ▼
                   WebSocket
                        │
                        ▼
                    Dashboard
```

The important part is the separation between:

```text
HTTP ingestion
```

and:

```text
background processing
```

The API only needs to authenticate, validate, and enqueue the telemetry before responding.

---

## OpenTelemetry Ingestion

Beacon accepts OpenTelemetry trace data through its HTTP ingestion endpoint.

### Endpoint

```http
POST /v1/traces
```

Authentication is provided through:

```http
x-api-key: YOUR_BEACON_API_KEY
```

The incoming span contains fields such as:

```text
traceId
spanId
parentSpanId
name
startTimeUnixNano
endTimeUnixNano
status
attributes
```

The ingestion layer validates the payload before it reaches the processing queue.

---

## Why BullMQ?

Processing an incoming span involves database operations and real-time event publishing.

Doing all of that inside the HTTP request would make ingestion depend directly on database and processing latency.

Instead:

```text
HTTP request
     │
     ▼
Validate
     │
     ▼
Queue
     │
     ▼
202 Accepted
```

Then:

```text
BullMQ
   │
   ▼
Worker
   │
   ├── PostgreSQL
   │
   └── Redis
```

This gives the ingestion path a clean boundary from downstream processing.

The queue is backed by Redis and uses retry behavior for failed processing.

---

## Span Worker

The span worker is the core of Beacon's backend processing pipeline.

Its job is to convert incoming telemetry into Beacon's execution model.

### Processing flow

```text
Incoming Span
      │
      ▼
Find or Create Run
      │
      ▼
Convert Timestamps
      │
      ▼
Map Span Status
      │
      ▼
Create Node
      │
      ▼
Find Parent Node
      │
      ▼
Create Edge
      │
      ▼
Persist to PostgreSQL
      │
      ▼
Publish Redis Events
```

### Run creation

Runs are identified using the workspace and OpenTelemetry trace ID.

Conceptually:

```text
workspaceId + traceId
        ↓
existing run?
   ↙          ↘
 yes           no
  ↓             ↓
use run      create run
```

This keeps spans belonging to the same trace grouped into a single execution.

---

## Building the Execution Graph

Beacon represents an execution using three core concepts:

```text
Run
 │
 ├── Node
 │
 ├── Node
 │    └── Edge
 │
 └── Node
```

### Run

Represents one workflow execution.

A run tracks information such as:

```text
trace ID
status
start time
completion time
workspace
```

### Node

Represents an individual operation inside the execution.

A node can contain:

```text
name
span ID
parent span ID
status
start time
end time
attributes
token usage
```

### Edge

Represents the relationship between two nodes.

```text
Parent Node
     │
     ▼
   Edge
     │
     ▼
Child Node
```

The worker uses `parentSpanId` from OpenTelemetry to reconstruct these relationships.

---

## Idempotency

OpenTelemetry data can be delivered more than once.

Beacon handles duplicate spans using a unique constraint on `spanId`.

The processing flow is effectively:

```text
Receive span
    │
    ▼
Create Node
    │
    ├── Success → continue
    │
    └── P2002 → already processed
                     │
                     ▼
                   skip
```

This prevents the same span from creating duplicate nodes when the queue retries a job or telemetry is received more than once.

The same principle is applied when creating edges.

---

## Node Status

Beacon maps telemetry status and timing information into its own node lifecycle.

The node states are:

```text
PENDING
RUNNING
SUCCESS
ERROR
STUCK
```

For completed spans:

```text
OTEL ERROR
    ↓
Node ERROR
```

and:

```text
Completed span without error
    ↓
Node SUCCESS
```

Beacon also has background handling for nodes that remain in a running state beyond the configured threshold.

---

## Run Status

Runs track their overall execution state:

```text
RUNNING
COMPLETED
FAILED
```

When the root span finishes, the worker updates the run accordingly.

Conceptually:

```text
Root span
   │
   ├── ERROR
   │     ↓
   │   FAILED
   │
   └── completed
         ↓
      COMPLETED
```

The completion timestamp is also persisted with the run.

---

## Redis Pub/Sub

Redis has two responsibilities in the backend:

```text
1. BullMQ infrastructure
2. Real-time event distribution
```

Beacon uses a dedicated Redis connection for Pub/Sub because a Redis connection enters subscriber mode after subscribing.

The worker publishes events to channels associated with a run:

```text
run:{runId}
```

For example:

```json
{
  "type": "node.created",
  "runId": "run-id",
  "node": {}
}
```

and:

```json
{
  "type": "edge.created",
  "runId": "run-id",
  "edge": {}
}
```

---

## WebSocket Flow

The dashboard connects to a run-specific WebSocket.

Conceptually:

```text
Browser
   │
   │ /ws/:runId
   ▼
WebSocket Server
   │
   │ subscribe
   ▼
Redis channel
   │
   │ messages
   ▼
WebSocket Server
   │
   │ fan-out
   ▼
Connected browsers
```

The server maintains:

```text
clientsByRun
```

which maps:

```text
runId → Set<WebSocket>
```

and:

```text
subscribedRuns
```

to avoid creating duplicate Redis subscriptions for the same run.

When the final browser leaves a run, the Redis subscription can be cleaned up.

---

## Token & Cost Tracking

Beacon can extract token usage from workflow telemetry when usage data is present in the span attributes.

The worker reads supported usage information and stores the total token count on the node.

Conceptually:

```text
OTEL attributes
      │
      ▼
workflow span data
      │
      ▼
usage.total_tokens
      │
      ▼
Node.totalToken
```

The dashboard can then expose token usage and associated cost information alongside execution data.

---

## Project Structure

```text
apps/api/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── shutdown.ts
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   └── redis.subscriber.ts
│   │
│   ├── plugins/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── health.ts
│   │   └── error-handler.ts
│   │
│   ├── queues/
│   │   └── span.queue.ts
│   │
│   ├── workers/
│   │   ├── span.worker.ts
│   │   └── stuck-node.worker.ts
│   │
│   ├── websocket/
│   │   └── websocket.server.ts
│   │
│   └── modules/
│       ├── ingestion/
│       │   ├── ingestion.schema.ts
│       │   ├── ingestion.repository.ts
│       │   ├── ingestion.service.ts
│       │   ├── ingestion.controller.ts
│       │   └── ingestion.route.ts
│       │
│       └── runs/
│           ├── runs.repository.ts
│           └── runs.route.ts
│
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

The backend is organized around responsibilities:

```text
lib/
    infrastructure

plugins/
    Fastify integration

modules/
    HTTP/business features

queues/
    asynchronous job definitions

workers/
    background processing

websocket/
    real-time delivery
```

---

## API Reference

### Health

```http
GET /health
```

Returns the current API health status.

Example:

```json
{
  "status": "ok"
}
```

---

### OpenTelemetry Ingestion

```http
POST /v1/traces
```

Headers:

```http
Content-Type: application/json
x-api-key: YOUR_BEACON_API_KEY
```

The endpoint validates the API key and telemetry payload, queues the span for asynchronous processing, and returns:

```http
202 Accepted
```

---

### Run Graph

```http
GET /runs/:runId/graph
```

Returns the execution graph for a run.

The graph contains the run's nodes and their relationships so the dashboard can reconstruct the execution visually.

---

## Authentication

Workflow telemetry ingestion uses Beacon API keys.

A key belongs to a workspace and can be activated or deactivated.

The ingestion flow is:

```text
x-api-key
    │
    ▼
Find active API key
    │
    ├── Not found / inactive
    │        ↓
    │       401
    │
    └── Valid
         ↓
      workspace
         ↓
      enqueue
```

Inactive keys are rejected before telemetry enters the processing pipeline.

---

## Environment Variables

Create:

```text
apps/api/.env
```

with the required backend configuration:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/beacon
REDIS_URL=redis://localhost:6379

CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

NODE_ENV=development
```

Railway provides the production `PORT`.

The API validates its environment variables at startup and fails fast when required configuration is missing.

---

## Local Development

### Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL
- Redis

### Install dependencies

From the repository root:

```bash
pnpm install
```

### Start infrastructure

If using Docker:

```bash
docker compose up -d
```

This starts the local PostgreSQL and Redis services.

### Run migrations

```bash
pnpm --filter @beacon/api exec prisma migrate dev
```

### Generate Prisma Client

```bash
pnpm --filter @beacon/api exec prisma generate
```

### Start the API

```bash
pnpm --filter @beacon/api dev
```

The API will run on the configured port.

Health check:

```text
GET /health
```

---

## Build

The production API build runs Prisma generation before TypeScript compilation.

```bash
pnpm --filter @beacon/api build
```

Start the compiled API with:

```bash
pnpm --filter @beacon/api start
```

---

## Database

Beacon uses PostgreSQL through Prisma.

The main execution models are:

```text
Workspace
    │
    ├── ApiKey
    │
    └── Run
          │
          ├── Node
          │
          └── Edge
```

The important execution relationships are:

```text
Run
 └── Nodes
      └── Edges
```

This gives the API a persistent representation of an agent execution rather than relying only on the live WebSocket stream.

---

## Graceful Shutdown

The API handles shutdown explicitly so infrastructure can be closed cleanly.

The shutdown sequence includes:

```text
Stop accepting work
       ↓
Close workers
       ↓
Close queues
       ↓
Close Redis
       ↓
Close database
       ↓
Exit
```

This is particularly important for the queue and worker layer because jobs should not be left in an inconsistent state during deployment.

---

## Performance

Beacon's production OTLP ingestion endpoint was tested with authenticated requests at increasing concurrency levels.

| Concurrency | Requests | Throughput | p50 | p95 | p99 | Errors |
|---:|---:|---:|---:|---:|---:|---:|
| 10 | 397 | 38.79 req/s | 228 ms | 545 ms | 735 ms | 0% |
| 25 | 1,018 | 99.52 req/s | 225 ms | 273 ms | 800 ms | 0% |
| 50 | 2,031 | 198.57 req/s | 225 ms | 397 ms | 702 ms | 0% |
| 100 | 4,015 | 377.95 req/s | 224 ms | 289 ms | 913 ms | 0% |

At 100 concurrent clients, the production ingestion endpoint handled **4,015 authenticated requests over 10.62 seconds at 377.95 req/s with 0% HTTP request failures**.

These numbers measure the OTLP ingestion endpoint. They do not represent complete workflow execution throughput because span processing is intentionally asynchronous through BullMQ.

---

## Key Engineering Decisions

| Decision | Why |
|---|---|
| Fastify | Lightweight HTTP server with a strong plugin architecture |
| BullMQ | Keeps span processing out of the request path |
| PostgreSQL | Durable storage for runs, nodes, edges, workspaces, and API keys |
| Redis Pub/Sub | Distributes execution events to the real-time layer |
| Dedicated Redis subscriber | Redis subscriber connections cannot be used for normal commands |
| WebSockets | Pushes execution updates to connected dashboards |
| API key authentication | Keeps telemetry ingestion scoped to a workspace |
| Span ID uniqueness | Prevents duplicate spans from creating duplicate nodes |
| Parent span relationships | Allows the worker to reconstruct execution edges |
| Zod validation | Validates incoming configuration and telemetry payloads |
| Prisma | Type-safe database access and migrations |
| Async processing | Keeps ingestion latency independent from graph persistence |

---

## Failure Handling

Beacon is designed so that failures in background processing don't need to become failures in the initial ingestion request.

The separation is:

```text
HTTP ingestion
      │
      ▼
Queue
      │
      ▼
Worker
      │
      ├── PostgreSQL
      │
      └── Redis
```

If a worker encounters a retryable processing failure, BullMQ can retry the job according to the queue configuration.

Duplicate spans are handled through database uniqueness rather than relying solely on in-memory state.

---

## Production

The current deployment separates the backend from the frontend:

```text
Frontend
   ↓
Vercel

Backend
   ↓
Railway

Database
   ↓
PostgreSQL

Queue / PubSub
   ↓
Redis
```

Production telemetry is sent to:

```text
POST /v1/traces
```

with:

```http
x-api-key: YOUR_BEACON_API_KEY
```

The dashboard communicates with the API over HTTP for persisted run data and WebSockets for live execution events.

---

## Example OTEL Configuration

For an application or workflow instrumented with OpenTelemetry:

```bash
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="https://your-beacon-api/v1/traces"
export OTEL_EXPORTER_OTLP_TRACES_PROTOCOL="http/json"
export OTEL_EXPORTER_OTLP_TRACES_HEADERS="x-api-key=YOUR_BEACON_API_KEY"
export OTEL_SERVICE_NAME="my-ai-workflow"
```

Once the agent starts emitting traces:

```text
AI Workflow
  ↓
OpenTelemetry
  ↓
Beacon
  ↓
Execution Graph
```

The dashboard can display the execution as spans are processed.

---

## Current Backend Capabilities

### Infrastructure

- [x] Fastify API
- [x] PostgreSQL + Prisma
- [x] Redis
- [x] BullMQ
- [x] Zod environment validation
- [x] Graceful shutdown
- [x] Global error handling
- [x] Health check

### Ingestion

- [x] OpenTelemetry ingestion
- [x] OTLP HTTP endpoint
- [x] API key authentication
- [x] Payload validation
- [x] Asynchronous queueing
- [x] Duplicate span handling

### Execution Graph

- [x] Run creation
- [x] Node creation
- [x] Parent-child relationships
- [x] Edge creation
- [x] Run status tracking
- [x] Node status tracking
- [x] Stuck node detection
- [x] Token tracking
- [x] Cost tracking

### Real-Time

- [x] Redis Pub/Sub
- [x] Run-specific WebSocket connections
- [x] Node creation events
- [x] Edge creation events
- [x] Run status events
- [x] Connection cleanup

### Authentication & Workspaces

- [x] Clerk authentication
- [x] Workspace-based API keys
- [x] API key activation/deactivation
- [x] API key regeneration
- [x] Clerk webhook integration

---

## License

MIT — use it, fork it, learn from it.

---

<div align="center">
  <sub>If this was useful or interesting — a ⭐ goes a long way.</sub>
</div>
