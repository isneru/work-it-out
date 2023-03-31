import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import {
  Cross1Icon,
  EnterIcon,
  ExitIcon,
  HamburgerMenuIcon
} from "@radix-ui/react-icons"
import clsx from "clsx"
import { Spinner, WorkoutView } from "components"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"
import { variants } from "utils/motion"

interface WorkoutFeedProps {}

export const WorkoutFeed = (props: WorkoutFeedProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data, isLoading } = api.workouts.getAll.useQuery()
  const { isSignedIn } = useUser()

  console.log(isLoading)

  return (
    <div className="flex h-screen">
      {/* desktop */}
      <aside
        className={clsx("hidden bg-zinc-900 py-3 lg:flex", {
          "flex w-[400px] flex-col gap-2 bg-zinc-900": isSidebarOpen
        })}>
        <div
          className={clsx("px-3", {
            "flex h-full flex-col": !isSidebarOpen
          })}>
          <button
            className="rounded p-2 transition-colors hover:bg-white/5"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
          </button>
          {!isSidebarOpen && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="use-shadow mt-auto w-full rounded bg-black p-2 font-medium">
                <EnterIcon />
              </button>
            </SignInButton>
          )}
          {!isSidebarOpen && isSignedIn && (
            <SignOutButton>
              <button className="use-shadow mt-auto w-full rounded bg-black p-2 font-medium">
                <ExitIcon />
              </button>
            </SignOutButton>
          )}
        </div>
        {isSidebarOpen && (
          <div className="use-scroll flex w-full grow flex-col items-center gap-2 overflow-y-scroll px-3">
            {isLoading ? (
              <Spinner width={60} height={60} />
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
        )}
        {isSidebarOpen && isSignedIn && <LogoutButton />}
        {isSidebarOpen && !isSignedIn && <LoginButton />}
      </aside>

      {/* mobile */}
      <aside
        className={clsx("bg-zinc-900 py-3 lg:hidden", {
          "absolute inset-0 flex flex-col gap-2": isSidebarOpen
        })}>
        <div
          className={clsx("px-3", {
            "flex h-full flex-col": !isSidebarOpen
          })}>
          <button
            className="rounded p-2 transition-colors hover:bg-white/5"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
          </button>
          {!isSidebarOpen && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="use-shadow mt-auto w-full rounded bg-black p-2 font-medium">
                <EnterIcon />
              </button>
            </SignInButton>
          )}
          {!isSidebarOpen && isSignedIn && (
            <SignOutButton>
              <button className="use-shadow mt-auto w-full rounded bg-black p-2 font-medium">
                <ExitIcon />
              </button>
            </SignOutButton>
          )}
        </div>
        {isSidebarOpen && (
          <div className="use-scroll flex w-full grow flex-col items-center gap-2 overflow-y-scroll px-3">
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
        )}
        {isSidebarOpen && isSignedIn && <LogoutButton />}
        {isSidebarOpen && !isSignedIn && <LoginButton />}
      </aside>
    </div>
  )
}

const LoginButton = () => {
  return (
    <footer className="flex w-full items-center justify-center bg-zinc-900 px-3">
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
    <footer className="flex w-full items-center justify-center bg-zinc-900 px-3">
      <SignOutButton>
        <button className="use-shadow w-full rounded bg-black py-2 font-medium">
          Sign Out
        </button>
      </SignOutButton>
    </footer>
  )
}
