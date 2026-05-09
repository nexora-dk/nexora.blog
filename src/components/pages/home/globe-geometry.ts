import * as THREE from "three";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";

// 经纬度转弧度时使用的固定比例，所有球面坐标计算都复用它。
const DEG = Math.PI / 180;

// 地理数据的基础结构：坐标点、闭合环和多边形，与 GeoJSON 坐标层级保持一致。
type LngLat = [number, number];
type Ring = LngLat[];
type Polygon = Ring[];

// 将纬度、经度投射到 Three.js 球面坐标，用于陆地点、轮廓线、网格线和城市标记。
export function getPositionFromLatLng(lat: number, lon: number, radius: number) {
  // phi 表示从北极向下的极角，theta 表示绕 y 轴旋转的方位角。
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;

  // 返回 Vector3 时对 x 取负，匹配当前地球贴图/轮廓的朝向约定。
  return new THREE.Vector3(-(radius * Math.sin(phi) * Math.cos(theta)), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}

// 从 world-atlas 的 TopoJSON 中提取国家 Polygon 列表，供点采样和轮廓生成复用。
function getPolygonsFromWorldAtlas(): Polygon[] {
  // topojson-client 的 feature 会把压缩拓扑转换为接近 GeoJSON 的 features 数据。
  const geo = feature(world as never, (world as { objects: { countries: unknown } }).objects.countries as never) as {
    features: Array<{
      geometry?: {
        type: "Polygon" | "MultiPolygon";
        coordinates: Polygon | Polygon[];
      };
    }>;
  };

  // 统一拉平成 Polygon[]，让后续算法不用区分 Polygon 和 MultiPolygon。
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

// 计算一个环的经纬度包围盒，用于点落多边形判断前的快速粗筛。
function getRingBounds(ring: Ring) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  // 遍历环上的每个坐标点，持续收缩/扩展四个边界值。
  for (const [lon, lat] of ring) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  return { minLon, maxLon, minLat, maxLat };
}

// 使用射线法判断一个经纬度点是否落在单个 Ring 内部。
function isPointInRing(point: LngLat, ring: Ring) {
  const [x, y] = point;
  let inside = false;

  // i 是当前顶点，j 是前一个顶点；每条边与水平射线相交时翻转 inside。
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    // 0.0000001 避免水平边或重合点导致除零，同时不影响肉眼可见的采样结果。
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0000001) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

// 判断点是否位于多边形内部：必须在外环内，并且不能落入任何内洞。
function isPointInPolygon(point: LngLat, polygon: Polygon) {
  const outerRing = polygon[0];
  if (!outerRing) return false;
  if (!isPointInRing(point, outerRing)) return false;

  // 从第二个 ring 开始通常表示洞，命中洞时应视为不在陆地上。
  for (let i = 1; i < polygon.length; i++) {
    if (isPointInRing(point, polygon[i])) return false;
  }

  return true;
}

// 创建陆地点云几何体：按经纬度网格采样，只保留落在陆地多边形内的点。
export function createLandPointGeometry(radius: number) {
  // 预先缓存多边形和外环包围盒，减少每个采样点的复杂多边形判断次数。
  const cachedPolygons = getPolygonsFromWorldAtlas().map((polygon) => ({
    polygon,
    bounds: getRingBounds(polygon[0]),
  }));
  const points: number[] = [];
  // step 控制点云密度，数值越小点越密、计算量越大。
  const step = 1.45;

  // 限制纬度范围，避免南极区域点过多并贴合当前卡片中半球展示的视觉重点。
  for (let lat = -6; lat <= 82; lat += step) {
    for (let lon = -180; lon <= 180; lon += step) {
      // 先通过包围盒筛选，再进行点在多边形内的精确判断。
      const hit = cachedPolygons.some(({ polygon, bounds }) => {
        if (lon < bounds.minLon || lon > bounds.maxLon || lat < bounds.minLat || lat > bounds.maxLat) return false;
        return isPointInPolygon([lon, lat], polygon);
      });

      if (!hit) continue;

      // 给陆地点稍微增加半径，避免与基础球面 z-fighting。
      const point = getPositionFromLatLng(lat, lon, radius + 0.012);
      points.push(point.x, point.y, point.z);
    }
  }

  // BufferGeometry 使用 position 属性按 xyz 三元组绘制 points。
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return geometry;
}

// 创建国家/大陆轮廓线几何体，把多边形环上的相邻经纬度点转换成线段。
export function createLandOutlineGeometry(radius: number) {
  const points: number[] = [];

  for (const polygon of getPolygonsFromWorldAtlas()) {
    for (const ring of polygon) {
      // 遍历相邻点对，每次向 points 中压入一条线段的起点和终点。
      for (let i = 0; i < ring.length - 1; i++) {
        const [lon1, lat1] = ring[i];
        const [lon2, lat2] = ring[i + 1];

        // 跳过过低纬度和跨越日期变更线的长线段，减少视觉噪点和横穿地球的线。
        if (lat1 < -8 && lat2 < -8) continue;
        if (Math.abs(lon1 - lon2) > 80) continue;

        const p1 = getPositionFromLatLng(lat1, lon1, radius + 0.025);
        const p2 = getPositionFromLatLng(lat2, lon2, radius + 0.025);
        points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    }
  }

  // 每 6 个数字表示一条 lineSegments 线段的两个三维端点。
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return geometry;
}

// 创建经纬网格几何体，用横向纬线和纵向经线增强球体的空间感。
export function createGridGeometry(radius: number) {
  const points: number[] = [];

  // 生成横向纬线：固定 lat，按经度每 4 度连接一小段。
  for (let lat = -60; lat <= 75; lat += 15) {
    for (let lon = -180; lon < 180; lon += 4) {
      const p1 = getPositionFromLatLng(lat, lon, radius + 0.004);
      const p2 = getPositionFromLatLng(lat, lon + 4, radius + 0.004);
      points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  }

  // 生成纵向经线：固定 lon，按纬度每 4 度连接一小段。
  for (let lon = -180; lon < 180; lon += 15) {
    for (let lat = -60; lat < 82; lat += 4) {
      const p1 = getPositionFromLatLng(lat, lon, radius + 0.004);
      const p2 = getPositionFromLatLng(lat + 4, lon, radius + 0.004);
      points.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  }

  // 将网格线段写入 BufferGeometry，交给 lineSegments 材质渲染。
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return geometry;
}
