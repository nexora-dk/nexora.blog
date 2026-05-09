"use client";

// usePathname 用于感知当前路由路径变化，从而触发页面切换动画重新播放。
import { usePathname } from "next/navigation";

// 页面过渡组件的参数，仅负责包裹当前路由页面内容。
type PageTransitionProps = {
  children: React.ReactNode;
};

/**
 * 页面过渡容器：路由路径变化时重建包裹节点，让 CSS 入场动画重新触发。
 */
export function PageTransition({ children }: PageTransitionProps) {
  // 当前 pathname 作为 key 使用，确保每次切换路由都会创建新的动画容器。
  const pathname = usePathname();

  return (
    // page-enter-soft 类在全局样式中定义淡入/位移动画。
    <div key={pathname} className="page-enter-soft">
      {/* 当前路由实际渲染的页面内容。 */}
      {children}
    </div>
  );
}
