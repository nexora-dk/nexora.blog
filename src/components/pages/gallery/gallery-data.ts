export type GalleryPhoto = {
  id?: number;
  imageSrc: string;
  alt: string;
  title: string;
  location: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  sortOrder?: number;
};

export const featuredPhoto: GalleryPhoto = {
  imageSrc: "/images/about-me/photography.jpg",
  alt: "相册封面风景照",
  title: "路上的风景",
  location: "Somewhere",
  isFeatured: true,
  isVisible: true,
  sortOrder: 0,
};

export const galleryPhotos: GalleryPhoto[] = [
  { id: 1, imageSrc: "/images/about-me/photography.jpg", alt: "风景照片 1", title: "山野云层", location: "旅途中", isFeatured: true, isVisible: true, sortOrder: 0 },
  { id: 2, imageSrc: "/images/about-me/me-four.jpg", alt: "风景照片 2", title: "海边片刻", location: "海岸线", isVisible: true, sortOrder: 1 },
  { id: 3, imageSrc: "/images/about-me/badminton.jpg", alt: "风景照片 3", title: "场边黄昏", location: "草地", isVisible: true, sortOrder: 2 },
  { id: 4, imageSrc: "/images/about-me/Swimming.jpg", alt: "风景照片 4", title: "水面呼吸", location: "夏日", isVisible: true, sortOrder: 3 },
  { id: 5, imageSrc: "/images/about-me/music1.jpg", alt: "风景照片 5", title: "城市光影", location: "夜晚", isVisible: true, sortOrder: 4 },
  { id: 6, imageSrc: "/images/about-me/birthday.jpg", alt: "风景照片 6", title: "温柔瞬间", location: "冬天", isVisible: true, sortOrder: 5 },
  { id: 7, imageSrc: "/images/about-me/me-one.jpg", alt: "风景照片 7", title: "路过的人", location: "日常", isVisible: true, sortOrder: 6 },
  { id: 8, imageSrc: "/images/about-me/me-five.jpg", alt: "风景照片 8", title: "蓝天之下", location: "晴天", isVisible: true, sortOrder: 7 },
  { id: 9, imageSrc: "/images/about-me/Pisces.jpg", alt: "风景照片 9", title: "蓝色想象", location: "天空", isVisible: true, sortOrder: 8 },
  { id: 10, imageSrc: "/images/about-me/Strong.jpg", alt: "风景照片 10", title: "生活切片", location: "片刻", isVisible: true, sortOrder: 9 },
  { id: 11, imageSrc: "/images/about-me/esfj.png", alt: "风景照片 11", title: "有趣图像", location: "收藏", isVisible: true, sortOrder: 10 },
  { id: 12, imageSrc: "/images/about-me/Party-member.jpg", alt: "风景照片 12", title: "记忆一角", location: "记录", isVisible: true, sortOrder: 11 },
];
