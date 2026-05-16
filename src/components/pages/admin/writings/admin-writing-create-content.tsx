"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { ArrowLeft, PenLine } from "lucide-react";

import {
  createAdminWritingAction,
  updateAdminWritingAction,
  type AdminWritingFormInput,
} from "@/app/actions/admin-writings";
import type { ArticleCategory } from "@/components/pages/writing/writing-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type WritingCategoryOption = {
  label: string;
  value: ArticleCategory;
};

type AdminWritingCreateContentProps = {
  categories: WritingCategoryOption[];
  mode?: "create" | "edit";
  initialValue?: AdminWritingFormInput;
};

const inputClassName = "h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";
const readOnlyInputClassName = `${inputClassName} cursor-not-allowed bg-neutral-100/70 text-neutral-500 dark:bg-white/[0.025] dark:text-neutral-500`;
const textareaClassName = "w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm leading-6 text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";

function getDefaultDate() {
  const date = new Date();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日星期${weekdays[date.getDay()]}`;
}

function getInitialForm(category: ArticleCategory): AdminWritingFormInput {
  return {
    title: "",
    slug: "",
    description: "",
    category,
    tags: "",
    date: getDefaultDate(),
    readingTime: "",
    content: "",
  };
}

export function AdminWritingCreateContent({
  categories,
  mode = "create",
  initialValue,
}: AdminWritingCreateContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const initialCategory = categories[0]?.value ?? "tech";
  const defaultForm = useMemo(
    () => initialValue ?? getInitialForm(initialCategory),
    [initialCategory, initialValue],
  );
  const [form, setForm] = useState<AdminWritingFormInput>(defaultForm);
  const isEditMode = mode === "edit";

  function updateField<K extends keyof AdminWritingFormInput>(
    key: K,
    value: AdminWritingFormInput[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    startTransition(async () => {
      const result = isEditMode
        ? await updateAdminWritingAction(form.slug, form)
        : await createAdminWritingAction(form);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(isEditMode ? "文稿更新成功" : "文稿创建成功");
      router.push("/admin/writings");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={isEditMode ? "编辑文稿" : "新增文稿"}
        description={isEditMode ? "更新 Markdown 正文，并同步更新文稿列表数据。" : "创建 Markdown 正文，并同步写入文稿列表数据。"}
        icon={PenLine}
      />

      <AdminContentPanel className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              文稿信息
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              {isEditMode ? "Slug 暂不支持修改，以避免影响公开链接、评论和 Markdown 文件路径。" : "Slug 会用于生成公开访问路径 /writing/slug。"}
            </p>
          </div>

          <Link
            href="/admin/writings"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm font-medium text-neutral-500 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            <ArrowLeft className="size-4" />
            返回
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                标题
              </span>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="例如：在 Next.js 里整理内容流"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Slug
              </span>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                readOnly={isEditMode}
                placeholder="例如：next-content-flow"
                className={isEditMode ? readOnlyInputClassName : inputClassName}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              摘要
            </span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="写一段会展示在列表和详情页头部的摘要。"
              rows={3}
              className={textareaClassName}
            />
          </label>

          <div className="grid gap-5 lg:grid-cols-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                分类
              </span>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className={inputClassName}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                标签
              </span>
              <input
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="Next.js, React, MDX"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                阅读时间
              </span>
              <input
                value={form.readingTime}
                onChange={(event) => updateField("readingTime", event.target.value)}
                placeholder="留空自动估算"
                className={inputClassName}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              发布日期
            </span>
            <input
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              placeholder="2026年5月16日星期六"
              className={inputClassName}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Markdown 正文
            </span>
            <textarea
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder={"## 小标题\n\n从这里开始写正文。"}
              rows={18}
              className={`${textareaClassName} font-mono`}
            />
          </label>

          <div className="flex flex-col gap-3 border-t border-neutral-200/70 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
            <Link
              href="/admin/writings"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-200/70 bg-white/70 px-5 text-sm font-semibold text-neutral-500 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:text-neutral-50"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-950"
            >
              {isPending
                ? isEditMode
                  ? "更新中..."
                  : "保存中..."
                : isEditMode
                  ? "更新文稿"
                  : "保存文稿"}
            </button>
          </div>
        </form>
      </AdminContentPanel>
    </div>
  );
}
