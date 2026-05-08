export function ReadmeSections() {
  return (
    <article className="max-w-[52rem] space-y-16 text-zinc-700 dark:text-neutral-200">
      <section id="intro" className="scroll-mt-28 space-y-7 pt-8">
        <h1 className="-mt-4 font-[family-name:var(--font-dingtalk)] text-4xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50 md:text-5xl">自述</h1>
        <div className="space-y-5 text-[1.05rem] font-medium leading-9">
          <p>
            你好，我是 <span className="font-semibold text-zinc-950 dark:text-neutral-50">Nexora</span>。
          </p>
          <p>
            02 年出生，拥有 187cm 的海拔，但在数字世界里，我更喜欢把自己定义为一个“游走在代码与设计边缘的创作者”。目前，我正深耕于前端生态与 Node.js 领域，怀揣着成为一名优秀全栈工程师的渴望，不断打磨着自己的技术栈。
          </p>
        </div>
      </section>

      <section id="interests" className="relative scroll-mt-28 space-y-6 border-l border-zinc-200/70 pl-6 dark:border-white/10">
        <span className="absolute -left-[5px] top-3 size-2.5 rounded-full bg-sky-400 ring-4 ring-white dark:ring-neutral-950" />
        <h2 className="font-[family-name:var(--font-dingtalk)] text-3xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50">兴趣爱好</h2>
        <p className="text-[1.05rem] font-medium leading-9">
          离开屏幕前的 0 和 1，我是一个性格开朗、喜欢交朋友的乐天派。写代码之余，我靠音乐续命，用镜头写日记；我喜欢在社交中碰撞灵感，也享受在羽毛球场上尽情挥洒汗水，或是偶尔去健身房举铁释放多巴胺。
        </p>
      </section>

      <section id="status" className="relative scroll-mt-28 space-y-6 border-l border-zinc-200/70 pl-6 dark:border-white/10">
        <span className="absolute -left-[5px] top-3 size-2.5 rounded-full bg-sky-400 ring-4 ring-white dark:ring-neutral-950" />
        <h2 className="font-[family-name:var(--font-dingtalk)] text-3xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50">目前状况</h2>
        <ul className="space-y-3 text-[1.02rem] font-medium leading-8 text-zinc-700 dark:text-neutral-200">
          <li className="flex gap-3">
            <span className="mt-3 size-1.5 rounded-full bg-zinc-400 dark:bg-neutral-500" />
            <span>正在学习并深耕前端生态，包括 React、Next.js、Tailwind CSS 等工程化与体验相关的内容。</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-3 size-1.5 rounded-full bg-zinc-400 dark:bg-neutral-500" />
            <span>同时持续接触 Node.js，希望把前后端能力串联起来，逐步成为更完整的全栈工程师。</span>
          </li>
        </ul>
      </section>

      <section id="future" className="relative scroll-mt-28 space-y-6 border-l border-zinc-200/70 pb-12 pl-6 dark:border-white/10">
        <span className="absolute -left-[5px] top-3 size-2.5 rounded-full bg-sky-400 ring-4 ring-white dark:ring-neutral-950" />
        <h2 className="font-[family-name:var(--font-dingtalk)] text-3xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50">展望未来</h2>
        <p className="text-[1.05rem] font-medium leading-9">
          我相信，好的代码和好身体一样，都需要持续的锻炼与雕刻。欢迎来到我的数字自留地，期待在这里与同频的你相遇！
        </p>
      </section>
    </article>
  );
}
