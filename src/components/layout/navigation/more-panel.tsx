// Next.js Link 用于更多面板中的页面跳转。
import Link from "next/link";
// lucide 图标用于为每个更多入口提供视觉标识。
import { Box, FolderCog, Images, User, Users } from "lucide-react";
import type { MorePanelData } from "@/components/layout/navigation/navigation-data";
// 更多面板专用样式，控制入口列表、图标和文案排版。
import styles from "@/styles/page/more-panel.module.css";

type MorePanelProps = {
  data: MorePanelData;
};

const moreIconMap = {
  images: Images,
  box: Box,
  "folder-cog": FolderCog,
  users: Users,
  user: User,
};

/**
 * 更多导航面板：展示站点补充页面的快捷入口。
 */
export function MorePanel({ data }: MorePanelProps) {
  return (
    // 更多面板根容器。
    <div className={styles.morePanel}>
      {/* 遍历更多入口数据，动态取出图标组件并渲染链接。 */}
      {data.links.map((link) => {
        const Icon = moreIconMap[link.iconKey];

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
