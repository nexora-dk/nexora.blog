import { Phone, Mail } from "lucide-react";
import { SiGithub, SiTiktok, SiWechat, SiNeteasecloudmusic } from "@icons-pack/react-simple-icons";

const socialContacts = [
  { label: "GitHub", icon: SiGithub, href: "https://github.com/Nexora-ydk" },
  { label: "网易云音乐", icon: SiNeteasecloudmusic, href: "https://music.163.com/#/user/home?id=1598827836" },
  { label: "抖音", icon: SiTiktok, href: "https://www.douyin.com/user/self?from_tab_name=main" },
  { label: "微信", icon: SiWechat, href: "/images/wechat-qr.jpg" },
  { label: "Email", icon: Mail, href: "mailto:1175115123@qq.com", outline: true },
];

export function ContactMe() {
  return (
    <div className="h-[251px] shrink-0 rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30">
      <div className="flex items-center gap-3 text-base font-semibold tracking-tight">
        <Phone className="size-5" />
        联系我
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-6 text-neutral-500 dark:text-neutral-400">
        {socialContacts.map((contact) => {
          const Icon = contact.icon;

          return (
            <a key={contact.label} href={contact.href} target={contact.href.startsWith("mailto:") ? undefined : "_blank"} rel={contact.href.startsWith("mailto:") ? undefined : "noreferrer"} className="group flex items-center gap-3 rounded-lg px-2 py-1 text-sm text-neutral-500 transition duration-200 hover:-translate-y-0.5 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50">
              <Icon className={contact.outline ? "size-5 fill-none stroke-current transition-colors group-hover:text-neutral-950 dark:group-hover:text-neutral-50" : "size-5 fill-current transition-colors group-hover:text-neutral-950 dark:group-hover:text-neutral-50"} />
              <span className="transition-colors group-hover:text-neutral-950 dark:group-hover:text-neutral-50">{contact.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
