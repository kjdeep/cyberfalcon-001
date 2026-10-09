export type FleetTelemetry = {
  siteId: string; robotId: string; ts: Date; batteryPct: number; motorTempC: number;
  distanceM: number; runtimeS: number; faultCodes: string[]; status: 'nominal' | 'degraded' | 'fault' | 'maintenance' | 'offline'; source: string;
};

export interface MLAnomalyModel {
  version: string;
  score(input: FleetTelemetry[]): { score: number; confidence: number; predictedFailureTs?: Date; evidence: Record<string, unknown> };
}

export class TelemetryService {
  ingest(sample: FleetTelemetry): { accepted: boolean; rollupBucket: '1m' | '1h' } {
    return { accepted: Boolean(sample.siteId && sample.robotId), rollupBucket: '1m' };
  }
}
