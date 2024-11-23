// clsx 用于根据条件生成一组类名
import { type ClassValue, clsx } from 'clsx'
// 用于合并 Tailwind CSS 类名。它会优先处理 Tailwind CSS 中的冲突类
import { twMerge } from 'tailwind-merge'

/**
 * 合并并优化传入的类名数组
 *
 * @param {ClassValue[]} inputs - 传入的类名数组，支持字符串、对象、数组等格式的条件类名。
 * @description 使用 clsx 和 tailwind-merge 来合并类名，自动处理 Tailwind CSS 类名冲突，
 *              保留最后一个冲突类，从而得到优化后的类名字符串。
 * @returns {string} 返回优化后的类名字符串。
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 *
 * @param color
 * @description 将颜色值转换为带 # 前缀的十六进制颜色值
 * @returns
 */
export function parseColor(color: string) {
  const hex = color.startsWith('#') ? color.slice(1) : color

  return parseInt(hex, 16)
}
