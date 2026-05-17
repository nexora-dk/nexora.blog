// 首页个人介绍区块，作为页面首屏入口。
import { AboutMe } from "@/components/pages/home/about-me";
// Hero 是首页顶部视觉与签名展示区域。
import Hero from "@/components/pages/home/hero";
// Motto 展示站点或作者的短句态度。
import { Motto } from "@/components/pages/home/motto";
// Project 展示精选项目或作品入口。
import { Project } from "@/components/pages/home/project";
// SiteNew 展示站点近期更新或新鲜内容。
import { SiteNew } from "@/components/pages/home/site-new";
import { getFeaturedProjects } from "@/db/queries/projects.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

/**
 * 首页路由组件：按从首屏到内容区的顺序组合首页各展示模块。
 */
export default async function HomePage() {
  const [featuredProjects, settings] = await Promise.all([
    getFeaturedProjects(2),
    getSiteSettings(),
  ]);

  return (
    // 外层容器用于承载 Hero 和后续纵向内容区。
    <div>
      {/* 首屏视觉区，负责建立站点第一印象。 */}
      <Hero settings={settings} />
      {/* 首页主体内容区，通过统一间距把各内容模块分隔开。 */}
      <div className="space-y-28 pb-16 md:space-y-32">
        {/* 站点新鲜事或近期更新模块。 */}
        <SiteNew />
        {/* 精选项目展示模块。 */}
        <Project projects={featuredProjects} />
        {/* 作者简介模块。 */}
        <AboutMe settings={settings} />
        {/* 底部态度短句模块。 */}
        <Motto settings={settings} />
      </div>
    </div>
  );
}
