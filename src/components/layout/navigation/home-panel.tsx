// Next.js Image 用于优化头像图片加载。
import Image from "next/image";
// Next.js Link 用于面板内快捷入口跳转。
import Link from "next/link";
// 首页面板专用样式，控制头像、身份信息和链接布局。
import styles from "@/styles/page/home-panel.module.css";

// 首页面板中的快捷入口，指向站点介绍、迭代和赞助等辅助页面。
const homeLinks = [
  // 留言页面入口。
  { title: "留言", href: "/Comments" },
  // 自述页面入口。
  { title: "自述", href: "/Readme" },
  // 此站点说明页面入口。
  { title: "此站点", href: "/Site" },
  // 项目迭代记录入口。
  { title: "迭代", href: "/Iteration" },
  // 赞助页面入口。
  { title: "赞助", href: "/Sponsor" },
];

/**
 * 首页导航面板：展示作者头像、在线状态和首页相关快捷链接。
 */
export function HomePanel() {
  return (
    // 面板根容器，提供整体卡片布局。
    <div className={styles.homePanel}>
      {/* 作者身份信息区域。 */}
      <div className={styles.homeProfile}>
        {/* 作者头像，空 alt 表示该图片是装饰性头像，不重复朗读。 */}
        <Image
          src="/images/avatar/avatar.jpg"
          width={48}
          height={48}
          className={styles.homeAvatar}
          alt=""
        />
        {/* 作者名称和状态文字。 */}
        <div className={styles.homeIdentity}>
          <strong className={styles.homeName}>Nexora</strong>
          <span className={styles.homeStatus}>在线中~</span>
        </div>
      </div>
      {/* 分隔线把身份信息和链接列表区分开。 */}
      <div className={styles.homeDivider} />
      {/* 快捷链接列表。 */}
      <div className={styles.homeLinks}>
        {/* 根据 homeLinks 数据渲染多个辅助页面入口。 */}
        {homeLinks.map((link) => (
          <Link key={link.title} href={link.href} className={styles.homeLink}>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
