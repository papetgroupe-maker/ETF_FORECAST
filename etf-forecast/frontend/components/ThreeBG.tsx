"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef } from "react";

function Blob({ color, position, scale = 1, speed = 0.4 }: { color: string; position: [number, number, number]; scale?: number; speed?: number; }) {
  const ref = useRef<any>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed * 0.2;
    ref.current.rotation.y += delta * speed * 0.3;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1.2, 2]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} />
    </mesh>
  );
}

export default function ThreeBG() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <Blob color="#5b8cff" position={[-2, 0.5, -1]} scale={1.4} />
        <Blob color="#a259ff" position={[2.2, -0.2, -1.2]} scale={1.1} speed={0.55} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
