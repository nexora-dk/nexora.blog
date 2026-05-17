"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { KanbanSplineScene } from "./kanban-spline-scene";

const copyMessage = "你都复制了些什么呀，转载要记得加上出处哦！";
const robotGreetingMessage = "你好！我是 aui，很高兴遇见你哟～";

const routeMessages: Array<[string, string]> = [
  ["/friends", "这里有主人的朋友们哦！"],
  ["/writing", "这里收藏着主人认真写下的文稿哟！"],
  ["/notes", "这里是主人随手记录的生活碎片噢！"],
  ["/timeline", "这里能看到主人的时间轨迹哟！"],
  ["/thinking", "这里装着主人一些正在发酵的想法！"],
  ["/gallery", "这里有主人按下快门的瞬间！"],
  ["/collection", "这里是主人私藏的宝藏链接哟！"],
  ["/projects", "这里展示着主人做过的项目！"],
  ["/Comments", "这里可以给主人留下悄悄话哟！"],
  ["/Readme", "这里可以更了解主人一点！"],
  ["/Site", "这里记录着这个小站的来处！"],
  ["/Iteration", "这里能看到小站一路变好的痕迹！"],
  ["/Sponsor", "这里可以给主人的创作加点能量！"],
  ["/about", "这里藏着主人的自我介绍哟！"],
  ["/", "欢迎回到主人的首页！"],
];

const MESSAGE_VISIBLE_MS = 2600;

function getRouteMessage(pathname: string) {
  return routeMessages.find(([route]) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)))?.[1] ?? "页面切换完成，继续逛逛吧。";
}

export function KanbanGirlWidget() {
  const pathname = usePathname();
  const [message, setMessage] = useState(copyMessage);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const didMountRef = useRef(false);

  function showMessage(nextMessage: string) {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }

    setMessage(nextMessage);
    setIsMessageVisible(true);
    hideTimerRef.current = window.setTimeout(() => {
      setIsMessageVisible(false);
      hideTimerRef.current = null;
    }, MESSAGE_VISIBLE_MS);
  }

  useEffect(() => {
    function handleCopy() {
      showMessage(copyMessage);
    }

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);

      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    showMessage(getRouteMessage(pathname));
  }, [pathname]);

  return (
    <div className="fixed bottom-2 left-8 z-[90] hidden h-36 w-24 overflow-visible sm:block md:bottom-3 md:left-10 md:h-40 md:w-26">
      <button
        type="button"
        aria-label="显示机器人问候"
        onClick={() => showMessage(robotGreetingMessage)}
        className="pointer-events-auto absolute bottom-0 left-1/2 h-96 w-96 origin-bottom -translate-x-1/2 scale-[0.42] overflow-visible outline-none md:scale-[0.46]"
      >
        <KanbanSplineScene />
      </button>

      <div
        className={`pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-1/2 w-52 -translate-x-1/2 rounded-3xl border border-neutral-200/80 bg-white/85 px-4 py-3 text-sm font-medium leading-6 text-neutral-700 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-neutral-950/78 dark:text-neutral-200 ${isMessageVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      >
        {message}
        <span className="absolute bottom-[-0.35rem] left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-neutral-200/80 bg-white/85 dark:border-white/10 dark:bg-neutral-950/78" />
      </div>
    </div>
  );
}
