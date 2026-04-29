import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import {
  AdditiveBlending,
  MeshBasicMaterial,
  Vector3,
  type Group,
  type LineSegments,
  type Mesh,
  type Points,
} from "three";

/* ─────────────────────────────────────────────
   Cybersecurity-themed 3D scene:
   - Network nodes & connections (data grid)
   - Scanning pulse ring
   - Floating data particles
   - Shield wireframe
   ───────────────────────────────────────────── */

/* ─── Network Grid: interconnected nodes ─── */
function NetworkGrid() {
  const groupRef = useRef<Group>(null!);
  const linesRef = useRef<LineSegments>(null!);
  const nodesRef = useRef<Points>(null!);

  const { nodePositions, linePositions, nodeColors } = useMemo(() => {
    const nodes: number[] = [];
    const colors: number[] = [];
    const lines: number[] = [];
    const nodeCount = 60;
    const nodeVecs: Vector3[] = [];

    // Generate random node positions in a sphere
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) - 3;
      nodes.push(x, y, z);
      nodeVecs.push(new Vector3(x, y, z));

      // Node colors: mix of red, cyan, and white
      const t = Math.random();
      if (t < 0.4) {
        colors.push(0.92, 0.11, 0.14); // #EC1C24 red
      } else if (t < 0.7) {
        colors.push(0.0, 0.8, 0.9); // Cyan
      } else {
        colors.push(0.6, 0.6, 0.7); // Muted gray-blue
      }
    }

    // Connect nearby nodes with lines
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodeVecs[i].distanceTo(nodeVecs[j]);
        if (dist < 3.0) {
          lines.push(
            nodeVecs[i].x, nodeVecs[i].y, nodeVecs[i].z,
            nodeVecs[j].x, nodeVecs[j].y, nodeVecs[j].z
          );
        }
      }
    }

    return {
      nodePositions: new Float32Array(nodes),
      linePositions: new Float32Array(lines),
      nodeColors: new Float32Array(colors),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.03;
    groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#EC1C24" transparent opacity={0.06} />
      </lineSegments>

      {/* Nodes */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={nodePositions.length / 3} array={nodePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={nodeColors.length / 3} array={nodeColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.7} sizeAttenuation blending={AdditiveBlending} />
      </points>
    </group>
  );
}

/* ─── Scanning Pulse Ring ─── */
function ScanRing() {
  const ringRef = useRef<Mesh>(null!);
  const ring2Ref = useRef<Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Pulsing scale
    const scale1 = 1 + Math.sin(t * 0.6) * 0.3;
    ringRef.current.scale.set(scale1, scale1, scale1);
    ringRef.current.rotation.z = t * 0.15;
    (ringRef.current.material as MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 0.6) * 0.04;

    const scale2 = 1 + Math.cos(t * 0.4) * 0.2;
    ring2Ref.current.scale.set(scale2, scale2, scale2);
    ring2Ref.current.rotation.z = -t * 0.1;
    (ring2Ref.current.material as MeshBasicMaterial).opacity = 0.05 + Math.cos(t * 0.4) * 0.03;
  });

  return (
    <>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 128]} />
        <meshBasicMaterial color="#EC1C24" transparent opacity={0.1} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[4.5, 0.008, 16, 128]} />
        <meshBasicMaterial color="#00ccdd" transparent opacity={0.06} />
      </mesh>
    </>
  );
}

/* ─── Data Particles: floating upward like data packets ─── */
function DataParticles() {
  const count = 200;
  const ref = useRef<Points>(null!);

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      vel[i] = 0.005 + Math.random() * 0.015;

      const t = Math.random();
      if (t < 0.3) {
        col[i * 3] = 0.92; col[i * 3 + 1] = 0.11; col[i * 3 + 2] = 0.14;
      } else if (t < 0.5) {
        col[i * 3] = 0.0; col[i * 3 + 1] = 0.75; col[i * 3 + 2] = 0.85;
      } else {
        col[i * 3] = 0.3; col[i * 3 + 1] = 0.3; col[i * 3 + 2] = 0.4;
      }
    }
    return { positions: pos, velocities: vel, colors: col };
  }, []);

  useFrame(() => {
    const geo = ref.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += velocities[i]; // Float upward

      if (posArr[i * 3 + 1] > 8) {
        posArr[i * 3] = (Math.random() - 0.5) * 16;
        posArr[i * 3 + 1] = -8;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.5} sizeAttenuation blending={AdditiveBlending} />
    </points>
  );
}

