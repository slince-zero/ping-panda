import { db } from '@/db'
import { router } from '../__internals/router'
import { privateProcedure } from '../procedures'
import { startOfMonth } from 'date-fns'
import { z } from 'zod'
import { parseColor } from '@/utils'
import {
  CATEGORY_COLOR_VALIDATOR,
  CATEGORY_EMOJI_VALIDATOR,
  CATEGORY_NAME_VALIDATOR,
} from '@/lib/validators/category-validators'

export const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const categories = await db.eventCategory.findMany({
      where: { userId: ctx.user.id },
      select: {
        id: true,
        name: true,
        color: true,
        emoji: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const categoriesWithCounts = await Promise.all(
      categories.map(async (categories) => {
        const now = new Date()
        const fistDayOfMonth = startOfMonth(now)

        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          db.event
            .findMany({
              where: {
                EventCategory: { id: categories.id },
                createdAt: { gte: fistDayOfMonth },
              },
              select: { fields: true },
              distinct: ['fields'],
            })
            .then((events) => {
              const fieldNames = new Set<string>()
              events.forEach((event) => {
                Object.keys(event.fields as object).forEach((filedName) => {
                  fieldNames.add(filedName)
                })
              })

              return fieldNames.size
            }),
          db.event.count({
            where: {
              EventCategory: { id: categories.id },
              createdAt: { gte: fistDayOfMonth },
            },
          }),
          db.event.findFirst({
            where: { EventCategory: { id: categories.id } },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
          }),
        ])

        return {
          ...categories,
          uniqueFieldCount,
          eventsCount,
          lastPing: lastPing?.createdAt || null,
        }
      })
    )

    return c.superjson({ categories: categoriesWithCounts })
  }),

  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ c, input, ctx }) => {
      const { name } = input

      await db.eventCategory.delete({
        /**
         * name_userId 复合字段，由两个字段 name 和 userId 组成，通常用于确保数据的唯一性以及优化查询性能
         * 类似 DELETE FROM eventCategory WHERE name = "Music" AND userId = 123;
         */
        where: { name_userId: { name, userId: ctx.user.id } },
      })

      return c.json({ success: true })
    }),

  createEventCategory: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: CATEGORY_COLOR_VALIDATOR,
        emoji: CATEGORY_EMOJI_VALIDATOR,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx
      const { color, name, emoji } = input

      // TODO: ADD PAID PLAN LOGIC

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          userId: user.id,
        },
      })

      return c.json({ eventCategory })
    }),
})
