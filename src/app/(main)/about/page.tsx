// 兴趣模块展示作者偏好、关注方向或个人标签。
import { InterestsSection } from "@/components/pages/about/interests";
// 照片模块用于给关于页提供更具个人感的视觉展示。
import { PhotoSection } from "@/components/pages/about/photo";
// 个人资料模块展示作者基础信息和简介。
import { ProfileSection } from "@/components/pages/about/profile";
// PageShell 提供统一的页面标题、描述和内容容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 关于页面：组合照片、个人资料和兴趣内容，帮助访客快速认识作者。
 */
export default function AboutPage() {
  return (
    // 统一页面壳负责渲染页面标题和描述。
    <PageShell title="关于" description="👋嗨！谢谢你来了解我！">
      {/* 页面主体使用统一纵向间距分隔多个介绍区块。 */}
      <div className="space-y-8">
        {/* 个人照片或形象展示区。 */}
        <PhotoSection />
        {/* 个人信息与简介区。 */}
        <ProfileSection />
        {/* 兴趣爱好和关注方向展示区。 */}
        <InterestsSection />
      </div>
    </PageShell>
  );
}
