import * as THREE from "three";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

const DEG = Math.PI / 180;

type LngLat = [number, number];
type Ring = LngLat[];
type Polygon = Ring[];

export function getPositionFromLatLng(lat: number, lon: number, radius: number) {
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

export function createLandPointGeometry(radius: number) {
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

export function createLandOutlineGeometry(radius: number) {
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

export function createGridGeometry(radius: number) {
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
