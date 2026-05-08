import Image from "next/image";
import { Camera, MapPin } from "lucide-react";

import type { GalleryPhoto } from "./gallery-data";

type GalleryFeaturedProps = {
  photo: GalleryPhoto;
};

export function GalleryFeatured({ photo }: GalleryFeaturedProps) {
  return (
    <section className="group relative overflow-hidden rounded-[1.35rem] bg-neutral-100 shadow-[0_1px_18px_rgba(0,0,0,0.05)] dark:bg-neutral-900">
      <div className="relative min-h-[340px] md:min-h-[430px]">
        <Image src={photo.image} alt={photo.alt} fill priority sizes="(max-width: 768px) 100vw, 870px" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative flex min-h-[340px] flex-col justify-between p-7 text-white md:min-h-[430px] md:p-9">
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
            <Camera className="size-3.5" />
            Featured
          </div>
          <div>
            <p className="font-serif text-sm italic text-white/75">landscape collection</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">{photo.title}</h2>
            <div className="mt-5 flex items-center gap-2 text-sm text-white/75">
              <MapPin className="size-4" />
              {photo.location}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
