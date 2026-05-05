import { CollectionSection } from "@/components/pages/collection/collection-section";
import { collectionGroups } from "@/components/pages/collection/collection-data";
import { PageShell } from "@/components/ui/page-shell";

export default function CollectionPage() {
  return (
    <PageShell title="收藏夹" description="我收藏的一些宝藏网站">
      <div className="space-y-16 pt-8 md:space-y-20">
        {collectionGroups.map((group) => (
          <CollectionSection key={group.title} group={group} />
        ))}
      </div>
    </PageShell>
  );
}
