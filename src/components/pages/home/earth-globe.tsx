"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { FOSHAN } from "./location-data";
import { createGridGeometry, createLandOutlineGeometry, createLandPointGeometry, getPositionFromLatLng } from "./globe-geometry";

export function EarthGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 1.64;
  const landPointGeometry = useMemo(() => createLandPointGeometry(radius), []);
  const landOutlineGeometry = useMemo(() => createLandOutlineGeometry(radius), []);
  const gridGeometry = useMemo(() => createGridGeometry(radius), []);
  const markerPosition = useMemo(() => getPositionFromLatLng(FOSHAN.lat, FOSHAN.lon, radius + 0.08), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = THREE.MathUtils.degToRad(154) + Math.sin(clock.elapsedTime * 0.22) * 0.03;
  });

  return (
    <group ref={groupRef} rotation={[THREE.MathUtils.degToRad(-12), THREE.MathUtils.degToRad(154), THREE.MathUtils.degToRad(-8)]}>
      <mesh>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshBasicMaterial color="#f5f5f5" transparent opacity={0.64} side={THREE.DoubleSide} />
      </mesh>

      <points geometry={landPointGeometry}>
        <pointsMaterial size={0.017} color="#262626" transparent opacity={0.62} sizeAttenuation />
      </points>

      <lineSegments geometry={landOutlineGeometry}>
        <lineBasicMaterial color="#262626" transparent opacity={0.3} />
      </lineSegments>

      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color="#737373" transparent opacity={0.18} />
      </lineSegments>

      <mesh scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      <group position={markerPosition}>
        <mesh>
          <sphereGeometry args={[0.04, 18, 18]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      </group>
    </group>
  );
}
