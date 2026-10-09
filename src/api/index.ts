import { Hono } from 'hono';

const app = new Hono().basePath('/api');

app.get('/health', (c) => c.json({ service: 'falconfleetops-web', status: 'ok', mode: c.env?.FLEETOPS_MODE ?? 'simulation' }));
app.get('/capabilities', (c) => c.json({ pillars: ['observe', 'predict', 'update', 'fix', 'prove'], backend: 'nestjs-contract', telemetry: 'timescaledb-rollups' }));

export default app;
