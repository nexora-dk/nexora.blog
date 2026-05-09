"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { EarthGlobe } from "./earth-globe";

// 封装 React Three Fiber 画布，负责提供相机、灯光和控制器给地球模型。
export function LocationGlobeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 6.8], fov: 32 }} dpr={[1, 1.7]} gl={{ alpha: true, antialias: true }}>
      {/* 环境光保证球体整体可见，不依赖单一方向光。 */}
      <ambientLight intensity={1.65} />
      {/* 方向光制造轻微明暗层次，让球体更有空间感。 */}
      <directionalLight position={[2, 4, 5]} intensity={1.2} />
      {/* 地球主体包含陆地点云、轮廓、网格和佛山标记。 */}
      <EarthGlobe />
      {/* 控制器仅允许旋转并带阻尼，禁用平移和缩放以保持卡片构图稳定。 */}
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.55} enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
