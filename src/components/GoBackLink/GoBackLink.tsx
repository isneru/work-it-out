import { ResetIcon } from "@radix-ui/react-icons"
import clsx from "clsx"
import { useRouter } from "next/router"
import { ButtonHTMLAttributes } from "react"

interface GoBackLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  goHome?: boolean
}

export const GoBackLink = ({
  goHome = false,
  className,
  ...props
}: GoBackLinkProps) => {
  const router = useRouter()

  function handleRedirect() {
    goHome ? router.push("/") : router.back()
  }

  return (
    <button
      type="button"
      className={clsx(
        "use-shadow flex items-center justify-center gap-2 rounded-full bg-white/10 py-1 px-3 transition-colors hover:bg-white/[0.12]",
        className
      )}
      onClick={handleRedirect}
      {...props}>
      <ResetIcon /> Go back
    </button>
  )
}
