"use client";

// Client Component：需要使用状态、Effect、Portal 和浏览器 document，因此必须在首行保留 use client。
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// fields 定义弹窗表单的输入项名称，后续通过 map 生成多行 label/input。
const fields = ["名称", "链接", "头像", "描述"];

// 组件 props 仅允许外部覆盖触发按钮样式，保持弹窗行为由组件内部管理。
type AddFriendLinkDialogProps = {
  buttonClassName?: string;
};

// AddFriendLinkDialog 负责展示“添加友链”按钮，并在点击后打开居中的 Portal 弹窗。
export function AddFriendLinkDialog({ buttonClassName }: AddFriendLinkDialogProps) {
  // open 控制弹窗是否渲染，同时驱动页面滚动锁定副作用。
  const [open, setOpen] = useState(false);

  // 弹窗打开时锁定 html/body 滚动，关闭或卸载时恢复原始 overflow。
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

  return (
    <>
      {/* 页面内的触发按钮区域，默认居中展示，可通过 props 注入 className。 */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={buttonClassName ?? "group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 py-1.5 pl-5 pr-1.5 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/55 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-50"}
        >
          添加你的友链
          {/* 加号胶囊承担视觉提示，aria-hidden 避免重复读出装饰内容。 */}
          <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-xs text-white transition group-hover:translate-x-0.5 dark:bg-neutral-50 dark:text-neutral-950" aria-hidden="true">
            +
          </span>
        </button>
      </div>

      {/* 条件渲染：只有 open 为 true 时才创建 Portal 弹窗，否则不向 DOM 注入内容。 */}
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[2147483647] grid place-items-center overflow-y-auto bg-neutral-950/75 px-5 py-10 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-friend-link-title">
              {/* 弹窗主体卡片承载标题、关闭按钮和申请表单。 */}
              <div className="w-full max-w-lg rounded-[1.5rem] bg-white p-6 shadow-2xl dark:bg-neutral-950 dark:ring-1 dark:ring-white/10">
                <div className="flex items-center justify-between gap-4">
                  <h2 id="add-friend-link-title" className="text-base font-medium text-neutral-950 dark:text-neutral-50">
                    添加友链
                  </h2>
                  {/* 关闭按钮仅修改 open 状态，不提交任何表单数据。 */}
                  <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50" aria-label="关闭添加友链面板">
                    <X className="size-5" />
                  </button>
                </div>

                {/* 表单当前只负责收集展示字段，没有绑定提交逻辑。 */}
                <form className="mt-8 space-y-5">
                  {/* 循环渲染四个输入项，首个输入框通过 index 自动聚焦。 */}
                  {fields.map((field, index) => (
                    <label key={field} className="grid items-center gap-4 text-sm text-neutral-700 sm:grid-cols-[4.5rem_1fr] dark:text-neutral-300">
                      <span>{field}</span>
                      <input autoFocus={index === 0} className="h-10 rounded-full border border-neutral-200 bg-neutral-50 px-4 text-neutral-900 caret-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:caret-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600 dark:focus:bg-neutral-900" />
                    </label>
                  ))}

                  {/* 底部操作区放置确认按钮，目前保持按钮类型为 button 避免默认提交。 */}
                  <div className="flex justify-end pt-5">
                    <button type="button" className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-neutral-50 dark:text-neutral-950">
                      确认添加
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
