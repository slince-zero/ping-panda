import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  // 生产环境，每次创建新的 Prisma 客户端实例，使用连接池与数据库进行高效通信
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.cachedPrisma) {
    // 开发环境，利用 global.cachedPrisma 缓存 Prisma 客户端实例，以减少热重载时不必要的实例创建
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaNeon(pool)
    global.cachedPrisma = new PrismaClient({ adapter })
  }
  prisma = global.cachedPrisma
}

/**
 * 将生产环境与开发环境分开
 * 
 * 性能优化：在开发环境中，每次热重载都会重新加载整个应用，这会导致 Prisma 客户端实例的多次创建。如果每次都创建新的 Prisma 实例，可能会导致数据库连接池反复重建，浪费连接资源并增加不必要的开销。通过在开发环境中缓存 Prisma 客户端实例，可以避免这个问题，提高开发效率。
 * 
 * 生产环境下的稳定性：在生产环境中，我们不缓存 Prisma 实例，因为生产环境通常需要一个干净的数据库连接池，不希望受到开发模式缓存的影响。每次请求都使用新的 Prisma 客户端实例，以确保连接池的高效管理。
 */
export const db = prisma
