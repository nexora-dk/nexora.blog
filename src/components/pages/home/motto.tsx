"use client";

import { useEffect, useRef, useState } from "react";

const ENGLISH_MOTTO = "Today's “Hello World” is tomorrow's change the world.";

export function Motto() {
  const [typedText, setTypedText] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStartedRef.current) {
          return;
        }

        hasStartedRef.current = true;
        let index = 0;
        timer = window.setInterval(() => {
          index += 1;
          setTypedText(ENGLISH_MOTTO.slice(0, index));

          if (index >= ENGLISH_MOTTO.length && timer) {
            window.clearInterval(timer);
          }
        }, 55);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();

      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-neutral-200 pt-14 text-center dark:border-neutral-800">
      <blockquote className="group relative mx-auto max-w-2xl transition duration-500 hover:-translate-y-1">
        <span className="pointer-events-none absolute left-1/2 top-12 -z-10 size-40 -translate-x-1/2 rounded-full bg-sky-300/0 blur-3xl transition duration-500 group-hover:bg-sky-300/20 dark:group-hover:bg-sky-500/10" />
        <code className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3.5 py-1.5 font-mono text-xs text-neutral-500 shadow-sm backdrop-blur transition group-hover:border-sky-200 group-hover:text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:group-hover:border-sky-900 dark:group-hover:text-neutral-300">
          <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_theme(colors.cyan.400)]" />
          console.log(&quot;Hello World&quot;)
          <span className="ml-0.5 h-3 w-px animate-pulse bg-cyan-400" aria-hidden="true" />
        </code>
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
        <p className="mt-3 min-h-7 text-sm leading-7 text-neutral-400 transition group-hover:text-neutral-500 dark:text-neutral-500 dark:group-hover:text-neutral-400" aria-label={ENGLISH_MOTTO}>
          <span>{typedText}</span>
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-[pulse_1s_steps(1,end)_infinite] bg-current" aria-hidden="true" />
        </p>
        <span className="mx-auto mt-7 block h-px w-28 bg-gradient-to-r from-transparent via-sky-400 to-transparent transition-all duration-500 group-hover:w-40 dark:via-sky-700" />
      </blockquote>
    </section>
  );
}
