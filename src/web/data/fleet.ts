export type RobotStatus = "nominal" | "degraded" | "fault" | "maintenance" | "offline";
export type Severity = "critical" | "high" | "medium" | "low";

export type Robot = {
  id: string;
  name: string;
  siteId: string;
  site: string;
  vendor: string;
  model: string;
  serial: string;
  status: RobotStatus;
  battery: number;
  motorTemp: number;
  uptime: number;
  firmware: string;
  lastSeen: string;
  tags: string[];
  distance: number;
  runtime: number;
  fault?: string;
};

export type TelemetryPoint = { time: string; battery: number; temperature: number; threshold: number };
export type Anomaly = {
  id: string;
  robotId: string;
  type: string;
  component: string;
  severity: Severity;
  title: string;
  detected: string;
  predicted: string;
  confidence: number;
  rule: string;
  evidence: string;
  recommended: string;
  status: "open" | "ticketed" | "dismissed";
  curve: TelemetryPoint[];
};
export type Ticket = {
  id: string;
  robotId: string;
  title: string;
  priority: Severity;
  status: "open" | "assigned" | "in_progress" | "waiting_parts" | "resolved";
  technician: string;
  age: string;
  downtime: number;
  cost: number;
  parts: string[];
  rootCause?: string;
};
export type Part = { partNumber: string; description: string; vendor: string; model: string; stock: number; leadTime: number; cost: number; match: number };
export type Site = { id: string; name: string; location: string; robots: number; uptime: number; hourlyCost: number; sla: number; status: "on_track" | "at_risk" };
export type AuditEvent = { id: string; time: string; actor: string; role: string; event: string; robot: string; hash: string; verified: boolean };

const vendors = [
  ["MiR", "MiR250"],
  ["Geekplus", "P800"],
  ["Locus", "Vector"],
  ["Zebra", "FlexiCart"],
  ["Omron", "LD-250"],
  ["KUKA", "KMP600"],
] as const;
const siteNames = ["Reno Fulfillment", "Columbus 3PL", "Tilburg RaaS Hub"];
const statusFor = (index: number): RobotStatus => index === 7 || index === 39 ? "fault" : index % 19 === 0 ? "maintenance" : index % 23 === 0 ? "offline" : index % 11 === 0 ? "degraded" : "nominal";

export const sites: Site[] = [
  { id: "site-reno", name: "Reno Fulfillment", location: "Reno, NV · UTC−08", robots: 220, uptime: 99.42, hourlyCost: 840, sla: 99.2, status: "on_track" },
  { id: "site-columbus", name: "Columbus 3PL", location: "Columbus, OH · UTC−05", robots: 60, uptime: 98.91, hourlyCost: 620, sla: 99.0, status: "on_track" },
  { id: "site-tilburg", name: "Tilburg RaaS Hub", location: "Tilburg, NL · UTC+01", robots: 120, uptime: 97.86, hourlyCost: 710, sla: 98.5, status: "at_risk" },
];

export const robots: Robot[] = Array.from({ length: 400 }, (_, index) => {
  const [vendor, model] = vendors[index % vendors.length];
  const siteIndex = index < 220 ? 0 : index < 280 ? 1 : 2;
  const status = statusFor(index);
  const isFault = status === "fault";
  return {
    id: `robot-${String(index + 1).padStart(3, "0")}`,
    name: `AMR-${String(index + 1).padStart(3, "0")}`,
    siteId: sites[siteIndex].id,
    site: siteNames[siteIndex],
    vendor,
    model,
    serial: `FF-${vendor.slice(0, 3).toUpperCase()}-${String(8700 + index)}`,
    status,
    battery: isFault ? 31 : Math.round(72 + ((index * 13) % 26)),
    motorTemp: isFault ? 78 : Math.round(36 + ((index * 7) % 19)),
    uptime: isFault ? 94.2 : Number((98.2 + ((index * 17) % 18) / 10).toFixed(1)),
    firmware: index % 5 === 0 ? "2.8.1" : "2.7.4",
    lastSeen: status === "offline" ? "18m ago" : `${(index % 8) + 1}s ago`,
    tags: index % 4 === 0 ? ["cold-store", "priority"] : index % 3 === 0 ? ["pick-module"] : ["standard"],
    distance: 10240 + index * 213,
    runtime: 26400 + index * 118,
    fault: isFault ? "MOTOR_TEMP_RAMP" : undefined,
  };
});

const makeCurve = (variant: "battery" | "temperature" | "drift"): TelemetryPoint[] => Array.from({ length: 18 }, (_, index) => {
  const wave = Math.sin(index / 2.2) * 2.2;
  if (variant === "temperature") return { time: `${String(6 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`, battery: 76 - index * 0.4, temperature: 46 + index * 1.7 + wave, threshold: 68 };
  if (variant === "drift") return { time: `${String(6 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`, battery: 76 - index * 0.3, temperature: 42 + wave, threshold: 4.5 };
  return { time: `${String(6 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`, battery: 92 - index * 2.9 + wave, temperature: 42 + wave, threshold: 30 };
});

