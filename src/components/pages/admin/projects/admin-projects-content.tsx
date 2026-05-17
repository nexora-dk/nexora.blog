"use client";

import { useMemo, useState } from "react";
import { GalleryHorizontalEnd } from "lucide-react";

import type { AdminProjectItem } from "@/db/queries/projects.query";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";
import { AdminProjectsTable } from "./admin-projects-table";

type AdminProjectsContentProps = {
  projects: AdminProjectItem[];
  pageSize: number;
  errorMessage?: string;
};

function getVisibilityLabel(project: AdminProjectItem) {
  return [project.isFeatured ? "精选" : "", project.isVisible ? "展示中" : "已隐藏"]
    .filter(Boolean)
    .join(" ");
}

export function AdminProjectsContent({ projects, pageSize, errorMessage }: AdminProjectsContentProps) {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return projects;
    }

    return projects.filter((project) => {
      return [
        project.title,
        project.description,
        project.category,
        project.status,
        project.developmentTime,
        project.href,
        project.repoHref,
        getVisibilityLabel(project),
        ...project.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [projects, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const pagedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="项目"
        description="管理站点项目展示、链接、标签和发布状态。"
        icon={GalleryHorizontalEnd}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <AdminListToolbar
          title="全部项目"
          count={filteredProjects.length}
          countLabel="个"
          searchPlaceholder="按名称/描述/标签搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          actionHref="/admin/projects/new"
        />

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-7">
          {filteredProjects.length > 0 ? (
            <AdminProjectsTable projects={pagedProjects} />
          ) : (
            <AdminEmptyState>
              {projects.length === 0 ? "暂无项目" : "没有找到匹配的项目"}
            </AdminEmptyState>
          )}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProjects.length}
          itemLabel="个项目"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
