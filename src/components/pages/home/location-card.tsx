import { MapPin } from "lucide-react";

import { FOSHAN } from "./location-data";
import { LocationGlobeCanvas } from "./location-globe-canvas";

// 首页关于我区域中的位置卡片，展示当前城市并嵌入可交互地球画布。
export function LocationCard() {
  return (
    <div className="relative h-[222px] shrink-0 overflow-hidden rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30">
      {/* 标题层级提高到 z-10，避免被下方绝对定位的地球画布遮挡。 */}
      <div className="relative z-10 flex items-center gap-3 text-base font-semibold tracking-tight">
        <MapPin className="size-5" />
        {FOSHAN.name}
      </div>

      {/* 画布容器固定在卡片底部，只露出地球上半部分形成“从卡片中升起”的效果。 */}
      <div className="absolute inset-x-7 bottom-0 h-[156px] overflow-hidden">
        <div className="absolute left-1/2 top-0 size-[312px] -translate-x-1/2">
          <LocationGlobeCanvas />
        </div>
      </div>

      {/* 底部渐变遮罩压住球体下缘，让卡片边界更柔和。 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-neutral-950 dark:via-neutral-950/70" />
    </div>
  );
}
