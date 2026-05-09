"use client";

// Client Component：需要调用剪贴板 API、定时器和本地状态，因此必须保留 use client 在首行。
import { useState } from "react";
import { AddFriendLinkDialog } from "./add-friend-link-dialog";

// notes 是交换友链前的提示清单，组件内会循环渲染为胶囊列表。
const notes = ["请先在你的友链中添加本站", "确保你的网站可以正常访问", "博客内容不违反国家法律法规"];

// siteInfo 集中保存本站友链信息，既用于页面展示，也用于拼接复制文本。
const siteInfo = {
  name: "nexora",
  link: "https://nexora.blog/",
  avatar: "https://nexora.blog/images/avatar/avatar.jpg",
  description: "不努力就只能旁听别人的好消息",
};

// siteInfoText 是复制到剪贴板的多行文本格式，保持与展示字段一一对应。
const siteInfoText = `名称：${siteInfo.name}\n链接：${siteInfo.link}\n头像：${siteInfo.avatar}\n描述：${siteInfo.description}`;

// ApplyLinksSection 负责展示交换友链说明、本站信息和添加友链入口。
export function ApplyLinksSection() {
  // copied 控制复制按钮的即时反馈文案。
  const [copied, setCopied] = useState(false);

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
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">交换友链前，请确认：</p>
          {/* 循环渲染交换条件，移动端纵向排列，较宽屏幕自动换行成胶囊组。 */}
          <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400 sm:flex-row sm:flex-wrap">
            {notes.map((note) => (
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
              <dd className="font-medium text-neutral-700 dark:text-neutral-300">{siteInfo.name}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">链接</dt>
              <dd className="truncate font-medium text-neutral-700 dark:text-neutral-300">{siteInfo.link}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">头像</dt>
              <dd className="truncate font-medium text-neutral-700 dark:text-neutral-300">{siteInfo.avatar}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">描述</dt>
              <dd className="font-medium text-neutral-700 dark:text-neutral-300">{siteInfo.description}</dd>
            </div>
          </dl>
        </div>

        {/* 添加友链入口复用弹窗组件，并覆盖按钮样式以适配本区域视觉。 */}
        <div className="lg:col-span-2 lg:flex lg:justify-center">
          <AddFriendLinkDialog buttonClassName="group inline-flex items-center gap-2 rounded-full bg-neutral-950 py-2 pl-5 pr-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-neutral-50 dark:text-neutral-950" />
        </div>
      </div>
    </section>
  );
}
