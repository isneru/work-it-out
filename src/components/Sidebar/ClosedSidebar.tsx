import { SignInButton, SignOutButton } from "@clerk/nextjs"
import {
  Cross1Icon,
  EnterIcon,
  ExitIcon,
  HamburgerMenuIcon
} from "@radix-ui/react-icons"
import { SharedAuthButtonProps, SharedSidebarProps } from "components"

export const ClosedSidebar = ({
  toggleSidebar,
  isSidebarOpen,
  isSignedIn
}: SharedSidebarProps) => {
  return (
    <div className="flex h-full flex-col bg-zinc-900 p-3">
      <button
        className="rounded p-2 transition-colors hover:bg-white/5"
        onClick={toggleSidebar}>
        {isSidebarOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
      </button>
      <AuthButton isSignedIn={isSignedIn}>
        <button className="rounded bg-black p-2">
          {isSignedIn ? <ExitIcon /> : <EnterIcon />}
        </button>
      </AuthButton>
    </div>
  )
}

const AuthButton = ({ isSignedIn, children }: SharedAuthButtonProps) => {
  return (
    <>
      {isSignedIn && (
        <footer className="mt-auto">
          <SignOutButton>{children}</SignOutButton>
        </footer>
      )}
      {!isSignedIn && (
        <footer className="mt-auto">
          <SignInButton mode="modal">{children}</SignInButton>
        </footer>
      )}
    </>
  )
}
