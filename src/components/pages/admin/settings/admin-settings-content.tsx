"use client";

import { type FormEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

import { updateAdminSiteSettingsAction } from "@/app/actions/admin-site-settings";
import type { SiteSettings } from "@/lib/site-settings-defaults";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type SettingsFieldProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

type AdminSettingsContentProps = {
  settings: SiteSettings;
};

function SettingsField({ label, description, children }: SettingsFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
        {label}
      </span>
      {description ? (
        <span className="text-xs leading-5 text-neutral-400">{description}</span>
      ) : null}
      {children}
    </label>
  );
}

const inputClassName =
  "h-11 rounded-2xl border border-neutral-200/80 bg-white/70 px-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";

const textareaClassName =
  "min-h-28 resize-none rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 text-sm leading-6 text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20";

const settingTabs = [
  { key: "site", label: "站点基础" },
  { key: "seo", label: "SEO" },
  { key: "home", label: "首页展示" },
  { key: "social", label: "社交链接" },
  { key: "friends", label: "友链申请" },
  { key: "footer", label: "页脚" },
  { key: "admin", label: "后台偏好" },
] as const;

type SettingTabKey = (typeof settingTabs)[number]["key"];

function joinLines(items: string[]) {
  return items.join("\n");
}

export function AdminSettingsContent({ settings }: AdminSettingsContentProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState<SettingTabKey>("site");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateAdminSiteSettingsAction(formData);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert("设置已保存");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="设置"
        description="管理站点信息、SEO、首页展示、社交链接、友链申请和后台偏好。"
        icon={Settings}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <div className="mb-8 flex flex-wrap gap-2 rounded-[1.4rem] border border-neutral-200/70 bg-white/55 p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
            {settingTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-neutral-950 text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-950"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            <section className={`space-y-5 ${activeTab === "site" ? "" : "hidden"}`}>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    站点基础
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    配置博客名称、作者信息和站点级链接。
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="站点名称" description="用于导航、浏览器标题和页脚品牌。">
                    <input name="siteName" className={inputClassName} defaultValue={settings.siteName} placeholder="请输入站点名称" />
                  </SettingsField>

                  <SettingsField label="作者名称" description="用于首页、头像 alt 和公开作者展示。">
                    <input name="authorName" className={inputClassName} defaultValue={settings.authorName} placeholder="请输入作者名称" />
                  </SettingsField>

                  <SettingsField label="站点 URL" description="用于 metadataBase 和外部分享。">
                    <input name="siteUrl" className={inputClassName} defaultValue={settings.siteUrl} placeholder="https://example.com" />
                  </SettingsField>

                  <SettingsField label="RSS 地址" description="可以是站内路径或完整 URL。">
                    <input name="rssUrl" className={inputClassName} defaultValue={settings.rssUrl} placeholder="/rss.xml" />
                  </SettingsField>

                  <SettingsField label="头像地址" description="用于首页头像，支持站内路径或远程图片。">
                    <input name="avatarUrl" className={inputClassName} defaultValue={settings.avatarUrl} placeholder="/images/avatar/avatar.jpg" />
                  </SettingsField>

                  <SettingsField label="签名图片" description="用于首页 Hero 签名图。">
                    <input name="signatureUrl" className={inputClassName} defaultValue={settings.signatureUrl} placeholder="/images/signature/signature.svg" />
                  </SettingsField>

                  <SettingsField label="联系邮箱" description="用于前台联系方式和公开邮箱。">
                    <input name="contactEmail" className={inputClassName} defaultValue={settings.contactEmail} placeholder="name@example.com" />
                  </SettingsField>
                </div>

                <SettingsField label="站点描述" description="用于默认描述和站点简介。">
                  <textarea name="siteDescription" className={textareaClassName} defaultValue={settings.siteDescription} placeholder="请输入站点描述" />
                </SettingsField>
              </section>

            <section className={`space-y-5 ${activeTab === "seo" ? "" : "hidden"}`}>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    SEO
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    配置默认 metadata 和搜索关键词。
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="标题模板" description="子页面标题会套用这个模板，保留 %s 表示页面标题。">
                    <input name="seoTitleTemplate" className={inputClassName} defaultValue={settings.seoTitleTemplate} placeholder="%s | 站点名称" />
                  </SettingsField>

                  <SettingsField label="默认关键词" description="多个关键词可用逗号或换行分隔。">
                    <textarea name="seoKeywords" className={textareaClassName} defaultValue={settings.seoKeywords.join(", ")} placeholder="Next.js, React, Blog" />
                  </SettingsField>
                </div>

                <SettingsField label="默认描述" description="当页面没有单独描述时使用。">
                  <textarea name="seoDescription" className={textareaClassName} defaultValue={settings.seoDescription} placeholder="请输入默认 SEO 描述" />
                </SettingsField>
              </section>

            <section className={`space-y-5 ${activeTab === "home" ? "" : "hidden"}`}>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    首页展示
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    配置首页 Hero、联系卡片、学习天数和座右铭。
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="Hero 前缀" description="显示在签名图前面。">
                    <input name="homeHeroPrefix" className={inputClassName} defaultValue={settings.homeHeroPrefix} placeholder="我是" />
                  </SettingsField>

                  <SettingsField label="Hero 后缀" description="显示在签名图后面。">
                    <input name="homeHeroSuffix" className={inputClassName} defaultValue={settings.homeHeroSuffix} placeholder="，一个爱捣鼓的码农" />
                  </SettingsField>

                  <SettingsField label="分享引导" description="显示在滚动文案前。">
                    <input name="homeShareText" className={inputClassName} defaultValue={settings.homeShareText} placeholder="在这里分享" />
                  </SettingsField>

                  <SettingsField label="位置文本" description="首页 Hero 下方的位置/时区文案。">
                    <input name="homeLocationText" className={inputClassName} defaultValue={settings.homeLocationText} placeholder="广东 • UTC/GMT +8" />
                  </SettingsField>

                  <SettingsField label="学习开始时间" description="用于计算首页编程时间天数。">
                    <input name="learningStartedAt" className={inputClassName} defaultValue={settings.learningStartedAt} placeholder="2026-01-20T00:00:00+08:00" />
                  </SettingsField>

                  <SettingsField label="代码胶囊" description="座右铭上方展示的代码文本。">
                    <input name="mottoCodeText" className={inputClassName} defaultValue={settings.mottoCodeText} placeholder="console.log(&quot;Hello World&quot;)" />
                  </SettingsField>
                </div>

                <SettingsField label="首页滚动文案" description="每行一条，最多 10 条。">
                  <textarea name="homeRotatingTexts" className={textareaClassName} defaultValue={joinLines(settings.homeRotatingTexts)} placeholder="记录生活的照片" />
                </SettingsField>

                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="中文座右铭前缀">
                    <input name="mottoCnPrefix" className={inputClassName} defaultValue={settings.mottoCnPrefix} />
                  </SettingsField>

                  <SettingsField label="中文高亮一">
                    <input name="mottoCnHighlightA" className={inputClassName} defaultValue={settings.mottoCnHighlightA} />
                  </SettingsField>

                  <SettingsField label="中文中段">
                    <input name="mottoCnMiddle" className={inputClassName} defaultValue={settings.mottoCnMiddle} />
                  </SettingsField>

                  <SettingsField label="中文高亮二">
                    <input name="mottoCnHighlightB" className={inputClassName} defaultValue={settings.mottoCnHighlightB} />
                  </SettingsField>

                  <SettingsField label="中文后缀">
                    <input name="mottoCnSuffix" className={inputClassName} defaultValue={settings.mottoCnSuffix} />
                  </SettingsField>
                </div>

                <SettingsField label="英文座右铭" description="用于底部打字机效果。">
                  <textarea name="mottoEnText" className={textareaClassName} defaultValue={settings.mottoEnText} />
                </SettingsField>
              </section>

            <section className={`space-y-5 ${activeTab === "social" ? "" : "hidden"}`}>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    社交链接
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    配置首页联系卡片和页脚外部链接。
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="GitHub" description="个人 GitHub 主页地址。">
                    <input name="githubUrl" className={inputClassName} defaultValue={settings.githubUrl} placeholder="https://github.com/username" />
                  </SettingsField>

                  <SettingsField label="网易云音乐">
                    <input name="neteaseMusicUrl" className={inputClassName} defaultValue={settings.neteaseMusicUrl} placeholder="https://music.163.com/..." />
                  </SettingsField>

                  <SettingsField label="抖音">
                    <input name="douyinUrl" className={inputClassName} defaultValue={settings.douyinUrl} placeholder="https://www.douyin.com/..." />
                  </SettingsField>

                  <SettingsField label="微信二维码" description="可以是站内图片路径或远程图片。">
                    <input name="wechatQrUrl" className={inputClassName} defaultValue={settings.wechatQrUrl} placeholder="/images/wechat-qr.jpg" />
                  </SettingsField>
                </div>
              </section>

            <section className={`space-y-5 ${activeTab === "friends" ? "" : "hidden"}`}>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    友链申请
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    配置友链页标题、申请提示和本站友链信息。
                  </p>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-neutral-200/70 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <input type="checkbox" name="friendApplyEnabled" value="true" defaultChecked={settings.friendApplyEnabled} className="mt-1 size-4 rounded border-neutral-300 text-neutral-950" />
                  <span>
                    <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      开放友链申请
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-neutral-400">
                      关闭后前台隐藏申请入口，直接提交申请也会被拒绝。
                    </span>
                  </span>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="友链页标题">
                    <input name="friendPageTitle" className={inputClassName} defaultValue={settings.friendPageTitle} />
                  </SettingsField>

                  <SettingsField label="本站友链名称">
                    <input name="friendOwnName" className={inputClassName} defaultValue={settings.friendOwnName} />
                  </SettingsField>

                  <SettingsField label="本站友链链接">
                    <input name="friendOwnUrl" className={inputClassName} defaultValue={settings.friendOwnUrl} />
                  </SettingsField>

                  <SettingsField label="本站友链头像">
                    <input name="friendOwnAvatarUrl" className={inputClassName} defaultValue={settings.friendOwnAvatarUrl} />
                  </SettingsField>
                </div>

                <SettingsField label="友链页描述">
                  <textarea name="friendPageDescription" className={textareaClassName} defaultValue={settings.friendPageDescription} />
                </SettingsField>

                <SettingsField label="申请说明">
                  <textarea name="friendApplyIntro" className={textareaClassName} defaultValue={settings.friendApplyIntro} />
                </SettingsField>

                <SettingsField label="申请确认事项" description="每行一条，最多 10 条。">
                  <textarea name="friendApplyNotes" className={textareaClassName} defaultValue={joinLines(settings.friendApplyNotes)} />
                </SettingsField>

                <SettingsField label="本站友链描述">
                  <textarea name="friendOwnDescription" className={textareaClassName} defaultValue={settings.friendOwnDescription} />
                </SettingsField>

                <SettingsField label="申请成功文案">
                  <textarea name="friendApplySuccessMessage" className={textareaClassName} defaultValue={settings.friendApplySuccessMessage} />
                </SettingsField>
              </section>

            <section className={`space-y-5 ${activeTab === "footer" ? "" : "hidden"}`}>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    页脚
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    配置站点页脚展示文案。
                  </p>
                </div>

                <SettingsField label="页脚描述" description="显示在页脚站点名称下方。">
                  <textarea name="footerDescription" className={textareaClassName} defaultValue={settings.footerDescription} />
                </SettingsField>

                <SettingsField label="状态文案" description="显示在页脚绿色状态点旁边。">
                  <input name="footerStatusText" className={inputClassName} defaultValue={settings.footerStatusText} />
                </SettingsField>
              </section>

            <section className={`space-y-5 ${activeTab === "admin" ? "" : "hidden"}`}>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    后台偏好
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    先保存后台默认偏好，列表页会后续逐步接入。
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <SettingsField label="每页显示数量" description="后台列表页默认分页数量。">
                    <select name="adminPageSize" className={inputClassName} defaultValue={String(settings.adminPageSize)}>
                      <option value="5">5 条</option>
                      <option value="10">10 条</option>
                      <option value="20">20 条</option>
                    </select>
                  </SettingsField>

                  <SettingsField label="默认后台入口" description="登录后台后优先进入的页面。">
                    <select name="adminDefaultEntry" className={inputClassName} defaultValue={settings.adminDefaultEntry}>
                      <option value="/admin">仪表盘</option>
                      <option value="/admin/writings">文稿管理</option>
                      <option value="/admin/notes">手记管理</option>
                      <option value="/admin/comments">评论管理</option>
                      <option value="/admin/messages">留言管理</option>
                      <option value="/admin/projects">项目管理</option>
                      <option value="/admin/friends">友链管理</option>
                      <option value="/admin/settings">设置</option>
                    </select>
                  </SettingsField>
                </div>
              </section>

            <div className="flex flex-col gap-3 border-t border-neutral-200/70 pt-8 dark:border-white/10 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => formRef.current?.reset()}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white/70 px-5 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
              >
                重置
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-950"
              >
                {isPending ? "保存中..." : "保存设置"}
              </button>
            </div>
          </div>
        </form>
      </AdminContentPanel>
    </div>
  );
}
