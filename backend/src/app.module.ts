// Modular-monolith boundary map. Each module owns its Prisma repositories and audit writes.
export const modules = [
  'telemetry', 'devices', 'firmware', 'maintenance', 'tickets', 'parts', 'billing', 'auth', 'audit',
] as const;

export class AppModule {
  readonly moduleBoundaries = modules;
}
