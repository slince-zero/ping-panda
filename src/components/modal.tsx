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
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

interface ModalProps {
  name: string
  setDeletingCategory: (categoryName: string | null) => void
  deletingCategory: string | null
  deleteCategory: (categoryName: string) => void
  isDeletingCategory: boolean
}

export const Modal = ({
  name,
  setDeletingCategory,
  deletingCategory,
  deleteCategory,
  isDeletingCategory,
}: ModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-red-600 transition-colors"
          aria-label={`Delete ${name} category`}
          onClick={() => setDeletingCategory(name)}
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
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            type="button"
            onClick={() => deletingCategory && deleteCategory(deletingCategory)}
            disabled={isDeletingCategory}
          >
            {isDeletingCategory ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
