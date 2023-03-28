import { ExerciseView, Spinner } from "components"
import { api } from "utils/api"

interface ExerciseFeedProps {
  workoutId: string
}

export const ExerciseFeed = ({ workoutId }: ExerciseFeedProps) => {
  const { data, isLoading, refetch } = api.workouts.getById.useQuery({
    workoutId
  })

  if (isLoading)
    return (
      <div className="flex w-full flex-col items-center">
        <Spinner width={40} height={40} />
      </div>
    )

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {data?.workout.exercises.map(exercise => (
        <ExerciseView key={exercise.id} exercise={exercise} />
      ))}
    </div>
  )
}
