import { createServer } from 'node:http';

const server = createServer((request, response) => {
  response.setHeader('content-type', 'application/json');
  if (request.url === '/health' || request.url === '/api/v1/health') {
    response.end(JSON.stringify({ service: 'falconfleetops-backend', status: 'ok', mode: process.env.FLEETOPS_MODE ?? 'simulation' }));
    return;
  }
  if (request.url === '/api/v1/capabilities') {
    response.end(JSON.stringify({ modules: ['telemetry', 'devices', 'firmware', 'maintenance', 'tickets', 'parts', 'billing', 'auth', 'audit'], tenantIsolation: true }));
    return;
  }
  response.statusCode = 404;
  response.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(process.env.PORT ?? 3001, '0.0.0.0');
