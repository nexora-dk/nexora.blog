"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

import {
  createAdminThinkingAction,
  updateAdminThinkingAction,
  type AdminThinkingFormInput,
} from "@/app/actions/admin-thinking";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminThinkingCreateContentProps = {
  mode?: "create" | "edit";
  initialValue?: AdminThinkingFormInput & { id?: number };
};

const inputClassName = "h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";
const textareaClassName = "w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm leading-6 text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";

function getDefaultDate() {
  const date = new Date();

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function getInitialForm(): AdminThinkingFormInput {
  return {
    content: "",
    publishedAt: getDefaultDate(),
    time: "",
    mood: "",
    isVisible: true,
  };
}

export function AdminThinkingCreateContent({
  mode = "create",
  initialValue,
}: AdminThinkingCreateContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const defaultForm = useMemo(() => initialValue ?? getInitialForm(), [initialValue]);
  const [form, setForm] = useState<AdminThinkingFormInput>(defaultForm);
  const isEditMode = mode === "edit";

  function updateField<K extends keyof AdminThinkingFormInput>(
    key: K,
    value: AdminThinkingFormInput[K],
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
        ? await updateAdminThinkingAction(initialValue?.id ?? 0, form)
        : await createAdminThinkingAction(form);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(isEditMode ? "思考更新成功" : "思考创建成功");
      router.push("/admin/thinking");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={isEditMode ? "编辑思考" : "新增思考"}
        description={isEditMode ? "更新展示在思考页面的碎片想法。" : "创建一条新的碎片想法，可选择是否公开展示。"}
        icon={Sparkles}
      />

      <AdminContentPanel className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              思考内容
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              可隐藏的思考只会保留在后台，不会出现在公开页面。
            </p>
          </div>

          <Link
            href="/admin/thinking"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm font-medium text-neutral-500 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            <ArrowLeft className="size-4" />
            返回
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              正文
            </span>
            <textarea
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="写下一段阶段性想法。"
              rows={10}
              className={textareaClassName}
            />
          </label>

          <div className="grid gap-5 lg:grid-cols-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                发布日期
              </span>
              <input
                value={form.publishedAt}
                onChange={(event) => updateField("publishedAt", event.target.value)}
                placeholder="2026年5月16日"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                时间
              </span>
              <input
                value={form.time}
                onChange={(event) => updateField("time", event.target.value)}
                placeholder="22:18"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                心情
              </span>
              <input
                value={form.mood}
                onChange={(event) => updateField("mood", event.target.value)}
                placeholder="整理中"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                状态
              </span>
              <select
                value={form.isVisible ? "visible" : "hidden"}
                onChange={(event) => updateField("isVisible", event.target.value === "visible")}
                className={inputClassName}
              >
                <option value="visible">展示中</option>
                <option value="hidden">已隐藏</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-neutral-200/70 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
            <Link
              href="/admin/thinking"
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
                  ? "更新思考"
                  : "保存思考"}
            </button>
          </div>
        </form>
      </AdminContentPanel>
    </div>
  );
}
