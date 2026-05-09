import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Cake, GraduationCap, Sparkles, Star } from "lucide-react";

// 关于页个人资料卡片的数据源，每一项定义一张图片面板的内容和布局跨度。
const profileFacts = [
  {
    label: "专业",
    title: "计算机科学与技术",
    description: "和代码、系统、创造力打交道，也在慢慢建立自己的技术审美。",
    icon: GraduationCap,
    image: "/images/about-me/major.png",
    // className 允许单个卡片控制响应式网格跨度。
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

// 统一的区块标题组件，保持关于页各区块标题样式一致。
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">{label}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
    </div>
  );
}

// 图片背景层组件，负责填充照片、暗色渐变遮罩和浅色模式高光。
function PhotoBackdrop({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      {/* fill 图片铺满父级 article，悬停时轻微放大制造动态感。 */}
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 870px" className="object-cover transition duration-700 group-hover:scale-105" />
      {/* 黑色渐变遮罩保证白色文字在不同照片上都有足够对比度。 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/38 to-black/10" />
      {/* 浅色模式下额外叠加径向高光，暗色模式隐藏避免过亮。 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.22),transparent_32%)] dark:hidden" />
    </>
  );
}

// 单张资料照片面板，组合背景图、标签、图标、标题和描述。
function PhotoPanel({ label, title, description, icon: Icon, image, className = "" }: { label: string; title: string; description: string; icon: LucideIcon; image: string; className?: string }) {
  return (
    <article className={`group relative min-h-[215px] overflow-hidden rounded-[1.35rem] bg-neutral-100 shadow-[0_1px_18px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 ${className}`}>
      <PhotoBackdrop src={image} alt={`${title}背景照片`} />
      {/* 内容层使用 relative 覆盖在背景图上，并上下分布标签区和正文区。 */}
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

// 关于页“关于我”资料区块，按 profileFacts 循环输出照片信息卡片。
export function ProfileSection() {
  return (
    <section className="space-y-4">
      <SectionHeading label="Profile" title="关于我" />
      {/* 三列响应式网格承载资料卡，部分卡片可通过 className 跨列。 */}
      <div className="grid gap-4 md:grid-cols-3">
        {profileFacts.map((fact) => (
          // 使用 label 作为 key，因为每个资料维度在当前数据集中唯一。
          <PhotoPanel key={fact.label} label={fact.label} title={fact.title} description={fact.description} icon={fact.icon} image={fact.image} className={fact.className} />
        ))}
      </div>
    </section>
  );
}
