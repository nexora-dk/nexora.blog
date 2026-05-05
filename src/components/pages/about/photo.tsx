import Image from "next/image";

const personalPhotos = [
  { src: "/images/about-me/me-two.png", alt: "个人照片 1", className: "left-[4%] top-[12%] w-[35%] -rotate-6 md:left-[10%] md:top-[18%] md:w-[24%]" },
  { src: "/images/about-me/me-four.jpg", alt: "个人照片 2", className: "right-[4%] top-[4%] w-[42%] rotate-3 md:left-[30%] md:top-[4%] md:w-[27%]" },
  { src: "/images/about-me/me-three.jpg", alt: "个人照片 3", className: "bottom-[8%] left-[20%] w-[38%] rotate-2 md:left-[50%] md:bottom-[12%] md:w-[24%]" },
  { src: "/images/about-me/me-six.jpg", alt: "个人照片 4", className: "bottom-[18%] right-[5%] w-[32%] -rotate-3 md:right-[8%] md:top-[20%] md:w-[22%]" },
];

export function PhotoSection() {
  return (
    <section className="relative h-[360px] overflow-hidden rounded-[1.35rem] md:h-[430px]">
      {personalPhotos.map((photo, index) => (
        <div key={photo.alt} className={`group absolute aspect-square overflow-hidden rounded-[1.25rem] border-6 border-neutral-200 bg-neutral-100 shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition duration-300 hover:z-10 hover:-translate-y-2 dark:border-neutral-800 dark:bg-neutral-900 ${photo.className}`} style={{ zIndex: index + 1 }}>
          <Image src={photo.src} alt={photo.alt} fill priority={index === 0} sizes="(max-width: 768px) 42vw, 240px" className="object-cover transition duration-700 group-hover:scale-105" />
        </div>
      ))}
    </section>
  );
}
