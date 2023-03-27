import clsx from "clsx"

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  asPage?: boolean
}

export const Spinner = ({ asPage = false, ...props }: SpinnerProps) => {
  return (
    <div
      className={clsx({
        "absolute top-0 right-0 flex h-screen w-screen items-center justify-center":
          asPage
      })}
      role="status">
      <svg
        aria-hidden="true"
        width={20}
        height={20}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}>
        <g className="spinner origin-center">
          <circle cx={12} cy={12} r="9.5" fill="none" strokeWidth={2} />
        </g>
      </svg>
      <span className="sr-only">loading...</span>
    </div>
  )
}
