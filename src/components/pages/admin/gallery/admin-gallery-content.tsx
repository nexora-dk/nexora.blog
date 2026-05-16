"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Images, MapPin, Pencil, Star, Trash2 } from "lucide-react";

import { deleteAdminGalleryAction } from "@/app/actions/admin-gallery";
import { GalleryFillImage } from "@/components/pages/gallery/gallery-image";
import type { AdminGalleryPhoto } from "@/db/queries/gallery.query";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";

type AdminGalleryContentProps = {
  photos: AdminGalleryPhoto[];
};

const PHOTOS_PER_PAGE = 5;

function getStatusLabel(photo: AdminGalleryPhoto) {
  return [photo.isFeatured ? "精选" : "", photo.isVisible ? "展示中" : "已隐藏"]
    .filter(Boolean)
    .join(" ");
}

export function AdminGalleryContent({ photos }: AdminGalleryContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const featuredPhoto = photos.find((photo) => photo.isFeatured);

  const filteredPhotos = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return photos;
    }

    return photos.filter((photo) => {
      return [
        photo.title,
        photo.location,
        photo.alt,
        photo.imageSrc,
        getStatusLabel(photo),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [photos, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE),
  );
  const pagedPhotos = filteredPhotos.slice(
    (currentPage - 1) * PHOTOS_PER_PAGE,
    currentPage * PHOTOS_PER_PAGE,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function handleDelete(photo: AdminGalleryPhoto) {
    const confirmed = window.confirm(`确定删除「${photo.title}」吗？此操作不可撤销。`);

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminGalleryAction(photo.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    });
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
        title="相册"
        description="管理照片记录、精选封面和公开展示状态。"
        icon={Images}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <AdminListToolbar
          title="全部照片"
          count={filteredPhotos.length}
          countLabel="张"
          searchPlaceholder="按标题/地点/路径搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          actionHref="/admin/gallery/new"
        />

        {featuredPhoto ? (
          <div className="mt-6 rounded-[1.4rem] border border-neutral-200/70 bg-white/55 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
                  <GalleryFillImage
                    src={featuredPhoto.imageSrc}
                    alt={featuredPhoto.alt}
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                    <Star className="size-3.5" />
                    精选封面
                  </div>
                  <h3 className="mt-2 font-semibold text-neutral-950 dark:text-neutral-50">
                    {featuredPhoto.title}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-400">
                    <MapPin className="size-3.5" />
                    {featuredPhoto.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[1040px] table-fixed border-separate border-spacing-y-3 text-left">
            <colgroup>
              <col className="w-[16%]" />
              <col className="w-[18%]" />
              <col className="w-[12%]" />
              <col className="w-[30%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2 text-center whitespace-nowrap">图片</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">标题</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">地点</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">路径 / 排序</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">状态</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedPhotos.map((photo) => (
                <tr
                  key={photo.id}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="relative mx-auto h-16 w-24 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm dark:bg-neutral-900">
                      <GalleryFillImage
                        src={photo.imageSrc}
                        alt={photo.alt}
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                      {photo.title}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
                      {photo.alt}
                    </p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      <MapPin className="size-3.5" />
                      {photo.location}
                    </span>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <p className="mx-auto max-w-xs truncate text-xs text-neutral-400">
                      {photo.imageSrc}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">排序 {photo.sortOrder}</p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex flex-col items-center gap-2">
                      {photo.isFeatured ? (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                          精选
                        </span>
                      ) : null}
                      {photo.isVisible ? (
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

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/admin/gallery/${photo.id}/edit`}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label="编辑照片"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(photo)}
                        disabled={isPending}
                        className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label="删除照片"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPhotos.length === 0 ? (
            <AdminEmptyState>
              {photos.length === 0 ? "暂无照片" : "没有找到匹配的照片"}
            </AdminEmptyState>
          ) : null}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPhotos.length}
          itemLabel="张照片"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
