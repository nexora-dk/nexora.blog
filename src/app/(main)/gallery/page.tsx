import Image from "next/image";
import { Camera, MapPin } from "lucide-react";

import badmintonPhoto from "../../../../public/images/about-me/badminton.jpg";
import birthdayPhoto from "../../../../public/images/about-me/birthday.jpg";
import esfjPhoto from "../../../../public/images/about-me/esfj.png";
import meFivePhoto from "../../../../public/images/about-me/me-five.jpg";
import meFourPhoto from "../../../../public/images/about-me/me-four.jpg";
import meOnePhoto from "../../../../public/images/about-me/me-one.jpg";
import musicPhoto from "../../../../public/images/about-me/music1.jpg";
import partyMemberPhoto from "../../../../public/images/about-me/Party-member.jpg";
import photographyPhoto from "../../../../public/images/about-me/photography.jpg";
import piscesPhoto from "../../../../public/images/about-me/Pisces.jpg";
import strongPhoto from "../../../../public/images/about-me/Strong.jpg";
import swimmingPhoto from "../../../../public/images/about-me/Swimming.jpg";
import { GalleryLightbox } from "@/components/pages/gallery/gallery-lightbox";
import { PageShell } from "@/components/ui/page-shell";

const featuredPhoto = {
  image: photographyPhoto,
  alt: "相册封面风景照",
  title: "路上的风景",
  location: "Somewhere",
};

const galleryPhotos = [
  { image: photographyPhoto, alt: "风景照片 1", title: "山野云层", location: "旅途中" },
  { image: meFourPhoto, alt: "风景照片 2", title: "海边片刻", location: "海岸线" },
  { image: badmintonPhoto, alt: "风景照片 3", title: "场边黄昏", location: "草地" },
  { image: swimmingPhoto, alt: "风景照片 4", title: "水面呼吸", location: "夏日" },
  { image: musicPhoto, alt: "风景照片 5", title: "城市光影", location: "夜晚" },
  { image: birthdayPhoto, alt: "风景照片 6", title: "温柔瞬间", location: "冬天" },
  { image: meOnePhoto, alt: "风景照片 7", title: "路过的人", location: "日常" },
  { image: meFivePhoto, alt: "风景照片 8", title: "蓝天之下", location: "晴天" },
  { image: piscesPhoto, alt: "风景照片 9", title: "蓝色想象", location: "天空" },
  { image: strongPhoto, alt: "风景照片 10", title: "生活切片", location: "片刻" },
  { image: esfjPhoto, alt: "风景照片 11", title: "有趣图像", location: "收藏" },
  { image: partyMemberPhoto, alt: "风景照片 12", title: "记忆一角", location: "记录" },
];

export default function GalleryPage() {
  return (
    <PageShell title="相册" description="收藏一些风景、光影和路上遇见的瞬间。">
      <div className="space-y-6">
        <section className="group relative overflow-hidden rounded-[1.35rem] bg-neutral-100 shadow-[0_1px_18px_rgba(0,0,0,0.05)] dark:bg-neutral-900">
          <div className="relative min-h-[340px] md:min-h-[430px]">
            <Image src={featuredPhoto.image} alt={featuredPhoto.alt} fill priority sizes="(max-width: 768px) 100vw, 870px" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative flex min-h-[340px] flex-col justify-between p-7 text-white md:min-h-[430px] md:p-9">
              <div className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
                <Camera className="size-3.5" />
                Featured
              </div>
              <div>
                <p className="font-serif text-sm italic text-white/75">landscape collection</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">{featuredPhoto.title}</h2>
                <div className="mt-5 flex items-center gap-2 text-sm text-white/75">
                  <MapPin className="size-4" />
                  {featuredPhoto.location}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">Gallery</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">风景记录</h2>
          </div>
          <GalleryLightbox photos={galleryPhotos} />
        </section>
      </div>
    </PageShell>
  );
}
