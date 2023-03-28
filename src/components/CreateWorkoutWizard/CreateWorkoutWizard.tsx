import { useUser } from "@clerk/nextjs"
import { Spinner } from "components"
import Image from "next/image"
import { useContext } from "react"
import { api } from "utils/api"
import { ToastContext } from "utils/providers"

interface CreateWorkoutWizardProps {}

export const CreateWorkoutWizard = (props: CreateWorkoutWizardProps) => {
  const { addToast } = useContext(ToastContext)
  const { user } = useUser()

  const ctx = api.useContext()

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
            className="flex w-full items-center gap-2 rounded bg-white py-2 px-3 font-medium text-black">
            Creating <Spinner />
          </button>
        )}
        {!isPosting && (
          <button
            onClick={() => createWorkout()}
            className="flex w-full items-center gap-2 rounded bg-white py-2 px-3 font-medium text-black">
            Create Workout
          </button>
        )}
      </fieldset>
    </div>
  )
}
