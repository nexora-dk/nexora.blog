"use client";

import Image from "next/image";
import { useState } from "react";
import { Images, MapPin, Plus, Search, Star } from "lucide-react";

import type { GalleryPhoto } from "@/components/pages/gallery/gallery-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminGalleryContentProps = {
  featuredPhoto: GalleryPhoto;
  photos: GalleryPhoto[];
};

const PHOTOS_PER_PAGE = 5;

export function AdminGalleryContent({ featuredPhoto, photos }: AdminGalleryContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));
  const pagedPhotos = photos.slice(
    (currentPage - 1) * PHOTOS_PER_PAGE,
    currentPage * PHOTOS_PER_PAGE,
  );

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
        description="管理图片、相册分组和展示排序。"
        icon={Images}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              全部照片
            </h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
              {photos.length} 张
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
              <input
                type="search"
                placeholder="按标题/地点/描述搜索..."
                className="h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 pl-11 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20"
              />
            </label>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 dark:bg-neutral-100 dark:text-neutral-950"
            >
              <Plus className="size-4" />
              上传
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-neutral-200/70 bg-white/55 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={featuredPhoto.image}
                  alt={featuredPhoto.alt}
                  fill
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

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2">图片</th>
                <th className="px-4 py-2">标题</th>
                <th className="px-4 py-2">地点</th>
                <th className="px-4 py-2">状态</th>
              </tr>
            </thead>

            <tbody>
              {pagedPhotos.map((photo) => (
                <tr
                  key={`${photo.title}-${photo.alt}`}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="relative h-16 w-24 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm dark:bg-neutral-900">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                      {photo.title}
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      <MapPin className="size-3.5" />
                      {photo.location}
                    </span>
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                      展示中
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {photos.length === 0 ? (
            <div className="flex min-h-[42vh] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
              暂无照片
            </div>
          ) : null}
        </div>

        {photos.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200/70 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-400">
              第 {currentPage} / {totalPages} 页，共 {photos.length} 张照片
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
              >
                上一页
              </button>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
              >
                下一页
              </button>
            </div>
          </div>
        ) : null}
      </AdminContentPanel>
    </div>
  );
}
