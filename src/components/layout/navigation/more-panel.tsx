// Next.js Link 用于更多面板中的页面跳转。
import Link from "next/link";
// lucide 图标用于为每个更多入口提供视觉标识。
import { Box, FolderCog, Images, User, Users } from "lucide-react";
// 更多面板专用样式，控制入口列表、图标和文案排版。
import styles from "@/styles/page/more-panel.module.css";

// 更多面板入口列表，收纳不直接放在主导航一级的页面。
const moreLinks = [
  // 相册页面入口。
  { title: "相册", href: "/gallery", description: "按下快门的那些瞬间", icon: Images },
  // 收藏夹页面入口。
  { title: "收藏", href: "/collection", description: "值得反复回访的链接", icon: Box },
  // 项目页面入口。
  { title: "项目", href: "/projects", description: "那些亲手造过的开源东西", icon: FolderCog },
  // 友链页面入口。
  { title: "友链", href: "/friends", description: "互联网上走散又相遇的朋友", icon: Users },
  // 关于页面入口。
  { title: "关于", href: "/about", description: "关于我与这个站点", icon: User },
];

/**
 * 更多导航面板：展示站点补充页面的快捷入口。
 */
export function MorePanel() {
  return (
    // 更多面板根容器。
    <div className={styles.morePanel}>
      {/* 遍历更多入口数据，动态取出图标组件并渲染链接。 */}
      {moreLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Link key={link.href} href={link.href} className={styles.panelLink}>
            {/* 左侧图标用于区分入口类型。 */}
            <Icon className={styles.panelIcon} strokeWidth={2.6} />
            {/* 右侧文字区域包含标题和说明。 */}
            <span className={styles.panelLinkText}>
              <span className={styles.panelLinkTitle}>{link.title}</span>
              <span className={styles.panelLinkDescription}>{link.description}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
