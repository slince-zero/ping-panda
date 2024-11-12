/**
 * Hono 是一个轻量级的 TypeScript 后端框架，适用于边缘环境（如 Vercel、Cloudflare Workers)
 */
import { Hono } from "hono" // 核心类，用于创建应用实例，可以定义路由和中间件
import { cors } from "hono/cors" // Hono 提供的跨域资源共享（CORS）中间件，用于允许或限制来自不同源的请求
import { handle } from "hono/vercel" // Vercel 适配器，专门用于将 Hono 应用部署在 Vercel 的边缘环境中
import { authRouter } from "./routers/auth-router" // 定义了与身份验证相关的路由和逻辑

const app = new Hono().basePath("/api").use(cors())

/**
 * 定义主路由
 *
 * 如果 authRouter 中定义了一个 /login 路由，那么完整路径就是 /api/auth/login
 */
const appRouter = app.route("/auth", authRouter)

/** 用于将 Hono 应用作为一个 Vercel 边缘函数来处理 HTTP 请求 */
export const httpHandler = handle(app)

/**
 * (可选)
 * 
 *
 * 这种导出方式也便于在其他环境（如 Cloudflare）中复用相同的代码，简化了部署流程
 */
export default app

/** 利用 TypeScript 的 typeof 关键字来推断 appRouter 的类型并导出，这样做的好处是，在其他地方使用 AppType 类型时，可以获得当前路由定义的类型提示和接口限制 */
export type AppType = typeof appRouter
