import Link from "next/link";
import { ArrowUpRight, Code2, GitBranch, MoreHorizontal, Pencil } from "lucide-react";

import type { ProjectItem } from "@/components/pages/projects/projects-data";

type AdminProjectsTableProps = {
  projects: ProjectItem[];
};

function getStatusClassName(status: string) {
  if (["Building", "Writing", "Exploring"].includes(status)) {
    return "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300";
  }

  if (status === "Planned") {
    return "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300";
}

export function AdminProjectsTable({ projects }: AdminProjectsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-separate border-spacing-y-3 text-left">
        <thead>
          <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
            <th className="px-4 py-2">项目</th>
            <th className="px-4 py-2">分类</th>
            <th className="px-4 py-2">描述</th>
            <th className="px-4 py-2">时间</th>
            <th className="px-4 py-2">状态</th>
            <th className="px-4 py-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.title}
              className="group rounded-[1.4rem] text-sm text-neutral-600 transition dark:text-neutral-300"
            >
              <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-100 via-orange-100 to-sky-200 text-neutral-700 shadow-sm dark:from-pink-500/20 dark:via-orange-400/10 dark:to-sky-400/20 dark:text-neutral-200">
                    <Code2 className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                      {project.title}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.href ? (
                        <Link
                          href={project.href}
                          className="inline-flex items-center gap-1 text-xs text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-50"
                        >
                          <ArrowUpRight className="size-3" />
                          访问
                        </Link>
                      ) : null}
                      {project.repoHref && project.repoHref !== "#" ? (
                        <a
                          href={project.repoHref}
                          className="inline-flex items-center gap-1 text-xs text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-50"
                        >
                          <GitBranch className="size-3" />
                          仓库
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </td>
              <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                  {project.category}
                </span>
              </td>
              <td className="max-w-md border-y border-transparent px-4 py-4 leading-6 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <p className="line-clamp-2">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="border-y border-transparent px-4 py-4 tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                {project.developmentTime}
              </td>
              <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                    aria-label={`编辑 ${project.title}`}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                    aria-label={`${project.title} 更多操作`}
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
