import { Exercise, Set } from "@prisma/client"

interface ExerciseViewProps {
  exercise: Exercise & {
    sets: Set[]
  }
}

export const ExerciseView = ({ exercise }: ExerciseViewProps) => {
  return (
    <div className="flex w-full flex-col gap-1 rounded bg-zinc-800 py-2 px-3">
      <span className="text-lg font-medium">{exercise.name}</span>
      <div>
        {exercise.sets.map(set => (
          <p>{`${set.reps} reps of ${set.weightInKg} Kg`}</p>
        ))}
      </div>
    </div>
  )
}
