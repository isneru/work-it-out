import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { Spinner, WorkoutView } from "components"
import { AnimatePresence, motion } from "framer-motion"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"
import { variants } from "utils/motion"

interface WorkoutFeedProps {}

export const WorkoutFeed = (props: WorkoutFeedProps) => {
  const { data, isLoading } = api.workouts.getAll.useQuery()

  const { isSignedIn } = useUser()

  if (isLoading)
    return (
      <aside className="use-scroll flex w-[400px] flex-col items-center justify-center bg-zinc-900 p-5">
        <Spinner className="flex grow" width={40} height={40} />
        {isSignedIn ? <LogoutButton /> : <LoginButton />}
      </aside>
    )

  return (
    <aside className="flex w-[400px] flex-col items-center gap-2 bg-zinc-900 py-5 pl-5 pr-2">
      <div className="use-scroll flex w-full grow flex-col items-center gap-2 overflow-y-scroll">
        <AnimatePresence>
          {[...data!, ...data!, ...data!]?.map((fullWorkout, index) => (
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
      </div>
      {isSignedIn ? <LogoutButton /> : <LoginButton />}
    </aside>
  )
}

const LoginButton = () => {
  return (
    <footer className="flex w-full items-center justify-center bg-zinc-900 pr-3">
      <SignInButton mode="modal">
        <button className="use-shadow w-full rounded bg-black py-2 font-medium">
          Sign In
        </button>
      </SignInButton>
    </footer>
  )
}

const LogoutButton = () => {
  return (
    <footer className="flex w-full items-center justify-center bg-zinc-900 pr-3">
      <SignOutButton>
        <button className="use-shadow w-full rounded bg-black py-2 font-medium">
          Sign Out
        </button>
      </SignOutButton>
    </footer>
  )
}
