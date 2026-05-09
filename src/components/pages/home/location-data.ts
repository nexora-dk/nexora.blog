// 定义首页位置卡片和地球标记共用的地点常量，集中维护展示名称与经纬度。
export const FOSHAN = {
  // 展示在 LocationCard 标题中的城市名。
  name: "佛山",
  // 纬度用于把城市点投射到 Three.js 球面坐标。
  lat: 23.0215,
  // 经度用于把城市点投射到 Three.js 球面坐标。
  lon: 113.1214,
} as const;
