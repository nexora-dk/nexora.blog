// 收藏分组组件负责展示某一类收藏站点。
import { CollectionSection } from "@/components/pages/collection/collection-section";
// 收藏数据按分组维护，页面通过遍历数据生成内容。
import { collectionGroups } from "@/components/pages/collection/collection-data";
// PageShell 提供统一页面标题、描述和宽度容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 收藏夹页面：按分组展示作者收藏的工具、网站或资源。
 */
export default function CollectionPage() {
  return (
    // 页面壳定义当前页面标题和简介。
    <PageShell title="收藏夹" description="我收藏的一些宝藏网站">
      {/* 主体区域设置顶部留白和分组间距。 */}
      <div className="space-y-16 pt-8 md:space-y-20">
        {/* 遍历收藏分组，每组交给 CollectionSection 渲染。 */}
        {collectionGroups.map((group) => (
          // 使用分组标题作为 key，因为标题在收藏分组中应保持唯一。
          <CollectionSection key={group.title} group={group} />
        ))}
      </div>
    </PageShell>
  );
}
