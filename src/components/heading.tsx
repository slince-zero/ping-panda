import { cn } from '@/utils'
import { HTMLAttributes } from 'react'

interface HeadingPorps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const Heading = ({ children, className, ...props }: HeadingPorps) => {
  return (
    <h1
      className={cn(
        'text-[2.15rem] sm:text-5xl tracking-tight text-pretty font-heading font-semibold text-zinc-800',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
