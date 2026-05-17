"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowUpRight, Code2, GitBranch, Pencil, Star, Trash2 } from "lucide-react";

import { deleteAdminProjectAction } from "@/app/actions/admin-projects";
import { GalleryFillImage } from "@/components/pages/gallery/gallery-image";
import type { AdminProjectItem } from "@/db/queries/projects.query";

type AdminProjectsTableProps = {
  projects: AdminProjectItem[];
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

function ProjectCover({ project }: { project: AdminProjectItem }) {
  if (!project.coverImageUrl) {
    return (
      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-100 via-orange-100 to-sky-200 text-neutral-700 shadow-sm dark:from-pink-500/20 dark:via-orange-400/10 dark:to-sky-400/20 dark:text-neutral-200">
        <Code2 className="size-5" />
      </div>
    );
  }

  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm dark:bg-neutral-900">
      <GalleryFillImage
        src={project.coverImageUrl}
        alt={project.title}
        sizes="48px"
        className="object-cover"
      />
    </div>
  );
}

export function AdminProjectsTable({ projects }: AdminProjectsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(project: AdminProjectItem) {
    const confirmed = window.confirm(`确定删除「${project.title}」吗？此操作不可撤销。`);

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminProjectAction(project.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] table-fixed border-separate border-spacing-y-3 text-left">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[9rem]" />
          <col className="w-[28%]" />
          <col className="w-[8rem]" />
          <col className="w-[9rem]" />
          <col className="w-[8rem]" />
          <col className="w-[8rem]" />
        </colgroup>
        <thead>
          <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
            <th className="px-4 py-2 text-left">项目</th>
            <th className="px-4 py-2 text-center whitespace-nowrap">分类</th>
            <th className="px-4 py-2 text-left">描述</th>
            <th className="px-4 py-2 text-center whitespace-nowrap">时间</th>
            <th className="px-4 py-2 text-center whitespace-nowrap">状态</th>
            <th className="px-4 py-2 text-center whitespace-nowrap">展示</th>
            <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="group rounded-[1.4rem] text-sm text-neutral-600 transition dark:text-neutral-300"
            >
              <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <ProjectCover project={project} />
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
                      {project.repoHref ? (
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
              <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
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
              <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                {project.developmentTime}
                <p className="mt-1 text-xs text-neutral-400">排序 {project.sortOrder}</p>
              </td>
              <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <div className="flex flex-col items-center gap-2">
                  {project.isFeatured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                      <Star className="size-3" />
                      精选
                    </span>
                  ) : null}
                  {project.isVisible ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                      展示中
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      已隐藏
                    </span>
                  )}
                </div>
              </td>
              <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                <div className="flex justify-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                    aria-label={`编辑 ${project.title}`}
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    disabled={isPending}
                    className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                    aria-label={`删除 ${project.title}`}
                  >
                    <Trash2 className="size-4" />
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
