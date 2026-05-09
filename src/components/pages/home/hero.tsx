"use client";

import { useEffect, useState, type PointerEvent } from "react";
import Image from "next/image";

// 首页滚动展示的兴趣/内容方向文案。
const TEXTS = [
  {
    text: "记录生活的照片",
    className: "bg-gradient-to-r from-[#0077ff] to-[#00e7df] bg-clip-text text-center text-transparent",
  },
  {
    text: "随性记录的手记",
    className: "bg-gradient-to-r from-[#7f00de] to-[#ff007f] bg-clip-text text-center text-transparent",
  },
  {
    text: "私藏已久的好物",
    className: "bg-gradient-to-r from-[#ffc900] to-[#ff1835] bg-clip-text text-transparent",
  },
  {
    text: "奇妙的代码世界",
    className: "bg-gradient-to-r from-[#00e7df] to-[#0077ff] bg-clip-text text-transparent",
  },
  {
    text: "鲜活的生活切片",
    className: "bg-gradient-to-r from-[#2ecc70] to-[#1ca085] bg-clip-text text-center text-transparent",
  },
];

// SPEED 控制滚动文案切换间隔，单位为秒。
const SPEED = 2;
// 文案行高类名被容器和每一行复用，保证 translateY 计算与实际高度一致。
const LINE_HEIGHT_CLASS = "h-[30px] leading-[30px] sm:h-[40px] sm:leading-[40px]";
// 复制第一项到末尾，用于滚动到最后后无缝回到开头。
const LOOP_TEXTS = [...TEXTS, TEXTS[0]];

// 首页首屏 Hero 组件，包含自我介绍、循环滚动文案和桌面端头像 3D 倾斜交互。
function Hero() {
  // currentIndex 表示当前滚动到第几行文案，会直接参与 translateY 计算。
  const [currentIndex, setCurrentIndex] = useState(0);
  // isResetting 用于无缝回环瞬间关闭过渡动画，避免用户看到反向滚动。
  const [isResetting, setIsResetting] = useState(false);
  // tilt 保存头像根据鼠标位置计算出的 X/Y 旋转角度。
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    // 每隔 SPEED 秒切换到下一行滚动文案。
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, SPEED * 1000);

    // 组件卸载时清理定时器，避免继续更新状态。
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    // 只有滚动到复制出来的首项时才执行无缝重置。
    if (currentIndex !== TEXTS.length) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      // 到达复制的首项后，关闭动画并瞬间重置回真正的第一项。
      setIsResetting(true);
      setCurrentIndex(0);

      // 连续两帧后再恢复 transition，确保浏览器已经应用了无动画的归零状态。
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsResetting(false));
      });
    }, 500);

    return () => window.clearTimeout(resetTimer);
  }, [currentIndex]);

  function handleAvatarPointerMove(event: PointerEvent<HTMLDivElement>) {
    // 根据鼠标在头像区域的位置计算硬币式 3D 倾斜角度。
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      // y 越靠下 rotateX 越负，让头像朝鼠标方向倾斜。
      rotateX: y * -24,
      // x 越靠右 rotateY 越正，形成左右跟随的立体感。
      rotateY: x * 24,
    });
  }

  function resetAvatarTilt() {
    // 鼠标离开后让头像回到正面。
    setTilt({ rotateX: 0, rotateY: 0 });
  }

  return (
    <section className="pt-37 mb-37 space-y-2">
      {/* 首屏主体左右布局：左侧文案，右侧桌面端头像。 */}
      <div className="flex justify-between gap-6">
        <div className="flex flex-col gap-2">
          {/* 主标题拆成两行，方便签名图片和滚动词条混排。 */}
          <h1 className="flex flex-col flex-wrap font-[family-name:var(--font-dingtalk)] text-xl  sm:text-3xl">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>我是</span>
              <Image src="/images/signature/signature.svg" alt="Nexora" width={142} height={52} priority className="h-[21px] w-auto dark:invert sm:h-[31px]" />
              <span>，一个爱捣鼓的前端</span>
            </span>
            <span className="flex flex-wrap gap-1 leading-[30px] sm:leading-[40px]">
              <span className="pt-4 ">在这里分享</span>
              {/* 固定高度的视窗隐藏溢出内容，只露出当前滚动到的一行。 */}
              <span className={`relative inline-block translate-y-4 overflow-hidden align-bottom [--hero-line-height:30px] sm:[--hero-line-height:40px] ${LINE_HEIGHT_CLASS}`}>
                <span
                  className={`flex flex-col ${isResetting ? "transition-none" : "transition-transform duration-500 ease-out"}`}
                  style={{ transform: `translateY(calc(-${currentIndex} * var(--hero-line-height)))` }}
                >
                  {LOOP_TEXTS.map((item, index) => (
                    // 循环渲染每条滚动文案，index 参与 key 以区分首尾重复项。
                    <span key={`${item.text}-${index}`} className={`block whitespace-nowrap ${LINE_HEIGHT_CLASS} ${item.className}`}>
                      {item.text}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h1>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">广东 • UTC/GMT +8</div>
        </div>

        {/* 头像交互只在 md 以上显示，外层 perspective 提供 3D 透视。 */}
        <div className="relative mt-3 mr-5 hidden size-28 [perspective:700px] md:block">
          <div
            className="group relative size-28 transition-transform duration-200 ease-out [transform-style:preserve-3d]"
            style={{ transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.rotateX || tilt.rotateY ? 1.06 : 1})` }}
            onPointerMove={handleAvatarPointerMove}
            onPointerLeave={resetAvatarTilt}
          >
            {/* Hi 标签放在头像前方的 Z 轴位置，强化卡片层次。 */}
            <div className="absolute left-0 top-0 z-10 flex h-7 items-center justify-center rounded-full bg-white/45 px-2.5 text-sm font-medium text-neutral-900 shadow-sm backdrop-blur-[10px] [transform:translateZ(22px)] dark:bg-white/20 dark:text-white">
              Hi
            </div>
            <Image
              src="/images/avatar/avatar.jpg"
              alt="nexora"
              width={98}
              height={98}
              priority
              className="size-25 rounded-full object-cover shadow-lg [transform:translateZ(18px)]"
            />
            {/* 模糊渐变光影放在头像后方，作为悬浮头像的背景氛围。 */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tl from-purple-700 to-orange-700 opacity-50 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
