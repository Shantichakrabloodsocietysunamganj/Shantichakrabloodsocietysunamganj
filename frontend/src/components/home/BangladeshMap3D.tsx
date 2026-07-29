"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Line, Sparkles, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import bdData from "@/data/geo/bangladesh.json";

/* ---------- projection (real lng/lat -> scene x/y) ---------- */
const CLNG = 90.4, CLAT = 23.7, K = 0.72;
const project = ([lng, lat]: [number, number]) => [(lng - CLNG) * K, (lat - CLAT) * K] as [number, number];
const DEPTH = 0.5;

/* ---------- build REAL Bangladesh shapes ---------- */
function useShapes() {
  return useMemo(() => {
    const geom = bdData.features[0].geometry as any;
    const polys: number[][][][] = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
    const shapes: THREE.Shape[] = [];
    for (const poly of polys) {
      const ring = poly[0];
      if (ring.length < 12) continue; // skip tiny island specks
      const s = new THREE.Shape();
      ring.forEach((p, i) => {
        const [x, y] = project(p as [number, number]);
        if (i === 0) s.moveTo(x, y);
        else s.lineTo(x, y);
      });
      poly.slice(1).forEach((hole) => {
        const ph = new THREE.Path();
        hole.forEach((p, i) => {
          const [x, y] = project(p as [number, number]);
          if (i === 0) ph.moveTo(x, y);
          else ph.lineTo(x, y);
        });
        s.holes.push(ph);
      });
      shapes.push(s);
    }
    return shapes;
  }, []);
}

/* ---------- Sylhet blood network (real coords) ---------- */
const ORIGIN = project([91.3951, 25.0657]); // Sunamganj
const SYLHET_PT = [
  [91.8687, 24.8949], [91.4147, 24.3758], [91.7833, 24.4833], [91.67, 25.04],
  [91.32, 24.78], [91.16, 25.12], [91.18, 24.85], [90.97, 25.06],
  [91.36, 24.77], [91.82, 24.78], [91.7, 24.82], [91.88, 25.01],
  [91.51, 24.56], [91.63, 24.41], [91.73, 24.31], [91.83, 24.3],
  [91.97, 24.52], [91.58, 24.38],
].map((p) => project(p as [number, number]));

/* ---------- other divisions (real coords) — coming soon ---------- */
const DIVISIONS = [
  [90.4125, 23.8103], [91.7832, 22.3569], [89.5403, 22.8456], [88.6241, 24.3636],
  [90.3535, 22.701], [89.2752, 25.7439], [90.4203, 24.7471],
].map((p) => project(p as [number, number]));

const SYLHET_CENTER = project([91.6, 24.7]);

