'use client'
import { PropsWithChildren, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CATEGORY_EMOJI_VALIDATOR,
  CATEGORY_NAME_VALIDATOR,
  CATEGORY_COLOR_VALIDATOR,
} from '@/lib/validators/category-validators'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils'
import { client } from '@/lib/client'

const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: CATEGORY_COLOR_VALIDATOR,
  emoji: CATEGORY_EMOJI_VALIDATOR,
})

const COLOR_OPTIONS = [
  '#FF6B6B', // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
  '#4ECDC4', // bg-[#4ECDC4] ring-[#4ECDC4] Teal
  '#45B7D1', // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
  '#FFA07A', // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
  '#98D8C8', // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
  '#FDCB6E', // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
  '#6C5CE7', // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
  '#FF85A2', // bg-[#FF85A2] ring-[#FF85A2] Pink
  '#2ECC71', // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
  '#E17055', // bg-[#E17055] ring-[#E17055] Terracotta
]

const EMOJI_OPTIONS = [
  { emoji: '💰', label: 'Money (Sale)' },
  { emoji: '👤', label: 'User (Sign-up)' },
  { emoji: '🎉', label: 'Celebration' },
  { emoji: '📅', label: 'Calendar' },
  { emoji: '🚀', label: 'Launch' },
  { emoji: '📢', label: 'Announcement' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '🏆', label: 'Achievement' },
  { emoji: '💡', label: 'Idea' },
  { emoji: '🔔', label: 'Notification' },
]

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

export const CreateEventCategoryModal = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createEventCategory, isPending } = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      await client.category.createEventCategory.$post(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user-event-categories'],
      })
      setIsOpen(false)
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
  })

  const color = watch('color')
  const selectedEmoji = watch('emoji')
  const onSubmit = (data: EventCategoryForm) => {
    createEventCategory(data)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>
            <PlusIcon className="size04 mr-2" /> Add Category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your events.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                autoFocus
                id="name"
                {...register('name')}
                className="mt-1w-full"
                placeholder="e.g. name"
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* color */}
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((preColor) => (
                  <button
                    key={preColor}
                    type="button"
                    className={cn(
                      `bg-[${preColor}] `,
                      'size-10 rounded-full mx-1 ring-1 ring-offset-1 transition-all',
                      color === preColor
                        ? `ring-[${preColor}] scale-110`
                        : 'ring-transparent hover:scale-105'
                    )}
                    onClick={() => setValue('color', preColor)}
                  />
                ))}
              </div>
              {errors.color && (
                <span className="text-red-500">{errors.color.message}</span>
              )}
            </div>

            {/* emoji */}
            <div>
              <Label htmlFor="Emoji">Emoji</Label>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {EMOJI_OPTIONS.map(({ emoji, label }) => (
                    <Tooltip key={emoji}>
                      <TooltipTrigger>
                        <button
                          type="button"
                          className={cn(
                            'size-10 flex items-center justify-center text-xl rounded-md transition-all',
                            selectedEmoji === emoji
                              ? 'bg-brand-100 ring-2 ring-brand-700 scale-110'
                              : 'bg-brand-100 hover:bg-brand-200'
                          )}
                          onClick={() => setValue('emoji', emoji)}
                        >
                          {emoji}
                        </button>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>{label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
              {errors.emoji && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emoji.message}
                </p>
              )}
            </div>

            {/* actions */}
            <DialogFooter className="flex justify-between space-x-3 pt-4 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                {isPending ? 'Creating...' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
