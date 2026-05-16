"use client";

import { useState } from "react";
import { Settings } from "lucide-react";

import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type SettingsFieldProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

function SettingsField({ label, description, children }: SettingsFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
        {label}
      </span>
      {description ? (
        <span className="text-xs leading-5 text-neutral-400">
          {description}
        </span>
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
  { key: "site", label: "站点信息" },
  { key: "seo", label: "SEO 信息" },
  { key: "social", label: "社交链接" },
  { key: "admin", label: "后台偏好" },
] as const;

type SettingTabKey = (typeof settingTabs)[number]["key"];

export function AdminSettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingTabKey>("site");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="设置"
        description="管理站点信息、SEO、社交链接和后台偏好。"
        icon={Settings}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
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
          {activeTab === "site" ? (
            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                  站点信息
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  配置博客的基础展示信息。
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SettingsField
                  label="站点名称"
                  description="显示在导航、浏览器标题和分享信息中。"
                >
                  <input
                    className={inputClassName}
                    defaultValue="Nexora's Space"
                    placeholder="请输入站点名称"
                  />
                </SettingsField>

                <SettingsField
                  label="作者名称"
                  description="用于首页、页脚和后台展示。"
                >
                  <input
                    className={inputClassName}
                    defaultValue="Nexora"
                    placeholder="请输入作者名称"
                  />
                </SettingsField>

                <SettingsField
                  label="头像地址"
                  description="建议使用站内图片路径或稳定的远程图片链接。"
                >
                  <input
                    className={inputClassName}
                    defaultValue="/images/avatar/avatar.jpg"
                    placeholder="请输入头像地址"
                  />
                </SettingsField>

                <SettingsField label="联系邮箱" description="用于前台展示或后续通知。">
                  <input
                    className={inputClassName}
                    defaultValue="codernexora@foxmail.com"
                    placeholder="请输入联系邮箱"
                  />
                </SettingsField>
              </div>

              <SettingsField
                label="站点描述"
                description="用于页面描述、SEO 和分享卡片。"
              >
                <textarea
                  className={textareaClassName}
                  defaultValue="一个爱捣鼓的前端"
                  placeholder="请输入站点描述"
                />
              </SettingsField>
            </section>
          ) : null}

          {activeTab === "seo" ? (
            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                  SEO 信息
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  配置搜索引擎和分享时使用的默认信息。
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SettingsField label="标题模板" description="子页面标题会套用这个模板。">
                  <input
                    className={inputClassName}
                    defaultValue="%s | Nexora's Space"
                    placeholder="请输入标题模板"
                  />
                </SettingsField>

                <SettingsField label="默认关键词" description="多个关键词可以用英文逗号分隔。">
                  <input
                    className={inputClassName}
                    defaultValue="Next.js, React, Frontend, Blog"
                    placeholder="请输入默认关键词"
                  />
                </SettingsField>
              </div>

              <SettingsField label="默认描述" description="当页面没有单独描述时使用。">
                <textarea
                  className={textareaClassName}
                  defaultValue="Nexora's Space 是一个记录前端、生活、思考和长期成长的个人博客。"
                  placeholder="请输入默认 SEO 描述"
                />
              </SettingsField>
            </section>
          ) : null}

          {activeTab === "social" ? (
            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                  社交链接
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  配置前台展示的外部账号和联系方式。
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SettingsField label="GitHub" description="个人 GitHub 主页地址。">
                  <input
                    className={inputClassName}
                    defaultValue="https://github.com/Nexora-ydk"
                    placeholder="请输入 GitHub 地址"
                  />
                </SettingsField>

                <SettingsField label="Email" description="公开联系邮箱。">
                  <input
                    className={inputClassName}
                    defaultValue="codernexora@foxmail.com"
                    placeholder="请输入邮箱地址"
                  />
                </SettingsField>

                <SettingsField label="RSS" description="RSS 订阅地址，后续生成 RSS 时使用。">
                  <input
                    className={inputClassName}
                    defaultValue="/rss.xml"
                    placeholder="请输入 RSS 地址"
                  />
                </SettingsField>

                <SettingsField label="个人主页" description="站点主域名或个人主页地址。">
                  <input
                    className={inputClassName}
                    defaultValue="https://nexora.space"
                    placeholder="请输入主页地址"
                  />
                </SettingsField>
              </div>
            </section>
          ) : null}

          {activeTab === "admin" ? (
            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                  后台偏好
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  配置后台管理页面的默认展示习惯。
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SettingsField label="每页显示数量" description="后台列表页默认分页数量。">
                  <select className={inputClassName} defaultValue="5">
                    <option value="5">5 条</option>
                    <option value="10">10 条</option>
                    <option value="20">20 条</option>
                  </select>
                </SettingsField>

                <SettingsField label="默认后台入口" description="登录后台后优先进入的页面。">
                  <select className={inputClassName} defaultValue="/admin/writings">
                    <option value="/admin">仪表盘</option>
                    <option value="/admin/writings">文稿管理</option>
                    <option value="/admin/comments">评论管理</option>
                    <option value="/admin/messages">留言管理</option>
                  </select>
                </SettingsField>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    label: "开启评论",
                    description: "允许用户在文稿和手记下发表评论。",
                  },
                  {
                    label: "开启留言",
                    description: "允许用户在留言页发布站点留言。",
                  },
                  {
                    label: "显示相册",
                    description: "在前台导航和页面中展示相册入口。",
                  },
                  {
                    label: "显示友链",
                    description: "在前台展示友链页面和相关入口。",
                  },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl border border-neutral-200/70 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 size-4 rounded border-neutral-300 text-neutral-950"
                    />
                    <span>
                      <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-neutral-400">
                        {item.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-neutral-200/70 pt-8 dark:border-white/10 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white/70 px-5 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
            >
              重置
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 dark:bg-neutral-100 dark:text-neutral-950"
            >
              保存设置
            </button>
          </div>
        </div>
      </AdminContentPanel>
    </div>
  );
}