/* a glowing blood drop traveling along a curved path */
function Drop({ dest, delay, dur, color }: { dest: [number, number]; delay: number; dur: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const start = useRef<THREE.Vector3>(new THREE.Vector3(ORIGIN[0], ORIGIN[1], DEPTH + 0.05));
  const end = useRef<THREE.Vector3>(new THREE.Vector3(dest[0], dest[1], DEPTH + 0.05));
  const ctrl = useRef<THREE.Vector3>(
    new THREE.Vector3((ORIGIN[0] + dest[0]) / 2, (ORIGIN[1] + dest[1]) / 2, DEPTH + 0.85),
  );
  useFrame((state) => {
    const t = ((state.clock.elapsedTime + delay) % dur) / dur;
    if (ref.current) {
      const u = 1 - t;
      ref.current.position.set(
        u * u * start.current.x + 2 * u * t * ctrl.current.x + t * t * end.current.x,
        u * u * start.current.y + 2 * u * t * ctrl.current.y + t * t * end.current.y,
        u * u * (DEPTH + 0.05) + 2 * u * t * (DEPTH + 0.85) + t * t * (DEPTH + 0.05),
      );
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.opacity = t < 0.12 ? t / 0.12 : t > 0.88 ? (1 - t) / 0.12 : 1;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent toneMapped={false} />
    </mesh>
  );
}

/* gray partial drop for coming-soon routes (stops ~40%) */
function PartialDrop({ dest, delay }: { dest: [number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const sx = ORIGIN[0], sy = ORIGIN[1], ex = sx + (dest[0] - sx) * 0.42, ey = sy + (dest[1] - sy) * 0.42;
  const cx = (sx + ex) / 2, cy = (sy + ey) / 2;
  useFrame((state) => {
    const t = ((state.clock.elapsedTime + delay) % 3.4) / 3.4;
    if (ref.current) {
      const u = 1 - t;
      ref.current.position.set(
        u * u * sx + 2 * u * t * cx + t * t * ex,
        u * u * sy + 2 * u * t * cy + t * t * ey,
        DEPTH + 0.05 + Math.sin(Math.PI * t) * 0.25,
      );
      (ref.current.material as THREE.MeshStandardMaterial).opacity = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 0.5;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="#94a3b8" emissive="#64748b" emissiveIntensity={1} transparent toneMapped={false} />
    </mesh>
  );
}

function Scene() {
  const shapes = useShapes();
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.32 + pointer.y * 0.18, 0.06);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.25 - pointer.x * 0.3, 0.06);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[SYLHET_CENTER[0], SYLHET_CENTER[1], 3]} intensity={6} distance={7} color="#ef4444" />

      <Environment resolution={128}>
        <Lightformer intensity={1.4} position={[0, 5, 2]} scale={[10, 5, 1]} color="#bcd4ff" />
        <Lightformer intensity={0.8} position={[-5, 0, 2]} scale={[5, 10, 1]} color="#7aa2e8" />
        <Lightformer intensity={0.5} position={[4, -3, 1]} scale={[6, 6, 1]} color="#1e3a5f" />
      </Environment>

      <group ref={group}>
        <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.45}>
          {/* Bangladesh — real shapes, dark-blue glass */}
          {shapes.map((s, i) => (
            <mesh key={i} position={[0, 0, 0]}>
              <extrudeGeometry args={[s, { depth: DEPTH, bevelEnabled: false }]} />
              <meshPhysicalMaterial
                color="#0c2a4a"
                metalness={0.35}
                roughness={0.28}
                clearcoat={1}
                clearcoatRoughness={0.35}
                envMapIntensity={1.1}
              />
            </mesh>
          ))}

          {/* subtle edge outline for crisp borders */}
          {shapes.map((s, i) => (
            <mesh key={`e${i}`} position={[0, 0, DEPTH + 0.001]}>
              <shapeGeometry args={[s]} />
              <meshBasicMaterial color="#1d4e8a" wireframe transparent opacity={0.25} />
            </mesh>
          ))}

          {/* Sylhet region glow (only the NE) */}
          <mesh position={[SYLHET_CENTER[0], SYLHET_CENTER[1], DEPTH + 0.02]}>
            <circleGeometry args={[0.85, 48]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh position={[SYLHET_CENTER[0], SYLHET_CENTER[1], DEPTH + 0.03]}>
            <circleGeometry args={[0.45, 48]} />
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* origin hub: Sunamganj */}
          <mesh position={[ORIGIN[0], ORIGIN[1], DEPTH + 0.06]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#fecaca" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[ORIGIN[0], ORIGIN[1], DEPTH + 0.05]}>
            <ringGeometry args={[0.12, 0.16, 32]} />
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>

          {/* destination nodes */}
          {SYLHET_PT.map((p, i) => (
            <mesh key={`n${i}`} position={[p[0], p[1], DEPTH + 0.05]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial color="#fecaca" emissive="#ef4444" emissiveIntensity={1.4} toneMapped={false} />
            </mesh>
          ))}

          {/* blood network: drops from Sunamganj */}
          {SYLHET_PT.map((p, i) => (
            <Drop key={`d${i}`} dest={p} delay={i * 0.22} dur={2.2 + (i % 5) * 0.3} color="#ff3b3b" />
          ))}

          {/* coming-soon routes (gray dotted) */}
          {DIVISIONS.map((d, i) => (
            <Line
              key={`r${i}`}
              points={[[ORIGIN[0], ORIGIN[1], DEPTH + 0.04], [d[0], d[1], DEPTH + 0.04]]}
              color="#475569"
              lineWidth={1}
              dashed
              dashSize={0.12}
              gapSize={0.16}
              transparent
              opacity={0.6}
            />
          ))}
          {DIVISIONS.map((d, i) => (
            <PartialDrop key={`p${i}`} dest={d} delay={i * 0.4} />
          ))}

          <Sparkles count={36} scale={[9, 9, 2]} position={[0, 0, DEPTH + 1]} size={2.4} speed={0.4} color="#9ec5ff" opacity={0.6} />
        </Float>

        <ContactShadows position={[0, -3.6, 0]} opacity={0.45} scale={12} blur={2.6} far={5} color="#000814" />
      </group>
    </>
  );
}

export default function BangladeshMap3D() {
  return (
    <Canvas camera={{ position: [0, -2.6, 6.4], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ width: "100%", height: "100%" }}>
      <Scene />
    </Canvas>
  );
}
