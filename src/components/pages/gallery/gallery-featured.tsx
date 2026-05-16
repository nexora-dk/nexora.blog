import { Camera, MapPin } from "lucide-react";

import type { GalleryPhoto } from "./gallery-data";
import { GalleryFillImage } from "./gallery-image";

// GalleryFeaturedProps 约束精选区域只接收一张 GalleryPhoto。
type GalleryFeaturedProps = {
  photo: GalleryPhoto;
};

// GalleryFeatured 负责渲染相册页顶部的大幅精选照片和覆盖文案。
export function GalleryFeatured({ photo }: GalleryFeaturedProps) {
  return (
    <section className="group relative overflow-hidden rounded-[1.35rem] bg-neutral-100 shadow-[0_1px_18px_rgba(0,0,0,0.05)] dark:bg-neutral-900">
      {/* 图片容器提供固定最小高度，内部 Image 使用 fill 铺满区域。 */}
      <div className="relative min-h-[340px] md:min-h-[430px]">
        <GalleryFillImage src={photo.imageSrc} alt={photo.alt} priority sizes="(max-width: 768px) 100vw, 870px" className="object-cover transition duration-700 group-hover:scale-105" />
        {/* 渐变遮罩提升白色文字在照片上的可读性。 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* 覆盖内容层纵向分布：顶部标签，底部标题和地点。 */}
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
