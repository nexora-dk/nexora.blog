// Next.js Image 用于优化头像图片加载。
import Image from "next/image";
// Next.js Link 用于面板内快捷入口跳转。
import Link from "next/link";
import type { HomePanelData } from "@/components/layout/navigation/navigation-data";
// 首页面板专用样式，控制头像、身份信息和链接布局。
import styles from "@/styles/page/home-panel.module.css";

type HomePanelProps = {
  data: HomePanelData;
};

/**
 * 首页导航面板：展示作者头像、在线状态和首页相关快捷链接。
 */
export function HomePanel({ data }: HomePanelProps) {
  return (
    // 面板根容器，提供整体卡片布局。
    <div className={styles.homePanel}>
      {/* 作者身份信息区域。 */}
      <div className={styles.homeProfile}>
        {/* 作者头像，空 alt 表示该图片是装饰性头像，不重复朗读。 */}
        <Image
          src={data.profile.avatarUrl}
          width={48}
          height={48}
          className={styles.homeAvatar}
          alt=""
        />
        {/* 作者名称和状态文字。 */}
        <div className={styles.homeIdentity}>
          <strong className={styles.homeName}>{data.profile.name}</strong>
          <span className={styles.homeStatus}>{data.profile.status}</span>
        </div>
      </div>
      {/* 分隔线把身份信息和链接列表区分开。 */}
      <div className={styles.homeDivider} />
      {/* 快捷链接列表。 */}
      <div className={styles.homeLinks}>
        {/* 根据 homeLinks 数据渲染多个辅助页面入口。 */}
        {data.links.map((link) => (
          <Link key={link.title} href={link.href} className={styles.homeLink}>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
