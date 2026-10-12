import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ArtifactData {
  id: number;
  initialPos: [number, number, number];
  type: "icosahedron" | "torusKnot" | "octahedron" | "sphere" | "dodecahedron" | "roundedBox";
  scale: number;
  color: string;
  wireframe: boolean;
  driftSpeed: number;
  rotSpeed: [number, number, number];
  phase: number;
  opacity: number;
}

function ArtifactMesh({
  data,
  pointerPos,
  tabVisible,
}: {
  data: ArtifactData;
  pointerPos: React.MutableRefObject<THREE.Vector3>;
  tabVisible: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const currentPos = useRef(new THREE.Vector3(...data.initialPos));
  const currentScale = useRef(data.scale);
  const targetPos = useRef(new THREE.Vector3(...data.initialPos));

  useFrame((state, delta) => {
    if (!meshRef.current || !tabVisible) return;
    const time = state.clock.getElapsedTime();

    const driftY = Math.sin(time * data.driftSpeed + data.phase) * 0.22;
    const driftX = Math.cos(time * (data.driftSpeed * 0.7) + data.phase) * 0.12;
    const basePos = new THREE.Vector3(
      data.initialPos[0] + driftX,
      data.initialPos[1] + driftY,
      data.initialPos[2]
    );

    const distToPointer = basePos.distanceTo(pointerPos.current);
    const repulsionRadius = 2.5;

    if (distToPointer < repulsionRadius && pointerPos.current.z > -10) {
      const pushDir = new THREE.Vector3()
        .subVectors(basePos, pointerPos.current)
        .normalize();
      const pushMag = (1 - distToPointer / repulsionRadius) * 0.9;
      targetPos.current.copy(basePos).addScaledVector(pushDir, pushMag);

      meshRef.current.rotation.x += pushDir.y * 0.04;
      meshRef.current.rotation.z -= pushDir.x * 0.04;
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        data.scale * 1.18,
        0.1
      );
    } else {
      targetPos.current.copy(basePos);
      currentScale.current = THREE.MathUtils.lerp(
        currentScale.current,
        data.scale,
        0.08
      );
    }

    currentPos.current.lerp(targetPos.current, 0.08);
    meshRef.current.position.copy(currentPos.current);
    meshRef.current.scale.setScalar(currentScale.current);

    meshRef.current.rotation.x += data.rotSpeed[0] * delta;
    meshRef.current.rotation.y += data.rotSpeed[1] * delta;
    meshRef.current.rotation.z += data.rotSpeed[2] * delta;
  });

  return (
    <mesh ref={meshRef}>
      {data.type === "icosahedron" && <icosahedronGeometry args={[1, 1]} />}
      {data.type === "torusKnot" && <torusKnotGeometry args={[0.7, 0.22, 48, 10]} />}
      {data.type === "octahedron" && <octahedronGeometry args={[1.0]} />}
      {data.type === "sphere" && <sphereGeometry args={[0.85, 20, 20]} />}
      {data.type === "dodecahedron" && <dodecahedronGeometry args={[0.9]} />}
      {data.type === "roundedBox" && <boxGeometry args={[1.1, 1.1, 1.1]} />}

      <meshStandardMaterial
        color={data.color}
        wireframe={data.wireframe}
        emissive={data.color}
        emissiveIntensity={0.25}
        roughness={0.25}
        metalness={0.8}
        transparent
        opacity={data.opacity}
      />
    </mesh>
  );
}

function SceneGroup({
  windowPointer,
  tabVisible,
}: {
  windowPointer: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
  tabVisible: boolean;
}) {
  const pointerWorldPos = useRef(new THREE.Vector3(0, 0, -999));
  const groupRef = useRef<THREE.Group>(null!);

  // 6 small objects positioned near the left and right edges so they never sit behind text
  const artifacts: ArtifactData[] = useMemo(
    () => [
      {
        id: 1,
        initialPos: [-5.1, 2.1, -0.5],
        type: "icosahedron",
        scale: 0.34,
        color: "#7CE88A",
        wireframe: true,
        driftSpeed: 0.9,
        rotSpeed: [0.25, 0.4, 0.1],
        phase: 0,
        opacity: 0.28,
      },
      {
        id: 2,
        initialPos: [-4.7, -0.4, -0.8],
        type: "octahedron",
        scale: 0.3,
        color: "#34D399",
        wireframe: false,
        driftSpeed: 1.1,
        rotSpeed: [0.3, 0.2, 0.3],
        phase: 1.7,
        opacity: 0.22,
      },
      {
        id: 3,
        initialPos: [-5.0, -2.5, -0.4],
        type: "dodecahedron",
        scale: 0.32,
        color: "#22D3EE",
        wireframe: true,
        driftSpeed: 0.8,
        rotSpeed: [0.2, 0.35, 0.2],
        phase: 3.2,
        opacity: 0.26,
      },
      {
        id: 4,
        initialPos: [5.0, 2.0, -0.6],
        type: "torusKnot",
        scale: 0.28,
        color: "#7CE88A",
        wireframe: true,
        driftSpeed: 1.0,
        rotSpeed: [0.3, 0.45, 0.15],
        phase: 0.8,
        opacity: 0.25,
      },
      {
        id: 5,
        initialPos: [4.8, -0.6, -0.7],
        type: "roundedBox",
        scale: 0.3,
        color: "#34D399",
        wireframe: false,
        driftSpeed: 0.85,
        rotSpeed: [0.25, 0.3, 0.25],
        phase: 2.4,
        opacity: 0.22,
      },
      {
        id: 6,
        initialPos: [5.1, -2.4, -0.5],
        type: "icosahedron",
        scale: 0.33,
        color: "#22D3EE",
        wireframe: true,
        driftSpeed: 0.95,
        rotSpeed: [0.35, 0.25, 0.2],
        phase: 4.1,
        opacity: 0.28,
      },
    ],
    []
  );

  useFrame((state) => {
    if (!tabVisible) return;
    const { camera } = state;
    const ptr = windowPointer.current;

    if (ptr.active) {
      const vector = new THREE.Vector3(ptr.x, ptr.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      pointerWorldPos.current.copy(pos);
    } else {
      pointerWorldPos.current.set(0, 0, -999);
    }

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        ptr.x * 0.25,
        0.04
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        ptr.y * 0.2,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, 0, 3]} intensity={0.6} color="#7CE88A" />
      <pointLight position={[5, 0, 3]} intensity={0.6} color="#22D3EE" />

      {artifacts.map((item) => (
        <ArtifactMesh
          key={item.id}
          data={item}
          pointerPos={pointerWorldPos}
          tabVisible={tabVisible}
        />
      ))}
    </group>
  );
}

export function ReactiveArtifacts() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const windowPointer = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMqChange);

    const onVisChange = () =>
      setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisChange);

    const onPointerMove = (e: PointerEvent) => {
      windowPointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      windowPointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      windowPointer.current.active = true;
    };

    const onPointerLeave = () => {
      windowPointer.current.active = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      mq.removeEventListener("change", onMqChange);
      document.removeEventListener("visibilitychange", onVisChange);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave
      );
    };
  }, []);

  if (reducedMotion) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <SceneGroup windowPointer={windowPointer} tabVisible={tabVisible} />
      </Canvas>
    </div>
  );
}

export default ReactiveArtifacts;