/* ─── Shield Wireframe: rotating security shield ─── */
function ShieldWireframe() {
  const ref = useRef<Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.15;
  });

  // Build a shield shape from line segments
  const shieldGeo = useMemo(() => {
    const points: number[] = [];
    const segments = 40;

    // Shield outline
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let x: number, y: number;

      if (t <= 0.25) {
        // Left top curve
        const a = t / 0.25;
        x = -1.2 + a * 1.2;
        y = 1.5 - a * 0.2;
      } else if (t <= 0.5) {
        // Right top curve
        const a = (t - 0.25) / 0.25;
        x = a * 1.2;
        y = 1.3 + a * 0.2;
      } else if (t <= 0.75) {
        // Right bottom curve to point
        const a = (t - 0.5) / 0.25;
        x = 1.2 * (1 - a);
        y = 1.5 - a * 3;
      } else {
        // Left bottom curve from point
        const a = (t - 0.75) / 0.25;
        x = -1.2 * a;
        y = -1.5 + a * 3;
      }

      points.push(x, y, 0);
      if (i < segments) {
        // Also push the next point to form line segment
        const t2 = (i + 1) / segments;
        let x2: number, y2: number;
        if (t2 <= 0.25) {
          const a = t2 / 0.25;
          x2 = -1.2 + a * 1.2;
          y2 = 1.5 - a * 0.2;
        } else if (t2 <= 0.5) {
          const a = (t2 - 0.25) / 0.25;
          x2 = a * 1.2;
          y2 = 1.3 + a * 0.2;
        } else if (t2 <= 0.75) {
          const a = (t2 - 0.5) / 0.25;
          x2 = 1.2 * (1 - a);
          y2 = 1.5 - a * 3;
        } else {
          const a = (t2 - 0.75) / 0.25;
          x2 = -1.2 * a;
          y2 = -1.5 + a * 3;
        }
        points.push(x2, y2, 0);
      }
    }
    return new Float32Array(points);
  }, []);

  return (
    <group ref={ref} position={[0, 0.3, 0]} scale={1.2}>
      {/* Shield outline */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={shieldGeo.length / 3} array={shieldGeo} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#EC1C24" transparent opacity={0.12} />
      </lineSegments>

      {/* Cross-hatch lines inside shield */}
      {[-0.6, 0, 0.6].map((y, i) => (
        <mesh key={`h${i}`} position={[0, y, 0]}>
          <planeGeometry args={[1.8, 0.003]} />
          <meshBasicMaterial color="#EC1C24" transparent opacity={0.05} />
        </mesh>
      ))}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={`v${i}`} position={[x, 0, 0]}>
          <planeGeometry args={[0.003, 2.5]} />
          <meshBasicMaterial color="#EC1C24" transparent opacity={0.05} />
        </mesh>
      ))}

      {/* Center lock icon (small sphere) */}
      <mesh position={[0, 0.2, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#EC1C24" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ─── Hex Grid Floor ─── */
function HexGrid() {
  const ref = useRef<Points>(null!);

  const positions = useMemo(() => {
    const pts: number[] = [];
    const size = 0.8;
    for (let row = -8; row <= 8; row++) {
      for (let col = -12; col <= 12; col++) {
        const x = col * size * 1.5;
        const z = row * size * Math.sqrt(3) + (col % 2 === 0 ? 0 : size * Math.sqrt(3) / 2);
        pts.push(x, -4, z - 5);
      }
    }
    return new Float32Array(pts);
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#EC1C24" transparent opacity={0.15} sizeAttenuation />
    </points>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <NetworkGrid />
        <ScanRing />
        <DataParticles />
        <ShieldWireframe />
        <HexGrid />
      </Canvas>
    </div>
  );
}
