import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uDisperse;
  uniform vec3 uPointer;
  uniform float uRadius;

  attribute vec3 aVelocity;
  attribute vec3 aOrigin;
  attribute float aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = aOrigin;

    // Subtle idle organic shimmer
    float shimmer = sin(uTime * 2.0 + aRandom * 6.28) * 0.035;
    pos += normalize(pos) * shimmer;

    // Distance to interactive pointer position in 3D
    float dist = distance(pos, uPointer);
    vec3 dir = normalize(pos - uPointer + vec3(0.001));

    // Directional dispersion + turbulence
    float factor = smoothstep(uRadius, 0.0, dist) * uDisperse;
    vec3 scatter = (dir * 2.0 + aVelocity * 3.0) * factor;

    // Global dispersion push
    vec3 finalPos = pos + scatter + aVelocity * (uDisperse * 1.4);

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Attenuated particle point size for crisp individual dots
    gl_PointSize = (1.1 + aRandom * 1.4) * (1.0 / -mvPosition.z) * 4.2;

    // Color gradient matching dark green / emerald / cyan theme
    vec3 baseColor = mix(vec3(0.486, 0.910, 0.541), vec3(0.133, 0.827, 0.933), aRandom);
    vec3 disperseColor = mix(baseColor, vec3(0.85, 1.0, 0.72), factor);
    vColor = disperseColor;

    vAlpha = clamp(0.16 + (1.0 - factor * 0.3) * 0.24, 0.1, 0.45);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float glow = pow(1.0 - smoothstep(0.0, 0.5, dist), 1.6);
    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`;

function ParticleCluster({
  hovered,
  pointerPos,
  reducedMotion,
  tabVisible,
}: {
  hovered: boolean;
  pointerPos: React.MutableRefObject<THREE.Vector3>;
  reducedMotion: boolean;
  tabVisible: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const currentDisperse = useRef(0);

  const { positions, velocities, origins, randoms } = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const COUNT = isMobile ? 16000 : 28000;
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const orig = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.65 + Math.sin(theta * 4.0) * Math.cos(phi * 4.0) * 0.3;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 2.0;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2.0;

      rnd[i] = Math.random();
    }

    return { positions: pos, velocities: vel, origins: orig, randoms: rnd };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisperse: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, -999) },
      uRadius: { value: 2.2 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current || !tabVisible) return;
    const time = reducedMotion ? 0 : state.clock.getElapsedTime();

    const targetDisp = hovered && !reducedMotion ? 1.0 : 0.0;
    currentDisperse.current = THREE.MathUtils.damp(
      currentDisperse.current,
      targetDisp,
      4.5,
      delta
    );

    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uDisperse.value = currentDisperse.current;
    materialRef.current.uniforms.uPointer.value.copy(pointerPos.current);

    if (pointsRef.current && !reducedMotion) {
      pointsRef.current.rotation.y = time * 0.14;
      pointsRef.current.rotation.x = Math.sin(time * 0.09) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aOrigin" args={[origins, 3]} />
        <bufferAttribute attach="attributes-aVelocity" args={[velocities, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function DisperseScene({
  hovered,
  setHovered,
  reducedMotion,
  tabVisible,
}: {
  hovered: boolean;
  setHovered: (val: boolean) => void;
  reducedMotion: boolean;
  tabVisible: boolean;
}) {
  const pointer3D = useRef(new THREE.Vector3(0, 0, -999));

  useFrame((state) => {
    if (!tabVisible) return;
    const { pointer, camera } = state;
    if (hovered && !reducedMotion) {
      const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const target = camera.position.clone().add(dir.multiplyScalar(distance));
      pointer3D.current.copy(target);
    } else {
      pointer3D.current.set(0, 0, -999);
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        pointer3D.current.set(0, 0, -999);
      }}
      onPointerMove={() => setHovered(true)}
    >
      <ParticleCluster
        hovered={hovered}
        pointerPos={pointer3D}
        reducedMotion={reducedMotion}
        tabVisible={tabVisible}
      />
    </group>
  );
}

export function DisperseArtifact() {
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mq.removeEventListener("change", onChange);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[260px] sm:h-[320px] lg:h-[440px] flex items-center justify-center"
      style={{ touchAction: "pan-y" }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <DisperseScene
          hovered={hovered}
          setHovered={setHovered}
          reducedMotion={reducedMotion}
          tabVisible={tabVisible}
        />
      </Canvas>
    </div>
  );
}

export default DisperseArtifact;
