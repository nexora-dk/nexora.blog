import Link from "next/link";
import { Box, FolderCog, Images, User, Users } from "lucide-react";
import styles from "@/styles/page/more-panel.module.css";

const moreLinks = [
  { title: "相册", href: "/gallery", description: "按下快门的那些瞬间", icon: Images },
  { title: "收藏", href: "/collection", description: "值得反复回访的链接", icon: Box },
  { title: "项目", href: "/projects", description: "那些亲手造过的开源东西", icon: FolderCog },
  { title: "友链", href: "/friends", description: "互联网上走散又相遇的朋友", icon: Users },
  { title: "关于", href: "/about", description: "关于我与这个站点", icon: User },
];

export function MorePanel() {
  return (
    <div className={styles.morePanel}>
      {moreLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Link key={link.href} href={link.href} className={styles.panelLink}>
            <Icon className={styles.panelIcon} strokeWidth={2.6} />
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
