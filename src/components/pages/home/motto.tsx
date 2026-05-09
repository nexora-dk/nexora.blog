"use client";

import { useEffect, useRef, useState } from "react";

// 英文座右铭作为打字机效果的完整文本来源。
const ENGLISH_MOTTO = "Today's “Hello World” is tomorrow's change the world.";

// 渲染首页底部座右铭区块，并在滚动进入视口后启动一次打字动画。
export function Motto() {
  // typedText 保存当前已经打出的英文片段，会随定时器逐步增长。
  const [typedText, setTypedText] = useState("");
  // sectionRef 用来把 IntersectionObserver 绑定到整个区块。
  const sectionRef = useRef<HTMLElement>(null);
  // hasStartedRef 防止重复进入视口时再次启动打字动画。
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    // timer 保存在 effect 作用域中，方便卸载时清理 setInterval。
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 未进入视口或动画已经启动过时，直接退出保持一次性效果。
        if (!entry.isIntersecting || hasStartedRef.current) {
          return;
        }

        hasStartedRef.current = true;
        let index = 0;
        // 每 55ms 多截取一个字符，形成逐字打印的视觉效果。
        timer = window.setInterval(() => {
          index += 1;
          setTypedText(ENGLISH_MOTTO.slice(0, index));

          // 打完整句后停止计时器，避免继续触发无意义的状态更新。
          if (index >= ENGLISH_MOTTO.length && timer) {
            window.clearInterval(timer);
          }
        }, 55);
        observer.disconnect();
      },
      // threshold 控制区块露出约三分之一时才开始动画。
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => {
      // 组件卸载时同时清理观察器和计时器，避免后台回调访问已卸载组件。
      observer.disconnect();

      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-neutral-200 pt-14 text-center dark:border-neutral-800">
      {/* blockquote 包裹整段座右铭语义，group 用于驱动内部悬停动效。 */}
      <blockquote className="group relative mx-auto max-w-2xl transition duration-500 hover:-translate-y-1">
        {/* 背景光晕只承担装饰作用，悬停时增强氛围。 */}
        <span className="pointer-events-none absolute left-1/2 top-12 -z-10 size-40 -translate-x-1/2 rounded-full bg-sky-300/0 blur-3xl transition duration-500 group-hover:bg-sky-300/20 dark:group-hover:bg-sky-500/10" />
        {/* 代码胶囊呼应 Hello World 主题，并用脉冲竖线模拟终端光标。 */}
        <code className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3.5 py-1.5 font-mono text-xs text-neutral-500 shadow-sm backdrop-blur transition group-hover:border-sky-200 group-hover:text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:group-hover:border-sky-900 dark:group-hover:text-neutral-300">
          <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_theme(colors.cyan.400)]" />
          console.log(&quot;Hello World&quot;)
          <span className="ml-0.5 h-3 w-px animate-pulse bg-cyan-400" aria-hidden="true" />
        </code>
        {/* 中文主句使用渐变文字强调两段关键词。 */}
        <p className="mt-6 font-[family-name:var(--font-dingtalk)] text-balance text-xl font-semibold leading-relaxed tracking-tight text-neutral-900 md:text-2xl dark:text-neutral-100">
          今天的
          <span className="bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#2563eb,#22d3ee)] bg-[length:200%_100%] bg-clip-text text-transparent transition-[background-position] duration-700 group-hover:bg-[position:100%_0]">
            “世界你好”
          </span>
          ，就是明天的
          <span className="bg-[linear-gradient(90deg,#22d3ee,#0ea5e9,#2563eb,#22d3ee)] bg-[length:200%_100%] bg-clip-text text-transparent transition-[background-position] duration-700 group-hover:bg-[position:100%_0]">
            “改变世界”
          </span>
          。
        </p>
        {/* 英文副句展示打字机状态，aria-label 保留完整句子给辅助技术。 */}
        <p className="mt-3 min-h-7 text-sm leading-7 text-neutral-400 transition group-hover:text-neutral-500 dark:text-neutral-500 dark:group-hover:text-neutral-400" aria-label={ENGLISH_MOTTO}>
          <span>{typedText}</span>
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-[pulse_1s_steps(1,end)_infinite] bg-current" aria-hidden="true" />
        </p>
        {/* 底部渐变线作为收束装饰，悬停时变长。 */}
        <span className="mx-auto mt-7 block h-px w-28 bg-gradient-to-r from-transparent via-sky-400 to-transparent transition-all duration-500 group-hover:w-40 dark:via-sky-700" />
      </blockquote>
    </section>
  );
}
