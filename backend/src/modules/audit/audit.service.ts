import { createHash } from 'node:crypto';

export type AuditInput = { siteId: string; robotId?: string; actorId: string; actorRole: string; eventType: string; payload: Record<string, unknown> };
export type AuditEvent = AuditInput & { hashPrev: string | null; hashSelf: string };

export class AuditService {
  append(previous: AuditEvent | null, input: AuditInput): AuditEvent {
    const hashPrev = previous?.hashSelf ?? null;
    const hashSelf = createHash('sha256').update(JSON.stringify({ ...input, hashPrev })).digest('hex');
    return { ...input, hashPrev, hashSelf };
  }

  verify(events: AuditEvent[]): boolean {
    return events.every((event, index) => {
      const previous = index === 0 ? null : events[index - 1].hashSelf;
      const expected = createHash('sha256').update(JSON.stringify({ siteId: event.siteId, robotId: event.robotId, actorId: event.actorId, actorRole: event.actorRole, eventType: event.eventType, payload: event.payload, hashPrev: event.hashPrev })).digest('hex');
      return event.hashPrev === previous && event.hashSelf === expected;
    });
  }
}
