import { cn } from '@/utils'

interface MaxWidthWrapparProps {
  className?: string
  children: React.ReactNode
}

export const MaxWidthWrappar = ({
  className,
  children,
}: MaxWidthWrapparProps) => {
  return (
    <div
      className={cn(
        'w-full h-full mx-auto max-w-screen-xl px-2.5 md:px-20',
        className || ''
      )}
    >
      {children}
    </div>
  )
}
