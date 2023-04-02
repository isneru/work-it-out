import { SignInButton, SignOutButton } from "@clerk/nextjs"
import { Workout } from "@prisma/client"
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import {
  SharedAuthButtonProps,
  SharedSidebarProps,
  Spinner,
  WorkoutView
} from "components"
import { AnimatePresence, motion } from "framer-motion"
import { dayjs } from "utils/dayjs"
import { variants } from "utils/motion"

interface OpenSidebarProps extends SharedSidebarProps {
  data:
    | {
        workout: Workout
        owner: {
          id: string
          username: string
          profileImageUrl: string
        }
      }[]
    | undefined
  isLoading: boolean
}

export const OpenSidebar = ({
  toggleSidebar,
  isSidebarOpen,
  isSignedIn,
  data,
  isLoading
}: OpenSidebarProps) => {
  return (
    <div className="absolute inset-0 flex h-full flex-col gap-2 bg-zinc-900 p-3 lg:static lg:w-[400px]">
      <button
        className="w-fit rounded p-2 transition-colors hover:bg-white/5"
        onClick={toggleSidebar}>
        {isSidebarOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
      </button>
      <div className="use-scroll flex w-full grow flex-col items-center gap-2 overflow-y-scroll">
        {isLoading ? (
          <Spinner width={40} height={40} />
        ) : (
          <AnimatePresence>
            {data?.map((fullWorkout, index) => (
              <motion.div
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.2,
                  delay:
                    dayjs(fullWorkout.workout.createdAt).fromNow() ===
                    "a few seconds ago"
                      ? 0
                      : index * 0.06
                }}
                className="w-full"
                key={fullWorkout.workout.id}>
                <WorkoutView data={fullWorkout} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <AuthButton isSignedIn={isSignedIn}>
        <button className="w-full rounded bg-black p-2">
          {isSignedIn ? "Sign Out" : "Sign In"}
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
