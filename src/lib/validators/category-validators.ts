import { z } from 'zod'

/**
 * 定义分类名称验证器
 */
export const CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, 'Category name is required')
  .regex(
    /^[a-zA-Z0-9-]+$/, // 正则表达式，只允许字母、数字和连字符
    'Category name can only contain letters, numbers or hypens'
  )

/**
 * 定义分类颜色验证器
 */
export const CATEGORY_COLOR_VALIDATOR = z
  .string()
  .min(1, 'Color is required')
  .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format.')

/**
 * 定义分类 emoji 验证器
 */
export const CATEGORY_EMOJI_VALIDATOR = z
  .string()
  .emoji('Invalid emoji')
  .optional()
