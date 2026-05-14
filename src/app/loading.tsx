/**
 * 全局路由加载态：当 App Router 正在切换或等待页面数据时展示轻量加载动画。
 */
export default function Loading() {
  return (
    <div 
      // 移除了 pointer-events-none，防止加载时用户误触老页面
      // 减弱了 backdrop-blur 的值，1px 有点太少，通常 sm (4px) 更有磨砂质感
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all dark:bg-neutral-950/70"
      role="status"
      aria-label="页面加载中，请稍候"
    >
      <div className="flex flex-col items-center">
        {/* 中心加载动画 */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* 外层淡淡光晕 */}
          <div className="absolute inset-0 rounded-full bg-neutral-200/40 blur-2xl dark:bg-white/10" />

          {/* 扩散圆环 1：增加了 transform-gpu 提升性能 */}
          <div className="absolute h-24 w-24 transform-gpu animate-[loadingRipple_1.8s_ease-out_infinite] rounded-full border border-neutral-300/80 dark:border-white/20" />

          {/* 扩散圆环 2：错开时间 */}
          <div className="absolute h-24 w-24 transform-gpu animate-[loadingRipple_1.8s_ease-out_infinite_0.45s] rounded-full border border-neutral-300/60 dark:border-white/15" />

          {/* 中心黑点：呼吸效果 */}
          <div className="relative h-5 w-5 transform-gpu animate-[loadingDot_1.4s_ease-in-out_infinite] rounded-full bg-neutral-950 shadow-[0_0_30px_rgba(0,0,0,0.18)] dark:bg-white dark:shadow-[0_0_30px_rgba(255,255,255,0.28)]" />
        </div>

        {/* 模糊加载文案：增加了 motion-safe 尊重用户设备设置 */}
        <p className="mt-4 text-xs font-medium tracking-[0.25em] text-neutral-400 motion-safe:animate-[loadingText_1.8s_ease-in-out_infinite] dark:text-neutral-500">
          开一页，文章稍候
        </p>
      </div>
    </div>
  );
}