import Link from "next/link"

interface ErrorPageProps {}

export const ErrorPage = (props: ErrorPageProps) => {
  return (
    <div className="absolute top-0 right-0 flex h-screen w-screen flex-col items-center justify-center text-3xl">
      404
      <Link className="underline" href="/">
        Go Back
      </Link>
    </div>
  )
}
