"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { ArrowLeft, Images } from "lucide-react";

import {
  createAdminGalleryAction,
  updateAdminGalleryAction,
  type AdminGalleryFormInput,
} from "@/app/actions/admin-gallery";
import { GalleryFillImage } from "@/components/pages/gallery/gallery-image";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminGalleryCreateContentProps = {
  mode?: "create" | "edit";
  initialValue?: AdminGalleryFormInput & { id?: number };
};

type AdminGalleryFormState = Omit<AdminGalleryFormInput, "imageSrc">;

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const inputClassName = "h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";
const fileInputClassName = "block w-full cursor-pointer rounded-2xl border border-dashed border-neutral-200/80 bg-white/70 px-4 py-4 text-sm text-neutral-500 shadow-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:file:bg-neutral-100 dark:file:text-neutral-950";

function getInitialForm(initialValue?: AdminGalleryCreateContentProps["initialValue"]): AdminGalleryFormState {
  return {
    alt: initialValue?.alt ?? "",
    title: initialValue?.title ?? "",
    location: initialValue?.location ?? "",
    isFeatured: initialValue?.isFeatured ?? false,
    isVisible: initialValue?.isVisible ?? true,
    sortOrder: initialValue?.sortOrder ?? 0,
  };
}

export function AdminGalleryCreateContent({
  mode = "create",
  initialValue,
}: AdminGalleryCreateContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const defaultForm = useMemo(() => getInitialForm(initialValue), [initialValue]);
  const [form, setForm] = useState<AdminGalleryFormState>(defaultForm);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const isEditMode = mode === "edit";

  useEffect(() => {
    return () => {
      if (selectedPreviewUrl) {
        URL.revokeObjectURL(selectedPreviewUrl);
      }
    };
  }, [selectedPreviewUrl]);

  function updateField<K extends keyof AdminGalleryFormState>(
    key: K,
    value: AdminGalleryFormState[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (selectedPreviewUrl) {
      URL.revokeObjectURL(selectedPreviewUrl);
    }

    if (!file) {
      setSelectedFileName("");
      setFileError("");
      setSelectedPreviewUrl(null);
      return;
    }

    if (!allowedImageTypes.has(file.type)) {
      event.target.value = "";
      setSelectedFileName("");
      setFileError("仅支持 JPG、PNG、WebP 或 GIF 图片");
      setSelectedPreviewUrl(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      event.target.value = "";
      setSelectedFileName("");
      setFileError("图片大小不能超过 5MB");
      setSelectedPreviewUrl(null);
      return;
    }

    setSelectedFileName(file.name);
    setFileError("");
    setSelectedPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending || fileError) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = isEditMode
        ? await updateAdminGalleryAction(initialValue?.id ?? 0, formData)
        : await createAdminGalleryAction(formData);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(isEditMode ? "照片更新成功" : "照片创建成功");
      router.push("/admin/gallery");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={isEditMode ? "编辑照片" : "新增照片"}
        description={isEditMode ? "更新相册图片记录、精选状态和公开展示状态。" : "新增一条相册图片记录，图片会上传到 Vercel Blob。"}
        icon={Images}
      />

      <AdminContentPanel className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              照片信息
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              {isEditMode ? "不选择新文件时会保留当前图片。" : "请选择 JPG、PNG、WebP 或 GIF 图片，单张不超过 5MB。"}
            </p>
          </div>

          <Link
            href="/admin/gallery"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm font-medium text-neutral-500 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            <ArrowLeft className="size-4" />
            返回
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              图片文件
            </span>
            <input
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className={fileInputClassName}
            />
            <span className={`block text-xs ${fileError ? "text-red-500 dark:text-red-300" : "text-neutral-400"}`}>
              {fileError || selectedFileName || (isEditMode ? "未选择新文件，将保留当前图片" : "请选择要上传的图片")}
            </span>
          </label>

          {selectedPreviewUrl ? (
            <div
              className="relative aspect-[16/7] overflow-hidden rounded-[1.4rem] border border-neutral-200/70 bg-neutral-100 bg-cover bg-center dark:border-white/10 dark:bg-neutral-900"
              style={{ backgroundImage: `url(${selectedPreviewUrl})` }}
              role="img"
              aria-label={form.alt || form.title || "照片预览"}
            />
          ) : initialValue?.imageSrc ? (
            <div className="relative aspect-[16/7] overflow-hidden rounded-[1.4rem] border border-neutral-200/70 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900">
              <GalleryFillImage
                src={initialValue.imageSrc}
                alt={form.alt || form.title || "照片预览"}
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                标题
              </span>
              <input
                name="title"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="例如：山野云层"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                地点
              </span>
              <input
                name="location"
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder="例如：旅途中"
                className={inputClassName}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Alt 文案
            </span>
            <input
              name="alt"
              value={form.alt}
              onChange={(event) => updateField("alt", event.target.value)}
              placeholder="留空时使用标题"
              className={inputClassName}
            />
          </label>

          <div className="grid gap-5 lg:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                精选封面
              </span>
              <select
                name="isFeatured"
                value={form.isFeatured ? "true" : "false"}
                onChange={(event) => updateField("isFeatured", event.target.value === "true")}
                className={inputClassName}
              >
                <option value="false">普通照片</option>
                <option value="true">设为精选</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                展示状态
              </span>
              <select
                name="isVisible"
                value={form.isVisible ? "true" : "false"}
                onChange={(event) => updateField("isVisible", event.target.value === "true")}
                className={inputClassName}
              >
                <option value="true">展示中</option>
                <option value="false">已隐藏</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                排序
              </span>
              <input
                name="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(event) => updateField("sortOrder", Number(event.target.value))}
                className={inputClassName}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-200/70 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
            <Link
              href="/admin/gallery"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-200/70 bg-white/70 px-5 text-sm font-semibold text-neutral-500 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:text-neutral-50"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isPending || Boolean(fileError)}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-950"
            >
              {isPending
                ? isEditMode
                  ? "更新中..."
                  : "上传中..."
                : isEditMode
                  ? "更新照片"
                  : "上传照片"}
            </button>
          </div>
        </form>
      </AdminContentPanel>
    </div>
  );
}
