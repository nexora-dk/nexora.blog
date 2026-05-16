"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { ArrowLeft, FolderHeart } from "lucide-react";

import {
  createAdminCollectionAction,
  updateAdminCollectionAction,
  type AdminCollectionFormInput,
} from "@/app/actions/admin-collection";
import {
  simpleIconNames,
  type SimpleIconName,
} from "@/components/pages/collection/collection-data";
import type { AdminCollectionGroupOption } from "@/db/queries/collection.query";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminCollectionCreateContentProps = {
  groups: AdminCollectionGroupOption[];
  mode?: "create" | "edit";
  initialValue?: AdminCollectionFormInput & { id?: number };
};

const inputClassName = "h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";
const textareaClassName = "w-full rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm leading-6 text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";

function getInitialForm(groupId: number): AdminCollectionFormInput {
  return {
    groupId,
    title: "",
    description: "",
    href: "",
    iconType: "simple",
    iconName: simpleIconNames[0] satisfies SimpleIconName,
    iconSrc: "",
    iconAlt: "",
    iconClassName: "",
    isVisible: true,
    sortOrder: 0,
  };
}

export function AdminCollectionCreateContent({
  groups,
  mode = "create",
  initialValue,
}: AdminCollectionCreateContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const initialGroupId = groups[0]?.id ?? 0;
  const defaultForm = useMemo(
    () => initialValue ?? getInitialForm(initialGroupId),
    [initialGroupId, initialValue],
  );
  const [form, setForm] = useState<AdminCollectionFormInput>(defaultForm);
  const isEditMode = mode === "edit";
  const hasGroups = groups.length > 0;

  function updateField<K extends keyof AdminCollectionFormInput>(
    key: K,
    value: AdminCollectionFormInput[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function handleIconTypeChange(iconType: AdminCollectionFormInput["iconType"]) {
    setForm((currentForm) => ({
      ...currentForm,
      iconType,
      iconName: iconType === "simple" && !currentForm.iconName ? simpleIconNames[0] : currentForm.iconName,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending || !hasGroups) {
      return;
    }

    startTransition(async () => {
      const result = isEditMode
        ? await updateAdminCollectionAction(initialValue?.id ?? 0, form)
        : await createAdminCollectionAction(form);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(isEditMode ? "收藏更新成功" : "收藏创建成功");
      router.push("/admin/collection");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={isEditMode ? "编辑收藏" : "新增收藏"}
        description={isEditMode ? "更新收藏条目，并选择它所属的已有分组。" : "创建新的收藏条目，只能选择已经 seed 的分组。"}
        icon={FolderHeart}
      />

      <AdminContentPanel className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              收藏信息
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              分组暂由 seed 管理，这里只维护收藏条目本身。
            </p>
          </div>

          <Link
            href="/admin/collection"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/70 px-4 text-sm font-medium text-neutral-500 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            <ArrowLeft className="size-4" />
            返回
          </Link>
        </div>

        {!hasGroups ? (
          <div className="rounded-3xl border border-dashed border-neutral-200/80 bg-neutral-50/80 p-8 text-sm text-neutral-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-400">
            还没有可选择的收藏分组，请先运行 seed 导入默认分组。
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  名称
                </span>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="例如：GitHub"
                  className={inputClassName}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  分组
                </span>
                <select
                  value={form.groupId}
                  onChange={(event) => updateField("groupId", Number(event.target.value))}
                  className={inputClassName}
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                描述
              </span>
              <textarea
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="写一句会展示在收藏卡片上的说明。"
                rows={3}
                className={textareaClassName}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                链接
              </span>
              <input
                value={form.href}
                onChange={(event) => updateField("href", event.target.value)}
                placeholder="https://example.com/"
                className={inputClassName}
              />
            </label>

            <div className="grid gap-5 lg:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  图标类型
                </span>
                <select
                  value={form.iconType}
                  onChange={(event) => handleIconTypeChange(event.target.value as AdminCollectionFormInput["iconType"])}
                  className={inputClassName}
                >
                  <option value="simple">simple-icons</option>
                  <option value="image">本地图片</option>
                </select>
              </label>

              {form.iconType === "simple" ? (
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    Simple 图标
                  </span>
                  <select
                    value={form.iconName}
                    onChange={(event) => updateField("iconName", event.target.value)}
                    className={inputClassName}
                  >
                    {simpleIconNames.map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    图片路径
                  </span>
                  <input
                    value={form.iconSrc}
                    onChange={(event) => updateField("iconSrc", event.target.value)}
                    placeholder="/images/collection-icon/example.png"
                    className={inputClassName}
                  />
                </label>
              )}

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

            <div className="grid gap-5 lg:grid-cols-3">
              {form.iconType === "image" ? (
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    图片 Alt
                  </span>
                  <input
                    value={form.iconAlt}
                    onChange={(event) => updateField("iconAlt", event.target.value)}
                    placeholder="留空时使用收藏名称"
                    className={inputClassName}
                  />
                </label>
              ) : null}

              <label className="space-y-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  图标类名
                </span>
                <input
                  value={form.iconClassName}
                  onChange={(event) => updateField("iconClassName", event.target.value)}
                  placeholder="text-[#6965db]"
                  className={inputClassName}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  排序
                </span>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => updateField("sortOrder", Number(event.target.value))}
                  className={inputClassName}
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-neutral-200/70 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
              <Link
                href="/admin/collection"
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
                    ? "更新收藏"
                    : "保存收藏"}
              </button>
            </div>
          </form>
        )}
      </AdminContentPanel>
    </div>
  );
}
