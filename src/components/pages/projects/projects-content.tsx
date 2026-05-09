import { ProjectCard } from "./project-card";
import { projectItems } from "./projects-data";

// ProjectsContent 是项目页面的列表容器，负责把项目数据组织成响应式网格。
export function ProjectsContent() {
  return (
    <div className="pt-4">
      {/* 项目列表区：中等屏幕开始变为两列布局。 */}
      <section className="grid gap-5 md:grid-cols-2">
        {/* 循环渲染项目卡片，使用项目 title 作为 key 并传入完整 project 数据。 */}
        {projectItems.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </section>
    </div>
  );
}
