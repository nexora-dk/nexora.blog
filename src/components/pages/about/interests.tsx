import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Activity, Camera, Dumbbell, Headphones, Waves } from "lucide-react";

const interests = [
  {
    label: "音乐",
    title: "听音乐",
    description: "失去音乐我该怎么活",
    icon: Headphones,
    image: "/images/about-me/music1.jpg",
    className: "md:col-span-2",
  },
  {
    label: "运动",
    title: "羽毛球",
    description: "几天不打手就特别痒",
    icon: Activity,
    image: "/images/about-me/badminton.jpg",
    className: "",
  },
  {
    label: "运动",
    title: "健身",
    description: "业余爱好者",
    icon: Dumbbell,
    image: "/images/about-me/Strong.jpg",
    className: "",
  },
  {
    label: "运动",
    title: "游泳",
    description: "游泳太爽了，但是也特别累",
    icon: Waves,
    image: "/images/about-me/Swimming.jpg",
    className: "",
  },
  {
    label: "记录",
    title: "摄影",
    description: "喜欢捕捉生活的美好",
    icon: Camera,
    image: "/images/about-me/photography.jpg",
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

export function InterestsSection() {
  return (
    <section className="space-y-4">
      <SectionHeading label="Interests" title="生活里的热爱" />
      <div className="grid gap-4 md:grid-cols-3">
        {interests.map((interest) => (
          <PhotoPanel key={interest.title} label={interest.label} title={interest.title} description={interest.description} icon={interest.icon} image={interest.image} className={interest.className} />
        ))}
      </div>
    </section>
  );
}
