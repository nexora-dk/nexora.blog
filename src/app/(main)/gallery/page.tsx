// 相册页面主体组件，负责渲染精选图片和图片分组。
import { GalleryContent } from "@/components/pages/gallery/gallery-content";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 相册页面：展示作者收藏的风景、光影和生活瞬间。
 */
export default function GalleryPage() {
  return (
    // 页面壳定义相册页标题和介绍。
    <PageShell title="相册" description="收藏一些风景、光影和路上遇见的瞬间。">
      {/* 相册内容组件内部负责渲染图片、精选区域和布局细节。 */}
      <GalleryContent />
    </PageShell>
  );
}
