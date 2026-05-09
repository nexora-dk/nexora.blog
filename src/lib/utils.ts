// clsx 负责把条件 className 合并成字符串，ClassValue 用于保留它的参数类型。
import { clsx, type ClassValue } from "clsx"
// tailwind-merge 负责解决 Tailwind 同类工具类冲突，例如多个 padding 或颜色类只保留最终结果。
import { twMerge } from "tailwind-merge"

/**
 * 合并 className 的通用工具：先处理条件类名，再用 Tailwind 规则消除冲突。
 */
export function cn(...inputs: ClassValue[]) {
  // clsx 会过滤 falsy 值并拼接类名，twMerge 会让后出现的 Tailwind 类覆盖前面的同类类名。
  return twMerge(clsx(inputs))
}
