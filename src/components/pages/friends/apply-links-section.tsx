"use client";

// Client Component：需要调用剪贴板 API、定时器和本地状态，因此必须保留 use client 在首行。
import { useState } from "react";
import type { SiteSettings } from "@/lib/site-settings-defaults";
import { AddFriendLinkDialog } from "./add-friend-link-dialog";

type ApplyLinksSectionProps = {
  settings: Pick<
    SiteSettings,
    | "friendApplyEnabled"
    | "friendApplyIntro"
    | "friendApplyNotes"
    | "friendOwnName"
    | "friendOwnUrl"
    | "friendOwnAvatarUrl"
    | "friendOwnDescription"
    | "friendApplySuccessMessage"
  >;
};

// ApplyLinksSection 负责展示交换友链说明、本站信息和添加友链入口。
export function ApplyLinksSection({ settings }: ApplyLinksSectionProps) {
  // copied 控制复制按钮的即时反馈文案。
  const [copied, setCopied] = useState(false);
  const siteInfoText = `名称：${settings.friendOwnName}\n链接：${settings.friendOwnUrl}\n头像：${settings.friendOwnAvatarUrl}\n描述：${settings.friendOwnDescription}`;

  // copySiteInfo 处理复制交互：写入剪贴板后短暂显示“已复制”。
  async function copySiteInfo() {
    await navigator.clipboard.writeText(siteInfoText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="rounded-[1.5rem] border border-neutral-200/70 bg-white/50 p-5 backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
      {/* 主体使用两列布局：左侧规则说明，右侧本站信息；底部入口跨列居中。 */}
      <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">申请友链前，请确认：</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            {settings.friendApplyIntro}
          </p>
          {/* 循环渲染交换条件，移动端纵向排列，较宽屏幕自动换行成胶囊组。 */}
          <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400 sm:flex-row sm:flex-wrap">
            {settings.friendApplyNotes.map((note) => (
              <li key={note} className="flex items-center gap-2 rounded-full bg-neutral-100/80 px-3 py-1.5 dark:bg-neutral-900/80">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 本站信息卡片：展示可复制的友链字段。 */}
        <div className="rounded-[1.15rem] border border-neutral-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-neutral-900/45">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">我的博客信息</p>
            {/* 条件文案根据 copied 状态切换，用于反馈复制是否刚刚完成。 */}
            <button type="button" onClick={copySiteInfo} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100">
              {copied ? "已复制" : "点击复制"}
            </button>
          </div>
          {/* dl 以键值对形式展示站点名称、链接、头像和描述。 */}
          <dl className="mt-3 grid gap-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400 sm:grid-cols-2">
            <div>
              <dt className="text-neutral-400">名称</dt>
              <dd className="font-medium text-neutral-700 dark:text-neutral-300">{settings.friendOwnName}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">链接</dt>
              <dd className="truncate font-medium text-neutral-700 dark:text-neutral-300">{settings.friendOwnUrl}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">头像</dt>
              <dd className="truncate font-medium text-neutral-700 dark:text-neutral-300">{settings.friendOwnAvatarUrl}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">描述</dt>
              <dd className="font-medium text-neutral-700 dark:text-neutral-300">{settings.friendOwnDescription}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2 lg:flex lg:justify-center">
          {settings.friendApplyEnabled ? (
            <AddFriendLinkDialog successMessage={settings.friendApplySuccessMessage} buttonClassName="group inline-flex items-center gap-2 rounded-full bg-neutral-950 py-2 pl-5 pr-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-neutral-50 dark:text-neutral-950" />
          ) : (
            <p className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm text-neutral-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400">
              友链申请暂未开放
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
