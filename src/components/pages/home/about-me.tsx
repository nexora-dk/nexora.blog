import Link from "next/link";
import { Clock3, Heart } from "lucide-react";
import { ContactMe } from "./contact-me";
import { LearningDays } from "./learning-days";
import { LocationCard } from "./location-card";
import { StacksCard } from "./stacks-card";
import { SiNextdotjs} from "@icons-pack/react-simple-icons"

// 首页复用的区块标题组件，用于生成带背景幽灵字的标题样式。
function SectionTitle({ label, title, ghost }: { label: string; title: string; ghost: string }) {
  return (
    <div className="relative mx-auto w-fit px-10 py-4 text-center">
      {/* 背景英文大字只承担装饰作用，使用 -z-10 放到标题后方。 */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-6xl font-black uppercase tracking-tight text-neutral-100 dark:text-neutral-900/80">
        {ghost}
      </span>
      {/* 倾斜椭圆边框给标题增加手写标注感。 */}
      <span className="absolute left-1/2 top-1/2 -z-10 h-14 w-48 -translate-x-1/2 -translate-y-1/2 -rotate-[-8deg] rounded-[50%] border border-neutral-300 dark:border-neutral-800" />
      <p className="font-serif text-sm italic leading-none text-neutral-500 dark:text-neutral-400">{label}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}

// 首页“关于我”摘要区块，把位置、技术栈、联系方式、学习天数和常用框架组合成卡片网格。
export function AboutMe() {
  return (
    <section className="space-y-10">
      <SectionTitle label="about me" title="关于我" ghost="about" />
      {/* 外层网格限制最大宽度，小屏单列，大于 450px 后左右两列排布。 */}
      <div className="mx-auto grid max-w-[778px] gap-4 min-[450px]:h-[460px] min-[450px]:grid-cols-2">
        {/* 左列放位置卡片和技术栈卡片，形成信息 + 技能的组合。 */}
        <div className="flex flex-col gap-4 min-[450px]:h-full">
          <LocationCard />

          <StacksCard />
        </div>

        {/* 右列放联系方式以及两个小统计卡片。 */}
        <div className="flex flex-col gap-4 min-[450px]:h-full">
          <ContactMe />

          {/* 下方网格承载“学习前端”和“常用框架”两张等高卡片。 */}
          <div className="grid min-h-0 flex-1 gap-4 min-[450px]:grid-cols-2">
            <div className="h-full rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30">
              <div className="flex items-center gap-3 text-base font-semibold tracking-tight">
                <Clock3 className="size-5" />
                学习前端
              </div>
              {/* LearningDays 只输出数字，这里补充单位组成完整文案。 */}
              <p className="mt-14 ml-5 text-3xl font-bold tracking-tight">
                <LearningDays /> 天
              </p>
            </div>

            <div className="h-full rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30">
              <div className="flex items-center gap-3 text-base font-semibold tracking-tight">
                <Heart className="size-5" />
                常用框架
              </div>
              {/* 居中展示 Next.js 图标，作为常用框架的视觉表达。 */}
              <div className="mt-11 flex justify-center">
                <SiNextdotjs className="size-20"></SiNextdotjs>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 区块底部按钮，连接到更完整的关于页。 */}
      <div className="flex justify-center">
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 py-1.5 pl-5 pr-1.5 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/55 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-50"
        >
          进一步了解我
          <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-xs text-white transition group-hover:translate-x-0.5 dark:bg-neutral-50 dark:text-neutral-950" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
