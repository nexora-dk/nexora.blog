// React 命名空间类型用于继承 Radix 原始组件的 props。
import * as React from "react"
// cva 用于抽出可复用的导航触发器样式。
import { cva } from "class-variance-authority"
// Radix NavigationMenu 提供无障碍导航菜单的底层交互能力。
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

// cn 用于合并默认样式和调用方传入的 className。
import { cn } from "@/lib/utils"

/**
 * 导航菜单根组件：封装 Radix Root，并可选择是否渲染共享 viewport。
 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  viewportClassName,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  // 是否启用 Radix viewport，用于承载下拉面板动画和尺寸同步。
  viewport?: boolean
  // 传给 viewport 的额外样式。
  viewportClassName?: string
}) {
  return (
    // Root 是导航菜单的交互上下文，data-slot 便于样式或调试时识别组件层级。
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {/* 调用方传入的导航列表和条目。 */}
      {children}
      {/* 启用 viewport 时渲染浮层容器，用于承载菜单内容面板。 */}
      {viewport && <NavigationMenuViewport className={viewportClassName} />}
    </NavigationMenuPrimitive.Root>
  )
}

/**
 * 导航菜单列表：封装 Radix List 并统一横向排列样式。
 */
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * 导航菜单项：封装 Radix Item，作为触发器和内容的相对定位父级。
 */
function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

// 导航触发器基础样式，保持透明背景、居中对齐和禁用态表现。
const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex w-max items-center justify-center bg-transparent text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50"
)

/**
 * 导航菜单触发器：用于打开对应的下拉内容面板。
 */
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {/* 触发器内部内容通常是导航标题和装饰元素。 */}
      {children}
    </NavigationMenuPrimitive.Trigger>
  )
}

/**
 * 导航菜单内容：承载每个导航项展开后的面板内容和进出场动画类。
 */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

/**
 * 导航菜单 viewport：负责定位并渲染 Radix 下拉浮层的尺寸动画容器。
 */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    // 外层 div 负责把 viewport 定位到当前触发项下方，并基于 CSS 变量水平居中。
    <div
      className="absolute isolate z-50 flex justify-center"
      style={{
        // 与导航触发器保持适当垂直距离。
        top: "1.85rem",
        // Radix 会维护 --navigation-menu-viewport-x，让浮层跟随触发项。
        left: "var(--navigation-menu-viewport-x, 50%)",
        // 将自身中心对齐到 left 指定位置。
        transform: "translateX(-50%)",
      }}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden duration-300 md:w-(--radix-navigation-menu-viewport-width)",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * 导航菜单链接：封装 Radix Link，统一菜单内链接的间距和焦点样式。
 */
function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none in-data-[slot=navigation-menu-content]:rounded-md [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * 导航菜单指示器：在触发项下方显示小箭头，指向当前展开的浮层。
 */
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      {/* 旋转 45 度的小方块形成箭头视觉。 */}
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

// 统一导出封装后的导航菜单组件，供站点导航按需组合使用。
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
