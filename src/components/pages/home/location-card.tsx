"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { MapPin } from "lucide-react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

const FOSHAN = {
  name: "佛山",
  lat: 23.0215,
  lon: 113.1214,
};

const DEG = Math.PI / 180;

type LngLat = [number, number];
type Ring = LngLat[];
type Polygon = Ring[];

function getPositionFromLatLng(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;

  return new THREE.Vector3(-(radius * Math.sin(phi) * Math.cos(theta)), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}

function getPolygonsFromWorldAtlas(): Polygon[] {
  const geo = feature(world as never, (world as { objects: { countries: unknown } }).objects.countries as never) as {
    features: Array<{
      geometry?: {
        type: "Polygon" | "MultiPolygon";
        coordinates: Polygon | Polygon[];
      };
    }>;
  };

  const polygons: Polygon[] = [];

  for (const item of geo.features) {
    const geometry = item.geometry;
    if (!geometry) continue;

    if (geometry.type === "Polygon") {
      polygons.push(geometry.coordinates as Polygon);
    }

    if (geometry.type === "MultiPolygon") {
      polygons.push(...(geometry.coordinates as Polygon[]));
    }
  }

  return polygons;
}

function getRingBounds(ring: Ring) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lon, lat] of ring) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  return { minLon, maxLon, minLat, maxLat };
}

function isPointInRing(point: LngLat, ring: Ring) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0000001) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function isPointInPolygon(point: LngLat, polygon: Polygon) {
  const outerRing = polygon[0];
  if (!outerRing) return false;
  if (!isPointInRing(point, outerRing)) return false;

  for (let i = 1; i < polygon.length; i++) {
    if (isPointInRing(point, polygon[i])) return false;
  }

  return true;
}

function createLandPointGeometry(radius: number) {
  const cachedPolygons = getPolygonsFromWorldAtlas().map((polygon) => ({
    polygon,
    bounds: getRingBounds(polygon[0]),
  }));
  const points: number[] = [];
  const step = 1.45;

  for (let lat = -6; lat <= 82; lat += step) {
    for (let lon = -180; lon <= 180; lon += step) {
      const hit = cachedPolygons.some(({ polygon, bounds }) => {
        if (lon < bounds.minLon || lon > bounds.maxLon || lat < bounds.minLat || lat > bounds.maxLat) return false;
        return isPointInPolygon([lon, lat], polygon);
      });

      if (!hit) continue;

      const point = getPositionFromLatLng(lat, lon, radius + 0.012);
      points.push(point.x, point.y, point.z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return geometry;
}

function createLandOutlineGeometry(radius: number) {
  const points: number[] = [];

  for (const polygon of getPolygonsFromWorldAtlas()) {
    for (const ring of polygon) {
      for (let i = 0; i < ring.length - 1; i++) {
        const [lon1, lat1] = ring[i];
        const [lon2, lat2] = ring[i + 1];

        if (lat1 < -8 && lat2 < -8) continue;
        if (Math.abs(lon1 - lon2) > 80) continue;

        const p1 = getPositionFromLatLng(lat1, lon1, radius + 0.025);
        const p2 = getPositionFromLatLng(lat2, lon2, radius + 0.025);
        points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return geometry;
}

function createGridGeometry(radius: number) {
  const points: number[] = [];

  for (let lat = -60; lat <= 75; lat += 15) {
    for (let lon = -180; lon < 180; lon += 4) {
      const p1 = getPositionFromLatLng(lat, lon, radius + 0.004);
      const p2 = getPositionFromLatLng(lat, lon + 4, radius + 0.004);
      points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  }

  for (let lon = -180; lon < 180; lon += 15) {
    for (let lat = -60; lat < 82; lat += 4) {
      const p1 = getPositionFromLatLng(lat, lon, radius + 0.004);
      const p2 = getPositionFromLatLng(lat + 4, lon, radius + 0.004);
      points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return geometry;
}

function EarthGlobe() {
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

export function LocationCard() {
  return (
    <div className="relative h-[222px] shrink-0 overflow-hidden rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30">
      <div className="relative z-10 flex items-center gap-3 text-base font-semibold tracking-tight">
        <MapPin className="size-5" />
        {FOSHAN.name}
      </div>

      <div className="absolute inset-x-7 bottom-0 h-[156px] overflow-hidden">
        <div className="absolute left-1/2 top-0 size-[312px] -translate-x-1/2">
          <Canvas camera={{ position: [0, 0, 6.8], fov: 32 }} dpr={[1, 1.7]} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={1.65} />
            <directionalLight position={[2, 4, 5]} intensity={1.2} />
            <EarthGlobe />
            <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.55} enableDamping dampingFactor={0.08} />
          </Canvas>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-neutral-950 dark:via-neutral-950/70" />
    </div>
  );
}
