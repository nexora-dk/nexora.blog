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
import { noteItems } from "@/components/pages/notes/notes-data";
import { timelineTypeMeta, type TimelineItem, type TimelineType } from "@/components/pages/timeline/timeline-data";
import { getArticleItemsFromMarkdown } from "@/components/pages/writing/writing-data";
import { getFeaturedProjects } from "@/db/queries/projects.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";
import { getDatabaseErrorMessage } from "@/db/queries/retry";
import { getTimelineItemsFromDb } from "@/db/queries/timeline.query";

function getDateTime(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return 0;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

function getFallbackTimelineItems(): TimelineItem[] {
  return [
    ...getArticleItemsFromMarkdown().map((writing) => ({
      title: writing.title,
      description: writing.description,
      href: writing.href,
      date: writing.date,
      type: "writing" as const,
      typeLabel: timelineTypeMeta.writing.label,
      meta: writing.categoryLabel,
    })),
    ...noteItems.map((note) => {
      const type: TimelineType = note.column === "memory" ? "memory" : "notes";

      return {
        title: note.title,
        description: note.description,
        href: note.href,
        date: note.publishedAt,
        type,
        typeLabel: timelineTypeMeta[type].label,
        meta: note.columnLabel,
      };
    }),
  ].sort((first, second) => getDateTime(second.date) - getDateTime(first.date));
}

async function getLatestHomeActivities() {
  try {
    return (await getTimelineItemsFromDb()).slice(0, 3);
  } catch (error) {
    console.warn(`Failed to load home latest activities: ${getDatabaseErrorMessage(error)}`);
    return getFallbackTimelineItems().slice(0, 3);
  }
}

/**
 * 首页路由组件：按从首屏到内容区的顺序组合首页各展示模块。
 */
export default async function HomePage() {
  const [featuredProjects, settings, latestActivities] = await Promise.all([
    getFeaturedProjects(2),
    getSiteSettings(),
    getLatestHomeActivities(),
  ]);

  return (
    // 外层容器用于承载 Hero 和后续纵向内容区。
    <div>
      {/* 首屏视觉区，负责建立站点第一印象。 */}
      <Hero settings={settings} />
      {/* 首页主体内容区，通过统一间距把各内容模块分隔开。 */}
      <div className="space-y-28 pb-16 md:space-y-32">
        {/* 站点新鲜事或近期更新模块。 */}
        <SiteNew items={latestActivities} />
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
