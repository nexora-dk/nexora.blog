import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Cake, GraduationCap, Sparkles, Star } from "lucide-react";

const profileFacts = [
  {
    label: "专业",
    title: "计算机科学与技术",
    description: "和代码、系统、创造力打交道，也在慢慢建立自己的技术审美。",
    icon: GraduationCap,
    image: "/images/about-me/major.png",
    className: "md:col-span-2",
  },
  {
    label: "生于",
    title: "01.28",
    description: "冬天出生的人",
    icon: Cake,
    image: "/images/about-me/birthday.jpg",
    className: "",
  },
  {
    label: "性格",
    title: "ESFJ",
    description: "执行官一枚",
    icon: Sparkles,
    image: "/images/about-me/esfj.png",
    className: "",
  },
  {
    label: "星座",
    title: "双鱼座",
    description: "属于水象星座",
    icon: Star,
    image: "/images/about-me/Pisces.jpg",
    className: "",
  },
  {
    label: "身份",
    title: "党员",
    description: "永远相信中华人民共和国",
    icon: BadgeCheck,
    image: "/images/about-me/Party-member.jpg",
    className: "",
  },
];

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">{label}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
    </div>
  );
}

function PhotoBackdrop({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 870px" className="object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/38 to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.22),transparent_32%)] dark:hidden" />
    </>
  );
}

function PhotoPanel({ label, title, description, icon: Icon, image, className = "" }: { label: string; title: string; description: string; icon: LucideIcon; image: string; className?: string }) {
  return (
    <article className={`group relative min-h-[215px] overflow-hidden rounded-[1.35rem] bg-neutral-100 shadow-[0_1px_18px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 ${className}`}>
      <PhotoBackdrop src={image} alt={`${title}背景照片`} />
      <div className="relative flex h-full min-h-[215px] flex-col justify-between p-6 text-white">
        <div className="flex items-center justify-between gap-4 text-sm font-medium text-white/80">
          <span>{label}</span>
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-3xl font-semibold leading-tight tracking-tight">{title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/78">{description}</p>
        </div>
      </div>
    </article>
  );
}

export function ProfileSection() {
  return (
    <section className="space-y-4">
      <SectionHeading label="Profile" title="关于我" />
      <div className="grid gap-4 md:grid-cols-3">
        {profileFacts.map((fact) => (
          <PhotoPanel key={fact.label} label={fact.label} title={fact.title} description={fact.description} icon={fact.icon} image={fact.image} className={fact.className} />
        ))}
      </div>
    </section>
  );
}
