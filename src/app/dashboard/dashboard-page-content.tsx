'use client'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { client } from '@/lib/client'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import {
  ArrowRight,
  BarChart2,
  Clock,
  Database,
  Link,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

export const DashboardPageContent = () => {
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: categories, isPending: isEventCategoriesLoading } = useQuery({
    queryKey: ['user-event-categories'],
    queryFn: async () => {
      const res = await client.category.getEventCategories.$get()
      const { categories } = await res.json()
      return categories
    },
  })

  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        await client.category.deleteCategory.$post({ name })
      },
      onSuccess: () => {
        // 重新获取数据
        queryClient.invalidateQueries({ queryKey: ['user-event-categories'] })
        // 防止置空之后，dialog 还没关闭，依然显示内容
        // setDeletingCategory(null)
      },
    }
  )

  if (isEventCategoriesLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return <div>empty categories</div>
  }

  return (
    <ul className="grid max-w-6xl pl-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {categories.map((category) => (
        <li
          key={category.id}
          className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="absolute z-0 inset-px rounded-lg bg-white" />

          <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5" />

          <div className="relative p-6 z-10">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="size-12 rounded-full"
                style={{
                  backgroundColor: category.color
                    ? `#${category.color.toString(16).padStart(6, '0')}`
                    : '#f3f4f6',
                }}
              />

              <div>
                <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                  {category.emoji || '📂'} {category.name}
                </h3>
                <p className="text-sm/6 text-gray-600">
                  {format(category.createdAt, 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm/5 text-gray-600">
                <Clock className="size-4 mr-2 text-brand-500" />
                <span className="font-medium">Last ping:</span>
                <span className="ml-1">
                  {category.lastPing
                    ? formatDistanceToNow(category.lastPing) + ' ago'
                    : 'Never'}
                </span>
              </div>
              <div className="flex items-center text-sm/5 text-gray-600">
                <Database className="size-4 mr-2 text-brand-500" />
                <span className="font-medium">Unique fields:</span>
                <span className="ml-1">{category.uniqueFieldCount || 0}</span>
              </div>
              <div className="flex items-center text-sm/5 text-gray-600">
                <BarChart2 className="size-4 mr-2 text-brand-500" />
                <span className="font-medium">Events this month:</span>
                <span className="ml-1">{category.eventsCount || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div
                // href={`/dashboard/category/${category.name}`}
                className={buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'cursor-pointer flex  items-center gap-2 text-sm',
                })}
              >
                View all
                <ArrowRight className="size-4" />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    aria-label={`Delete ${category.name} category`}
                    onClick={() => setDeletingCategory(category.name)}
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <br />
                    <DialogDescription>
                      Are you sure you want to delete the category &nbsp;
                      {<span className="text-red-600">{deletingCategory}</span>}
                      &nbsp;? This action
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => setDeletingCategory(null)}
                      >
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() =>
                        deletingCategory && deleteCategory(deletingCategory)
                      }
                      disabled={isDeletingCategory}
                    >
                      {isDeletingCategory ? 'Deleting...' : 'Delete'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
