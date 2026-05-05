import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/page/home-panel.module.css";

const homeLinks = [ 
  { title: "留言", href: "/Comments" },
  { title: "自述", href: "/Readme" },
  { title: "此站点", href: "/Site" },
  { title: "迭代", href: "/Iteration" },
  { title: "赞助", href: "/Sponsor" },
];

export function HomePanel() {
  return (
    <div className={styles.homePanel}>
      <div className={styles.homeProfile}>
        <Image
          src="/images/avatar/avatar.jpg"
          width={48}
          height={48}
          className={styles.homeAvatar}
          alt=""
        />
        <div className={styles.homeIdentity}>
          <strong className={styles.homeName}>Nexora</strong>
          <span className={styles.homeStatus}>在线中~</span>
        </div>
      </div>
      <div className={styles.homeDivider} />
      <div className={styles.homeLinks}>
        {homeLinks.map((link) => (
          <Link key={link.title} href={link.href} className={styles.homeLink}>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
