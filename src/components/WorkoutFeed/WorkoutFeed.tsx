import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { Spinner, WorkoutView } from "components"
import { AnimatePresence, motion } from "framer-motion"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"
import { variants } from "utils/motion"

interface WorkoutFeedProps {}

export const WorkoutFeed = (props: WorkoutFeedProps) => {
  const { data, isLoading } = api.workouts.getAll.useQuery()

  if (isLoading)
    return (
      <div className="relative flex w-[400px] flex-col items-center justify-center bg-zinc-900 py-5">
        <Spinner width={40} height={40} />
        <AuthButton />
      </div>
    )

  return (
    <div className="use-scroll relative flex w-[400px] flex-col items-center gap-2 overflow-y-scroll bg-zinc-900 py-5 pl-4 pr-2">
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
      <AuthButton />
    </div>
  )
}

const AuthButton = () => {
  const { isSignedIn } = useUser()

  return (
    <div className="fixed bottom-0 left-0 w-[400px] bg-zinc-900 px-2 pb-5 pt-3">
      {isSignedIn && (
        <SignOutButton>
          <button className="use-shadow mt-auto w-full rounded py-2 font-medium">
            Sign Out
          </button>
        </SignOutButton>
      )}
      {!isSignedIn && (
        <SignInButton mode="modal">
          <button className="use-shadow mt-auto w-full rounded py-2 font-medium">
            Sign In
          </button>
        </SignInButton>
      )}
    </div>
  )
}
