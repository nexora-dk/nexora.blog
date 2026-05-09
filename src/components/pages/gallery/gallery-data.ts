import type { StaticImageData } from "next/image";

// 这些静态图片导入会被 Next.js 处理成 StaticImageData，供 Image 组件直接使用。
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

// GalleryPhoto 描述相册中一张图片的展示数据。
export type GalleryPhoto = {
  // image 是静态导入后的图片对象。
  image: StaticImageData;
  // alt 提供图片无障碍替代文本，也用于瀑布流按钮 key。
  alt: string;
  // title 是图片标题，会在封面、悬浮层和灯箱底部展示。
  title: string;
  // location 是地点或场景文案，会搭配定位图标展示。
  location: string;
};

// featuredPhoto 是相册页顶部精选大图的数据源。
export const featuredPhoto: GalleryPhoto = {
  image: photographyPhoto,
  alt: "相册封面风景照",
  title: "路上的风景",
  location: "Somewhere",
};

// galleryPhotos 是灯箱瀑布流的数据源，GalleryLightbox 会按顺序循环渲染。
export const galleryPhotos: GalleryPhoto[] = [
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
