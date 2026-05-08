"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { EarthGlobe } from "./earth-globe";

export function LocationGlobeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 6.8], fov: 32 }} dpr={[1, 1.7]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.65} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} />
      <EarthGlobe />
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.55} enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
