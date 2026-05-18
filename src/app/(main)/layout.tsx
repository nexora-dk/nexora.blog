import { KanbanGirlWidget } from "@/components/layout/kanban-girl-widget";
import { PageTransition } from "@/components/layout/page-transition";
import { ScrollProgressButton } from "@/components/layout/scroll-progress-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getNavigationPanelData } from "@/components/layout/navigation/navigation-data";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export const dynamic = "force-dynamic";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: MainLayoutProps) {
  const settings = await getSiteSettings();
  const navigationData = await getNavigationPanelData(settings);

  return (
    <>
      <SiteHeader siteName={settings.siteName} navigationData={navigationData} />
      <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[870px] px-5">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter settings={settings} />
      <KanbanGirlWidget />
      <ScrollProgressButton />
    </>
  );
}