export const anomalies: Anomaly[] = [
  { id: "AN-2048", robotId: "robot-008", type: "motor_temperature", component: "Drive motor B", severity: "critical", title: "Motor temperature ramp exceeds baseline", detected: "8 min ago", predicted: "Today · 14:20", confidence: 96, rule: "WHEEL.MOTOR_TEMP ramp > 2.4°C/min for 6 samples", evidence: "78°C now vs 68°C safety threshold; slope +2.6°C/min", recommended: "Stop asset after current mission and inspect motor bearing.", status: "ticketed", curve: makeCurve("temperature") },
  { id: "AN-2047", robotId: "robot-143", type: "battery_health", component: "Battery pack", severity: "high", title: "Battery capacity falling outside rolling baseline", detected: "24 min ago", predicted: "18 Oct · 09:00", confidence: 89, rule: "CALL.BATT_CYCLE_COUNT > 1,200 and capacity z-score < -3", evidence: "Capacity delta −18% over 30d; 1,244 cycles", recommended: "Schedule pack inspection before next high-volume shift.", status: "open", curve: makeCurve("battery") },
  { id: "AN-2046", robotId: "robot-239", type: "encoder_drift", component: "Left wheel encoder", severity: "medium", title: "Encoder drift detected on straight-line run", detected: "42 min ago", predicted: "21 Oct · 16:00", confidence: 82, rule: "ENCODER.DRIFT > 4.5mm/m for 3 consecutive runs", evidence: "6.1mm/m residual; route repeatability −7%", recommended: "Add calibration task and check wheel tread wear.", status: "open", curve: makeCurve("drift") },
];

export const tickets: Ticket[] = [
  { id: "TCK-731", robotId: "robot-008", title: "Inspect drive motor B bearing", priority: "critical", status: "in_progress", technician: "Maya Chen", age: "8m", downtime: 12, cost: 168, parts: ["BRG-6204-2RS"] },
  { id: "TCK-730", robotId: "robot-143", title: "Battery pack capacity check", priority: "high", status: "waiting_parts", technician: "Unassigned", age: "24m", downtime: 38, cost: 589, parts: ["BAT-MIR-24V"] },
  { id: "TCK-729", robotId: "robot-052", title: "Lidar packet loss investigation", priority: "medium", status: "assigned", technician: "J. Alvarez", age: "1h", downtime: 9, cost: 93, parts: [] },
  { id: "TCK-728", robotId: "robot-239", title: "Wheel encoder calibration", priority: "medium", status: "open", technician: "Unassigned", age: "2h", downtime: 0, cost: 0, parts: [] },
  { id: "TCK-727", robotId: "robot-311", title: "Replace charging contactor", priority: "low", status: "resolved", technician: "Maya Chen", age: "1d", downtime: 44, cost: 521, parts: ["CNT-OMR-48V"], rootCause: "Contactor pitting from high-cycle dock alignment" },
];

export const parts: Part[] = [
  { partNumber: "BRG-6204-2RS", description: "Sealed drive motor bearing", vendor: "MiR", model: "MiR250", stock: 14, leadTime: 2, cost: 42, match: 98 },
  { partNumber: "BAT-MIR-24V", description: "24V lithium battery pack", vendor: "MiR", model: "MiR250", stock: 3, leadTime: 7, cost: 488, match: 96 },
  { partNumber: "ENC-GP-800", description: "Wheel encoder assembly", vendor: "Geekplus", model: "P800", stock: 0, leadTime: 12, cost: 116, match: 91 },
  { partNumber: "CNT-OMR-48V", description: "Charging contactor", vendor: "Omron", model: "LD-250", stock: 8, leadTime: 3, cost: 74, match: 87 },
];

export const auditEvents: AuditEvent[] = [
  { id: "evt-001", time: "Today · 10:42:18", actor: "Maya Chen", role: "Technician", event: "Ticket TCK-731 moved to in_progress", robot: "AMR-008", hash: "8c2d…fa19", verified: true },
  { id: "evt-002", time: "Today · 10:37:02", actor: "FleetOps Node · Reno", role: "Gateway", event: "Anomaly AN-2048 detected", robot: "AMR-008", hash: "2a14…c8d1", verified: true },
  { id: "evt-003", time: "Today · 09:58:45", actor: "Andre Singh", role: "OpsManager", event: "Firmware rollout staged at 20%", robot: "Fleet batch", hash: "fd3b…99a0", verified: true },
  { id: "evt-004", time: "Yesterday · 18:22:09", actor: "System", role: "Automation", event: "Downtime event costed at USD 521", robot: "AMR-311", hash: "73e1…6bd4", verified: true },
];

export const telemetryFor = (robotId: string): TelemetryPoint[] => {
  const robot = robots.find((item) => item.id === robotId) ?? robots[0];
  return Array.from({ length: 24 }, (_, index) => ({
    time: `${String(7 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
    battery: Math.max(24, robot.battery + 9 - index * 0.42 + Math.sin(index / 2) * 1.8),
    temperature: robot.motorTemp - 3 + index * (robot.status === "fault" ? 0.64 : 0.08) + Math.sin(index / 2.1) * 1.5,
    threshold: 68,
  }));
};

export const kpis = {
  uptime: "99.42%",
  activeFaults: "03",
  maintenance: "07",
  projected: "12",
  downtimeCost: "$18,420",
};
