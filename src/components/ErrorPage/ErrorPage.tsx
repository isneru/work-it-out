import { GoBackLink } from "components/GoBackLink"

interface ErrorPageProps {}

export const ErrorPage = (props: ErrorPageProps) => {
  return (
    <div className="absolute top-0 right-0 flex h-screen w-screen flex-col items-center justify-center gap-1">
      <p className="text-3xl">Page not found</p>
      <GoBackLink goHome />
    </div>
  )
}
