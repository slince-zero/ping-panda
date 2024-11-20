import { ArrowLeft } from 'lucide-react'
import { Heading } from './heading'
import { Button } from './ui/button'

interface DashboardPageProps {
  title: string
  children?: React.ReactNode
  hiddenBackButton?: boolean
  cta?: React.ReactNode
}

export const DashboardPage = ({
  title,
  children,
  hiddenBackButton,
  cta,
}: DashboardPageProps) => {
  return (
    <section className="flex-1 flex flex-col h-full w-full ">
      <>
        <div className="p-6 sm:p-8 flex justify-between border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-8">
            {hiddenBackButton ? null : (
              <Button className="w-fit" variant="outline">
                <ArrowLeft className="size-4" />
              </Button>
            )}

            <Heading>{title}</Heading>
          </div>
          {cta ? <div className="w-full">{cta}</div> : null}
        </div>
      </>
      <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
        {children}
      </div>
    </section>
  )
}
