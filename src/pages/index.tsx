import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { Spinner } from "components"
import { type NextPage } from "next"
import Image from "next/image"
import { useContext } from "react"
import { api, type RouterOutputs } from "utils/api"
import { dayjs } from "utils/dayjs"
import { ToastContext } from "utils/providers"

type WorkoutWithUser = RouterOutputs["workouts"]["getAll"][number]
const WorkoutView = ({ data }: { data: WorkoutWithUser }) => {
  const { workout, owner } = data
  console.log(owner)
  return (
    <div className="flex items-center gap-3">
      <Image
        width={40}
        height={40}
        className="rounded ring-2 ring-white"
        src={owner.profileImageUrl}
        alt={`${owner.username}'s profile picture`}
      />
      <div>
        <p>Workout by {owner.username}</p>
        <p>{dayjs(workout.createdAt).fromNow()}</p>
      </div>
    </div>
  )
}

const CreateWorkoutWizard = () => {
  const { addToast } = useContext(ToastContext)
  const { user } = useUser()

  const ctx = api.useContext()

  const { mutate: createWorkout, isLoading: isPosting } =
    api.workouts.create.useMutation({
      onSuccess: () => {
        ctx.workouts.getAll.refetch()
        addToast("Workout created!", 2000)
      },
      onError: error => {
        const errorMessage = error.data?.zodError?.fieldErrors.content

        if (errorMessage && errorMessage[0]) {
          addToast(errorMessage[0], 1000)
        } else {
          addToast("Something went wrong, please try again later!", 1000)
        }
      }
    })

  if (!user) return null

  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <Image
        width={100}
        height={100}
        className="rounded ring ring-white"
        src={user.profileImageUrl}
        alt={`${user.username}'s profile picture`}
      />
      <fieldset
        disabled={isPosting}
        className="flex flex-col items-start gap-2 disabled:opacity-70">
        {isPosting && (
          <button
            onClick={() => createWorkout()}
            disabled
            className="flex w-full items-center gap-2 rounded bg-white p-2 text-black">
            Creating <Spinner />
          </button>
        )}
        {!isPosting && (
          <button
            onClick={() => createWorkout()}
            className="flex w-full items-center gap-2 rounded bg-white p-2 text-black">
            Create Workout
          </button>
        )}
      </fieldset>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: isWorkoutsLoading } = api.workouts.getAll.useQuery()

  if (isWorkoutsLoading)
    return (
      <div className="flex w-[400px] flex-col items-center justify-center bg-zinc-900 py-5">
        <Spinner width={40} height={40} />
      </div>
    )

  return (
    <div className="flex w-[400px] flex-col items-center gap-2 bg-zinc-900 py-5">
      {data?.map(fullWorkout => (
        <WorkoutView data={fullWorkout} key={fullWorkout.workout.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser()

  // start fetching asap
  api.workouts.getAll.useQuery()

  if (!isUserLoaded) return null

  return (
    <main className="flex min-h-screen">
      <Feed />
      <div className="flex grow flex-col items-center justify-center">
        {isSignedIn && <SignOutButton>Sign Out</SignOutButton>}
        {!isSignedIn && <SignInButton mode="modal">Sign In</SignInButton>}
        {isSignedIn && <CreateWorkoutWizard />}
      </div>
    </main>
  )
}

export default Home
