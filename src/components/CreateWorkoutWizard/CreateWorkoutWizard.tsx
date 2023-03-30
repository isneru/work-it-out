import { useUser } from "@clerk/nextjs"
import { Spinner } from "components"
import Image from "next/image"
import { useContext } from "react"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"
import { ToastContext } from "utils/providers"

interface CreateWorkoutWizardProps {}

export const CreateWorkoutWizard = (props: CreateWorkoutWizardProps) => {
  const { addToast } = useContext(ToastContext)

  const { user, isLoaded } = useUser()

  const ctx = api.useContext()

  if (!user) return null

  const { data, isLoading } = api.users.getById.useQuery({
    userId: user.id,
    withWorkouts: true
  })

  function hasUserCreatedWorkoutToday() {
    if (data && "workouts" in data) {
      return data.workouts.some(
        workout =>
          dayjs(workout.createdAt).format("Do MMMM YYYY") ===
          dayjs().format("Do MMMM YYYY")
      )
    }
  }

  const { mutate: createWorkout, isLoading: isPosting } =
    api.workouts.create.useMutation({
      onSuccess: () => {
        ctx.workouts.getAll.refetch()
        addToast("Workout created!", 3000)
      },
      onError: error => {
        const errorMessage = error.data?.zodError?.fieldErrors.content
        if (errorMessage && errorMessage[0]) {
          addToast(errorMessage[0], 3000)
        } else {
          addToast("Something went wrong, please try again later!", 3000)
        }
      }
    })

  if (!isLoaded || isLoading) return <Spinner asPage width={60} height={60} />

  return (
    <main className="flex flex-col gap-4 p-6">
      <header className="flex items-end gap-4">
        <Image
          width={100}
          height={100}
          className="rounded border-4 border-white"
          src={user.profileImageUrl}
          alt={`${user.username}'s profile picture`}
        />
        <div>
          <p className="text-2xl font-bold">Welcome back,</p>
          <span className="text-5xl font-bold">
            {`${user.username ?? user.firstName + " " + user.lastName}!`}
          </span>
        </div>
      </header>

      <button
        disabled={isPosting}
        onClick={() => createWorkout()}
        className="flex w-full items-center justify-center gap-2 rounded bg-white py-2 px-3 font-medium text-black disabled:opacity-70">
        {isPosting ? (
          <>
            <span>Creating</span>
            <Spinner />
          </>
        ) : (
          "Create Workout"
        )}
      </button>
      {hasUserCreatedWorkoutToday() && (
        <p className="w-full text-center text-sm text-zinc-500 underline">
          You have already created a workout today! Feel free to relax
        </p>
      )}
    </main>
  )
}
