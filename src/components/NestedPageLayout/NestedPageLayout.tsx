import clsx from "clsx"
import { GoBackLink } from "components"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export const NestedPageLayout = ({ className, children }: LayoutProps) => {
  return (
    <div className="flex h-screen">
      <div className="flex grow flex-col items-center justify-center">
        <div
          className={clsx(
            "w-full bg-zinc-900 py-5 lg:rounded-md min-[1200px]:h-full min-[1200px]:max-h-[80%] min-[1200px]:w-[90%] 2xl:w-2/3",
            className
          )}>
          {children}
        </div>
        <GoBackLink className="fixed bottom-4 left-4" />
      </div>
    </div>
  )
}
