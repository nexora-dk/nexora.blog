// 为缺少完整 TypeScript 类型的 topojson-client 包补充最小模块声明，避免导入时报类型错误。
declare module "topojson-client" {
  // feature 会把 TopoJSON 中的对象转换为 GeoJSON Feature/FeatureCollection；这里保持 unknown，避免给未建模数据做错误假设。
  export function feature(topology: unknown, object: unknown): unknown;
}
