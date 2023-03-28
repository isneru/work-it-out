import { Spinner, WorkoutView } from "components"
import { api } from "utils/api"

interface WorkoutFeedProps {}

export const WorkoutFeed = (props: WorkoutFeedProps) => {
  const { data, isLoading } = api.workouts.getAll.useQuery()

  if (isLoading)
    return (
      <div className="flex w-[400px] flex-col items-center justify-center bg-zinc-900 py-5">
        <Spinner width={40} height={40} />
      </div>
    )

  return (
    <div className="flex w-[400px] flex-col items-center gap-2 bg-zinc-900 py-5 px-2">
      {data?.map(fullWorkout => (
        <WorkoutView data={fullWorkout} key={fullWorkout.workout.id} />
      ))}
    </div>
  )
}
