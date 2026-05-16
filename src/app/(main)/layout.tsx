import { PageTransition } from "@/components/layout/page-transition";
import { ScrollProgressButton } from "@/components/layout/scroll-progress-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[870px] px-5">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <ScrollProgressButton />
    </>
  );
}
