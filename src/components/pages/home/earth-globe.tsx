"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { FOSHAN } from "./location-data";
import { createGridGeometry, createLandOutlineGeometry, createLandPointGeometry, getPositionFromLatLng } from "./globe-geometry";

// Three.js 地球主体组件，负责生成几何体、执行轻微自转并渲染城市标记。
export function EarthGlobe() {
  // groupRef 指向整个地球组，useFrame 中通过它更新旋转角度。
  const groupRef = useRef<THREE.Group>(null);
  // radius 是所有球面、点云、轮廓和网格共用的基础半径。
  const radius = 1.64;
  // useMemo 避免每次 React 渲染都重新生成昂贵的陆地点云几何体。
  const landPointGeometry = useMemo(() => createLandPointGeometry(radius), []);
  // 陆地轮廓同样只在组件挂载时创建一次。
  const landOutlineGeometry = useMemo(() => createLandOutlineGeometry(radius), []);
  // 经纬网格是静态几何体，缓存后交给 lineSegments 复用。
  const gridGeometry = useMemo(() => createGridGeometry(radius), []);
  // 根据佛山经纬度计算标记点在球面外侧的位置。
  const markerPosition = useMemo(() => getPositionFromLatLng(FOSHAN.lat, FOSHAN.lon, radius + 0.08), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // 在固定朝向基础上叠加很小的正弦摆动，让地球保持活跃但不影响标记位置识别。
    groupRef.current.rotation.y = THREE.MathUtils.degToRad(154) + Math.sin(clock.elapsedTime * 0.22) * 0.03;
  });

  return (
    <group ref={groupRef} rotation={[THREE.MathUtils.degToRad(-12), THREE.MathUtils.degToRad(154), THREE.MathUtils.degToRad(-8)]}>
      {/* 半透明基础球体提供地球轮廓和淡色底面。 */}
      <mesh>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshBasicMaterial color="#f5f5f5" transparent opacity={0.64} side={THREE.DoubleSide} />
      </mesh>

      {/* 陆地点云用采样点勾勒大陆形状。 */}
      <points geometry={landPointGeometry}>
        <pointsMaterial size={0.017} color="#262626" transparent opacity={0.62} sizeAttenuation />
      </points>

      {/* 陆地轮廓线强化国家和海岸边界。 */}
      <lineSegments geometry={landOutlineGeometry}>
        <lineBasicMaterial color="#262626" transparent opacity={0.3} />
      </lineSegments>

      {/* 经纬网格帮助表达球面方向与空间结构。 */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color="#737373" transparent opacity={0.18} />
      </lineSegments>

      {/* 稍大的背面球壳模拟边缘高光/玻璃层。 */}
      <mesh scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      {/* 城市标记组定位到佛山坐标，内部小球作为黑色定位点。 */}
      <group position={markerPosition}>
        <mesh>
          <sphereGeometry args={[0.04, 18, 18]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      </group>
    </group>
  );
}
