"use client";

// CSSProperties 用于给内联样式中的自定义 CSS 变量补类型，useState 管理菜单状态。
import { type CSSProperties, useState } from "react";
// Next.js Link 用于普通导航项的客户端跳转。
import Link from "next/link";
// useRouter 用于在点击带面板的触发器时主动跳转到对应页面。
import { useRouter } from "next/navigation";
// 首页导航悬浮面板。
import { startRouteTransition } from "@/components/layout/route-transition-indicator";
import { HomePanel } from "@/components/layout/navigation/home-panel";
// 更多导航悬浮面板。
import { MorePanel } from "@/components/layout/navigation/more-panel";
// 手记导航悬浮面板。
import { NotesPanel } from "@/components/layout/navigation/notes-panel";
// 时间线导航悬浮面板。
import { TimelinePanel } from "@/components/layout/navigation/timeline-panel";
// 文稿导航悬浮面板。
import { WritingPanel } from "@/components/layout/navigation/writing-panel";
// 各面板独立 CSS Module，用于匹配不同内容的尺寸和视觉样式。
import homePanelStyles from "@/styles/page/home-panel.module.css";
import morePanelStyles from "@/styles/page/more-panel.module.css";
import notesPanelStyles from "@/styles/page/notes-panel.module.css";
import timelinePanelStyles from "@/styles/page/timeline-panel.module.css";
import writingPanelStyles from "@/styles/page/writing-panel.module.css";
// 导航菜单基础组件封装了 Radix NavigationMenu 的交互能力。
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
// 站点配置提供导航项数据。
import { siteConfig } from "@/lib/site";
// 主导航 CSS Module，包含触发器、列表、viewport 和默认面板样式。
import styles from "@/styles/page/navigation.module.css";

// 当前支持的导航悬浮面板类型，与 siteConfig.nav 中的 panel.type 对齐。
type PanelType = "home" | "writing" | "notes" | "timeline" | "more";

/**
 * 根据面板类型返回对应的外层样式类名，让不同面板拥有各自尺寸和视觉布局。
 */
function getPanelClassName(type: PanelType) {
  // 首页面板使用头像和快捷链接布局。
  if (type === "home") {
    return homePanelStyles.panelShell;
  }

  // 文稿面板使用分类和近期文章双栏布局。
  if (type === "writing") {
    return writingPanelStyles.panelShell;
  }

  // 手记面板使用专栏和近期手记双栏布局。
  if (type === "notes") {
    return notesPanelStyles.panelShell;
  }

  // 时间线面板使用筛选标签和近期动态布局。
  if (type === "timeline") {
    return timelinePanelStyles.panelShell;
  }

  // 更多面板使用图标入口网格布局。
  if (type === "more") {
    return morePanelStyles.panelShell;
  }

  // 理论上不会走到这里；保留默认样式作为兜底。
  return styles.defaultPanelShell;
}

/**
 * 根据面板类型渲染对应内容组件。
 */
function renderPanel(type: PanelType, href?: string, title?: string) {
  // 首页下拉面板。
  if (type === "home") {
    return <HomePanel />;
  }

  // 文稿下拉面板。
  if (type === "writing") {
    return <WritingPanel />;
  }

  // 手记下拉面板。
  if (type === "notes") {
    return <NotesPanel />;
  }

  // 时间线下拉面板。
  if (type === "timeline") {
    return <TimelinePanel />;
  }

  // 更多下拉面板。
  if (type === "more") {
    return <MorePanel />;
  }

  // 如果未来出现未显式处理但带 href/title 的面板类型，则渲染一个普通查看链接。
  if (href && title) {
    return (
      <Link href={href} className={styles.panelLinkPlain}>
        <span className={styles.panelLinkTitle}>查看{title}</span>
      </Link>
    );
  }

  // 没有可渲染内容时返回 null。
  return null;
}

/**
 * 站点主导航：根据 siteConfig 生成导航项，并为带 panel 的项目提供悬浮面板。
 */
export function SiteNav() {
  // router 用于让带面板的触发器在点击时也能跳转到主页面。
  const router = useRouter();
  // viewportX 控制下拉 viewport 的水平位置，使浮层对齐当前触发器中心。
  const [viewportX, setViewportX] = useState("50%");
  // openPanel 受控管理当前打开的导航面板值。
  const [openPanel, setOpenPanel] = useState("");
  // 把 viewportX 注入 CSS 自定义变量，供 navigation-menu viewport 定位使用。
  const navStyle = { "--navigation-menu-viewport-x": viewportX } as CSSProperties;

  /**
   * 点击面板内容后关闭当前打开的面板。
   */
  function closePanel() {
    setOpenPanel("");
  }

  function navigateFromTrigger(href: string) {
    const targetURL = new URL(href, window.location.href);
    const targetPath = `${targetURL.pathname}${targetURL.search}`;
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (targetPath === currentPath) {
      return;
    }

    startRouteTransition();
    router.push(href);
  }

  /**
   * 根据触发器位置更新 viewport 的水平中心点。
   */
  function updateViewportX(element: HTMLElement) {
    // 找到最近的 nav 容器，作为计算相对位置的坐标系。
    const navRect = element.closest("nav")?.getBoundingClientRect();
    // 读取当前触发器的位置和宽度。
    const triggerRect = element.getBoundingClientRect();

    // 如果没有找到 nav 容器，无法计算相对位置，直接退出。
    if (!navRect) {
      return;
    }

    // 触发器中心点减去 nav 左侧位置，得到 viewport 在 nav 内的水平坐标。
    setViewportX(`${triggerRect.left + triggerRect.width / 2 - navRect.left}px`);
  }

  return (
    // NavigationMenu 使用受控 value 管理打开项，并通过 style 传入 viewport 定位变量。
    <NavigationMenu value={openPanel} onValueChange={setOpenPanel} className={styles.nav} viewportClassName={styles.viewport} style={navStyle}>
      {/* 导航列表容器。 */}
      <NavigationMenuList className={styles.list}>
        {/* 遍历站点配置，统一生成顶部导航项。 */}
        {siteConfig.nav.map((item) => (
          <NavigationMenuItem key={item.title} className={styles.item}>
            {/* 带 panel 的导航项渲染为触发器和下拉内容。 */}
            {"panel" in item ? (
              <>
                {/* 触发器支持悬浮/聚焦时更新 viewport 位置，点击时跳转到对应页面。 */}
                <NavigationMenuTrigger className={styles.link} onClick={() => "href" in item && navigateFromTrigger(item.href)} onPointerEnter={(event) => updateViewportX(event.currentTarget)} onFocus={(event) => updateViewportX(event.currentTarget)}>
                  {item.title}
                </NavigationMenuTrigger>
                {/* 下拉内容根据 panel.type 选择样式和组件，点击内容后关闭面板。 */}
                <NavigationMenuContent className={getPanelClassName(item.panel.type)} onClick={closePanel}>{renderPanel(item.panel.type, "href" in item ? item.href : undefined, item.title)}</NavigationMenuContent>
              </>
            ) : (
              // 不带 panel 的导航项直接渲染普通链接。
              <NavigationMenuLink asChild>
                <Link href={item.href} className={styles.link}>
                  {item.title}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
