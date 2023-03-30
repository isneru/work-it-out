import { ExerciseView, Spinner } from "components"
import { AnimatePresence } from "framer-motion"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"

interface ExerciseFeedProps {
  workoutId: string
}

export const ExerciseFeed = ({ workoutId }: ExerciseFeedProps) => {
  const { data, isLoading } = api.workouts.getById.useQuery({
    workoutId
  })

  if (isLoading)
    return (
      <div className="flex w-full flex-col items-center">
        <Spinner className="flex grow" width={40} height={40} />
      </div>
    )

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <AnimatePresence>
        {data?.workout.exercises.map((exercise, index) => (
          <ExerciseView
            index={index}
            key={exercise.id}
            exercise={exercise}
            isNew={dayjs(exercise.createdAt).fromNow() === "a few seconds ago"}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
