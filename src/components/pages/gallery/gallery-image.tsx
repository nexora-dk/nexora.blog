/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

type GalleryImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function GalleryFillImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: GalleryImageProps) {
  if (isRemoteImage(src)) {
    return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
