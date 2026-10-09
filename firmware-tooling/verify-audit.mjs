#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const path = process.argv[2];
if (!path) { console.error('Usage: verify-audit.mjs <verifiable-events.json>'); process.exit(2); }
const events = JSON.parse(readFileSync(path, 'utf8'));
let previous = null;
for (const event of events) {
  const canonical = JSON.stringify({ siteId: event.siteId, robotId: event.robotId, actorId: event.actorId, actorRole: event.actorRole, eventType: event.eventType, payload: event.payload, hashPrev: event.hashPrev ?? null });
  const expected = createHash('sha256').update(canonical).digest('hex');
  if (event.hashPrev !== previous || event.hashSelf !== expected) { console.error(JSON.stringify({ ok: false, eventId: event.id })); process.exit(1); }
  previous = event.hashSelf;
}
console.log(JSON.stringify({ ok: true, events: events.length, chain: 'sha256' }));
