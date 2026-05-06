import { TimelineContent } from "@/components/pages/timeline/timeline-content";

type TimelinePageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  const typeParam = (await searchParams).type;
  const selectedType = Array.isArray(typeParam) ? typeParam[0] : typeParam;

  return <TimelineContent selectedType={selectedType} />;
}
