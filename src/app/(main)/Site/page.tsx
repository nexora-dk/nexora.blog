// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 此站点页面：用于承载本站说明、技术栈或站点概览内容。
 */
export default function SitePage() {
  return (
    // 当前页面先保留统一页面壳，后续内容完善时会放入子节点区域。
    <PageShell title="此站点" description="这是关于本站的相关概述">
      {/* 占位容器，表示页面结构已接入但主体内容暂未填充。 */}
      <div />
    </PageShell>
  );
}
