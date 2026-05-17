"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { createFriendLinkApplicationAction } from "@/app/actions/friend-link-applications";

type AddFriendLinkDialogProps = {
  buttonClassName?: string;
  successMessage: string;
};

const initialForm = {
  name: "",
  blogUrl: "",
  avatarUrl: "",
  description: "",
};

const inputClassName = "h-10 rounded-full border border-neutral-200 bg-neutral-50 px-4 text-neutral-900 caret-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:caret-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600 dark:focus:bg-neutral-900";
const textareaClassName = "min-h-24 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 caret-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:caret-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600 dark:focus:bg-neutral-900";

export function AddFriendLinkDialog({ buttonClassName, successMessage }: AddFriendLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [open]);

  function closeDialog() {
    if (isPending) {
      return;
    }

    setOpen(false);
  }

  function updateField<K extends keyof typeof initialForm>(
    key: K,
    value: (typeof initialForm)[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
    setMessage("");
    setIsSuccess(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createFriendLinkApplicationAction(formData);

      if (!result.success) {
        setIsSuccess(false);
        setMessage(result.message);
        return;
      }

      setForm(initialForm);
      setIsSuccess(true);
      setMessage(successMessage);
    });
  }

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={buttonClassName ?? "group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 py-1.5 pl-5 pr-1.5 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/55 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-50"}
        >
          申请友链
          <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-xs text-white transition group-hover:translate-x-0.5 dark:bg-neutral-50 dark:text-neutral-950" aria-hidden="true">
            +
          </span>
        </button>
      </div>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[2147483647] grid place-items-center overflow-y-auto bg-neutral-950/75 px-5 py-10 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-friend-link-title">
              <div className="w-full max-w-lg rounded-[1.5rem] bg-white p-6 shadow-2xl dark:bg-neutral-950 dark:ring-1 dark:ring-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 id="add-friend-link-title" className="text-base font-medium text-neutral-950 dark:text-neutral-50">
                      申请友链
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-neutral-400">
                      提交后会进入待审核状态，通过后会公开展示。
                    </p>
                  </div>
                  <button type="button" onClick={closeDialog} className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50" aria-label="关闭友链申请面板" disabled={isPending}>
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <label className="grid items-center gap-4 text-sm text-neutral-700 sm:grid-cols-[4.5rem_1fr] dark:text-neutral-300">
                    <span>名称</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      autoFocus
                      placeholder="你的站点名称"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid items-center gap-4 text-sm text-neutral-700 sm:grid-cols-[4.5rem_1fr] dark:text-neutral-300">
                    <span>链接</span>
                    <input
                      name="blogUrl"
                      value={form.blogUrl}
                      onChange={(event) => updateField("blogUrl", event.target.value)}
                      placeholder="https://example.com/"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid items-center gap-4 text-sm text-neutral-700 sm:grid-cols-[4.5rem_1fr] dark:text-neutral-300">
                    <span>头像</span>
                    <input
                      name="avatarUrl"
                      value={form.avatarUrl}
                      onChange={(event) => updateField("avatarUrl", event.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-4 text-sm text-neutral-700 sm:grid-cols-[4.5rem_1fr] dark:text-neutral-300">
                    <span className="pt-3">描述</span>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={(event) => updateField("description", event.target.value)}
                      placeholder="一句话介绍你的站点"
                      className={textareaClassName}
                    />
                  </label>

                  {message ? (
                    <p className={`rounded-2xl px-4 py-3 text-sm ${isSuccess ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300"}`}>
                      {message}
                    </p>
                  ) : null}

                  <div className="flex justify-end pt-5">
                    <button type="submit" disabled={isPending} className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-50 dark:text-neutral-950">
                      {isPending ? "提交中..." : "提交申请"}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
