import { InterestsSection } from "@/components/pages/about/interests";
import { PhotoSection } from "@/components/pages/about/photo";
import { ProfileSection } from "@/components/pages/about/profile";
import { PageShell } from "@/components/ui/page-shell";

export default function AboutPage() {
  return (
    <PageShell title="关于" description="👋嗨！谢谢你来了解我！">
      <div className="space-y-8">
        <PhotoSection />
        <ProfileSection />
        <InterestsSection />
      </div>
    </PageShell>
  );
}
