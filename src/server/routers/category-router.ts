import { db } from '@/db'
import { router } from '../__internals/router'
import { privateProcedure } from '../procedures'
import { startOfMonth } from 'date-fns'
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
})
