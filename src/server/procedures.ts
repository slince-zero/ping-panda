import { db } from '@/db'
import { j } from './__internals/j'
import { currentUser } from '@clerk/nextjs/server'
import { HTTPException } from 'hono/http-exception'

/**
 * 定义身份验证的中间件函数
 * @param next - 下一个中间件函数
 * @param c - 当前上下文,包含请求和响应等信息
 */
const authMiddleware = j.middleware(async ({ next, c }) => {
  const authHeader = c.req.header('Authorization')

  if (authHeader) {
    const apiKey = authHeader.split(' ')[1] // bearer <API_KEY>

    const user = await db.user.findUnique({
      where: { apiKey },
    })

    if (user) return next({ user })
  }

  const auth = await currentUser()

  if (!auth) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
  return next({ user })
})
/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
/**
 * 私有（已验证）过程
 * 利用中间件函数 authMiddleware 来验证用户身份（APIkey或者首次登录）
 */
export const privateProcedure = publicProcedure.use(authMiddleware)
