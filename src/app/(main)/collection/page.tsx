import { CollectionSection } from "@/components/pages/collection/collection-section";
import { PageShell } from "@/components/ui/page-shell";
import { getCollectionGroups } from "@/db/queries/collection.query";

export default async function CollectionPage() {
  const collectionGroups = await getCollectionGroups();

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
