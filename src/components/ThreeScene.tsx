import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* Floating abstract geometry for the "Why Choose Us" or services section */
function FloatingNodes() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const nodes = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 3,
      ] as [number, number, number],
      scale: 0.12 + Math.random() * 0.22,
      speed: 0.28 + Math.random() * 0.45,
      offset: Math.random() * Math.PI * 2,
      type: i % 3, // 0=sphere, 1=box, 2=octahedron
    }));
  }, []);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(180);
    for (let i = 0; i < 60; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
    }
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const node = nodes[i];
      mesh.position.y = node.position[1] + Math.sin(t * node.speed + node.offset) * 0.28;
      mesh.rotation.x = t * node.speed * 0.3;
      mesh.rotation.z = t * node.speed * 0.2;
    });
  });

  const matProps = {
    color: '#7CE88A',
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  };

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
          position={node.position}
          scale={node.scale}
        >
          {node.type === 0 && <sphereGeometry args={[1, 10, 10]} />}
          {node.type === 1 && <boxGeometry args={[1.4, 1.4, 1.4]} />}
          {node.type === 2 && <octahedronGeometry args={[1]} />}
          <meshBasicMaterial {...matProps} />
        </mesh>
      ))}

      {/* Connection lines: a single line from the center */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#34D399"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.25;
      innerRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      {/* Outer wireframe shell */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial
          color="#7CE88A"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner solid */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshStandardMaterial
          color="#34D399"
          emissive="#1a6648"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Glow point light */}
      <pointLight color="#7CE88A" intensity={2.5} distance={5} />
    </group>
  );
}

export function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <CentralOrb />
      <FloatingNodes />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
      />
    </Canvas>
  );
}
