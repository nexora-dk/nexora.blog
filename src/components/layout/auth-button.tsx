"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";

import { authClient } from "@/lib/auth-client";

const circleButtonClassName =
  "inline-flex h-10.5 w-10.5 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:text-white";

const providerButtonClassName =
  "group/provider relative grid size-11 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-white/20";

const providerTooltipClassName =
  "pointer-events-none absolute bottom-[calc(100%+0.25rem)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-zinc-200/80 bg-white/95 px-2 py-0.5 text-[11px] font-medium text-zinc-700 opacity-0 shadow-lg shadow-zinc-950/10 backdrop-blur transition duration-150 group-hover/provider:-translate-y-0.5 group-hover/provider:opacity-100 dark:border-white/10 dark:bg-neutral-900/95 dark:text-neutral-200";

const headerTooltipClassName =
  "pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 opacity-0 shadow-sm shadow-zinc-950/5 transition group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200";

function getAuthErrorMessage(error: string | null, description: string | null) {
  if (error === "access_denied") {
    return "你取消了授权登录。";
  }

  if (error === "invalid_code") {
    return "登录验证失败，请重新尝试。开发环境下请确认 dev server 已用代理启动。";
  }

  if (error === "account_not_linked" || error === "unable_to_link_account") {
    return "这个邮箱已绑定其他登录方式，请先用原方式登录后再绑定账号。";
  }

  if (error === "email_not_found") {
    return "没有从该账号获取到邮箱，请确认账号邮箱可用后再试。";
  }

  if (error === "unable_to_get_user_info") {
    return "登录成功后获取账号信息失败，请稍后重试。";
  }

  if (error === "oauth_provider_not_found") {
    return "当前登录方式暂不可用，请稍后再试。";
  }

  return description || "登录失败，请稍后重试。";
}

function getAuthCallbackURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete("auth_error");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  return `${url.pathname}${url.search}`;
}

function getAuthErrorCallbackURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete("auth_error");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  url.searchParams.set("auth_error", "1");
  return `${url.pathname}${url.search}`;
}

export function AuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogMounted, setIsDialogMounted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    if (isOpen || !isDialogMounted) {
      return;
    }

    const timeout = window.setTimeout(() => setIsDialogMounted(false), 200);
    return () => window.clearTimeout(timeout);
  }, [isOpen, isDialogMounted]);

  useEffect(() => {
    if (!isDialogMounted) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDialogMounted]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("auth_error") !== "1") {
      return;
    }

    const message = getAuthErrorMessage(searchParams.get("error"), searchParams.get("error_description"));
    const frame = window.requestAnimationFrame(() => {
      setAuthError(message);
      setIsDialogMounted(true);
      window.requestAnimationFrame(() => setIsOpen(true));
    });

    searchParams.delete("auth_error");
    searchParams.delete("error");
    searchParams.delete("error_description");

    const nextURL = `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextURL);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function openDialog() {
    setIsDialogMounted(true);
    window.requestAnimationFrame(() => setIsOpen(true));
  }

  useEffect(() => {
    window.addEventListener("open-auth-dialog", openDialog);
    return () => window.removeEventListener("open-auth-dialog", openDialog);
  }, []);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Element && target.closest("[data-account-menu]")) {
        return;
      }

      setIsAccountMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  const closeDialog = () => setIsOpen(false);

  async function signIn(provider: "github" | "google") {
    setIsSigningIn(true);
    setAuthError(null);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: getAuthCallbackURL(),
      errorCallbackURL: getAuthErrorCallbackURL(),
    });

    if (error) {
      setIsSigningIn(false);
      setAuthError(getAuthErrorMessage(error.code || error.message || null, error.message || null));
    }
  }

  const loginDialog = isDialogMounted
    ? createPortal(
        <div className={`fixed inset-0 z-200 flex items-center justify-center px-5 backdrop-blur-sm transition-opacity duration-200 ease-out dark:bg-black/45 ${isOpen ? "bg-zinc-950/20 opacity-100" : "bg-zinc-950/0 opacity-0 dark:bg-black/0"}`}>
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="关闭登录窗口"
            onClick={closeDialog}
          />

          <div className={`relative z-10 w-full max-w-[360px] rounded-3xl border border-zinc-200/80 bg-white/95 px-6 pb-7 pt-8 text-center shadow-2xl shadow-zinc-950/15 backdrop-blur-xl transition duration-200 ease-out dark:border-white/10 dark:bg-neutral-950/95 dark:shadow-black/40 ${isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"}`}>
            <button
              type="button"
              onClick={closeDialog}
              className="absolute right-4 top-4 grid size-7 place-items-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-200"
              aria-label="关闭登录窗口"
            >
              ×
            </button>

            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200">
              <LogIn className="size-5" />
            </div>

            <h2 className="text-base font-semibold text-zinc-950 dark:text-neutral-50">登录到 Nexora&apos;s Space</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-neutral-400">登录后可以发表评论，并使用你的账号头像和昵称。</p>

            {authError ? (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {authError}
              </p>
            ) : null}

            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => signIn("github")}
                disabled={isSigningIn}
                className={providerButtonClassName}
                aria-label="使用 GitHub 登录"
              >
                <SiGithub className={`size-5 ${isSigningIn ? "opacity-45" : ""}`} />
                <span className={providerTooltipClassName}>GitHub 账号登录</span>
              </button>

              <button
                type="button"
                onClick={() => signIn("google")}
                disabled={isSigningIn}
                className={providerButtonClassName}
                aria-label="使用 Google 登录"
              >
                <SiGoogle className={`size-5 ${isSigningIn ? "opacity-45" : ""}`} />
                <span className={providerTooltipClassName}>Google 账号登录</span>
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  if (isPending) {
    return (
      <>
        <button type="button" disabled className={circleButtonClassName} aria-label="检查登录状态中">
          <LogIn className="size-4.5 opacity-45" />
        </button>
      </>
    );
  }

  if (session?.user) {
    return (
      <>
      <div className="group relative" data-account-menu>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900"
          aria-label="账户菜单"
          aria-expanded={isAccountMenuOpen}
          onClick={() => setIsAccountMenuOpen((open) => !open)}
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold">{session.user.name.slice(0, 1).toUpperCase()}</span>
          )}
        </button>

        <div className={`absolute right-0 top-[calc(100%+0.75rem)] z-50 w-58 rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-2xl shadow-zinc-950/10 backdrop-blur-xl transition duration-150 before:absolute before:bottom-full before:left-0 before:h-3 before:w-full before:content-[''] dark:border-white/10 dark:bg-neutral-950/95 dark:shadow-black/30 ${isAccountMenuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"}`}>
          <div className="flex items-center gap-3 px-2 py-2.5">
            <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200">
              {session.user.image ? (
                <Image src={session.user.image} alt={session.user.name} width={36} height={36} className="h-full w-full object-cover" />
              ) : (
                session.user.name.slice(0, 1).toUpperCase()
              )}
            </div>

            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-zinc-950 dark:text-neutral-50">{session.user.name}</p>
              <p className="truncate text-xs text-zinc-500 dark:text-neutral-500">{session.user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              setIsAccountMenuOpen(false);
              await authClient.signOut();
              window.location.reload();
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/15"
          >
            <LogOut className="size-4" />
            退出登录
          </button>
        </div>
      </div>
            </>
    );
  }

  return (
    <>
      <div className="group relative">
        <button type="button" onClick={openDialog} className={circleButtonClassName} aria-label="登录">
          <LogIn className="size-4.5" />
        </button>
        <span className={headerTooltipClassName}>登录</span>
      </div>

      {loginDialog}
          </>
  );

}
