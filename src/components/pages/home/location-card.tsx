import { MapPin } from "lucide-react";

import { FOSHAN } from "./location-data";
import { LocationGlobeCanvas } from "./location-globe-canvas";

export function LocationCard() {
  return (
    <div className="relative h-[222px] shrink-0 overflow-hidden rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30">
      <div className="relative z-10 flex items-center gap-3 text-base font-semibold tracking-tight">
        <MapPin className="size-5" />
        {FOSHAN.name}
      </div>

      <div className="absolute inset-x-7 bottom-0 h-[156px] overflow-hidden">
        <div className="absolute left-1/2 top-0 size-[312px] -translate-x-1/2">
          <LocationGlobeCanvas />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-neutral-950 dark:via-neutral-950/70" />
    </div>
  );
}
