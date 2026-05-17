"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { ArrowLeft, HeartHandshake } from "lucide-react";

import {
  createAdminFriendLinkAction,
  updateAdminFriendLinkAction,
  type AdminFriendLinkFormInput,
} from "@/app/actions/admin-friend-links";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminFriendCreateContentProps = {
  mode?: "create" | "edit";
  initialValue?: AdminFriendLinkFormInput & { id?: number };
};

const inputClassName = "h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";
const textareaClassName = "w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm leading-6 text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";

function getInitialForm(initialValue?: AdminFriendCreateContentProps["initialValue"]): AdminFriendLinkFormInput {
  return {
    name: initialValue?.name ?? "",
    description: initialValue?.description ?? "",
    avatarUrl: initialValue?.avatarUrl ?? "",
    blogUrl: initialValue?.blogUrl ?? "",
    status: initialValue?.status ?? "approved",
    isVisible: initialValue?.isVisible ?? true,
    sortOrder: initialValue?.sortOrder ?? 0,
  };
}

export function AdminFriendCreateContent({
  mode = "create",
  initialValue,
}: AdminFriendCreateContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const defaultForm = useMemo(() => getInitialForm(initialValue), [initialValue]);
  const [form, setForm] = useState<AdminFriendLinkFormInput>(defaultForm);
  const isEditMode = mode === "edit";

  function updateField<K extends keyof AdminFriendLinkFormInput>(
    key: K,
    value: AdminFriendLinkFormInput[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function handleStatusChange(status: AdminFriendLinkFormInput["status"]) {
    setForm((currentForm) => ({
      ...currentForm,
      status,
      isVisible: status === "approved" ? currentForm.isVisible : false,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = isEditMode
        ? await updateAdminFriendLinkAction(initialValue?.id ?? 0, formData)
        : await createAdminFriendLinkAction(formData);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(isEditMode ? "友链更新成功" : "友链创建成功");
      router.push("/admin/friends");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={isEditMode ? "编辑友链" : "新增友链"}
        description={isEditMode ? "更新友链站点信息、审核状态和展示状态。" : "新增一个已通过的友链站点。"}
        icon={HeartHandshake}
      />

      <AdminContentPanel className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              友链信息
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              只有“已通过”且“公开展示”的友链会出现在公开页面。
            </p>
          </div>

          <Link
            href="/admin/friends"
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
                名称
              </span>
              <input
                name="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="例如：星河旅人"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                博客 URL
              </span>
              <input
                name="blogUrl"
                value={form.blogUrl}
                onChange={(event) => updateField("blogUrl", event.target.value)}
                placeholder="https://example.com/"
                className={inputClassName}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              头像 URL
            </span>
            <input
              name="avatarUrl"
              value={form.avatarUrl}
              onChange={(event) => updateField("avatarUrl", event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className={inputClassName}
            />
          </label>

          {form.avatarUrl ? (
            <div className="flex items-center gap-4 rounded-[1.4rem] border border-neutral-200/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-white/70 dark:bg-neutral-900 dark:ring-white/10">
                <img
                  src={form.avatarUrl}
                  alt={form.name || "友链头像预览"}
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-medium text-neutral-950 dark:text-neutral-50">
                  头像预览
                </p>
                <p className="mt-1 truncate text-xs text-neutral-400">{form.avatarUrl}</p>
              </div>
            </div>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              描述
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="写一句会展示在友链卡片上的说明。"
              rows={4}
              className={textareaClassName}
            />
          </label>

          <div className="grid gap-5 lg:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                审核状态
              </span>
              <select
                name="status"
                value={form.status}
                onChange={(event) => handleStatusChange(event.target.value as AdminFriendLinkFormInput["status"])}
                className={inputClassName}
              >
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
                <option value="hidden">已隐藏</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                公开展示
              </span>
              <select
                name="isVisible"
                value={form.isVisible ? "true" : "false"}
                onChange={(event) => updateField("isVisible", event.target.value === "true")}
                className={inputClassName}
                disabled={form.status !== "approved"}
              >
                <option value="true">公开展示</option>
                <option value="false">不公开展示</option>
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
              href="/admin/friends"
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
                  ? "更新友链"
                  : "保存友链"}
            </button>
          </div>
        </form>
      </AdminContentPanel>
    </div>
  );
}
