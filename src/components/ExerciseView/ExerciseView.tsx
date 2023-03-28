import { Exercise, Set } from "@prisma/client"
import { motion } from "framer-motion"
import { variants } from "utils/motion"

interface ExerciseViewProps {
  exercise: Exercise & {
    sets: Set[]
  }
  index: number
  isNew: boolean
}

export const ExerciseView = ({ exercise, index, isNew }: ExerciseViewProps) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.3,
        delay: isNew ? 0 : index * 0.1
      }}
      className="flex w-full flex-col gap-1 rounded bg-zinc-800 px-3">
      <span className="pt-2 text-lg font-medium">{exercise.name}</span>
      <div className="pb-2">
        {exercise.sets.map(set => (
          <p key={set.id}>{`${set.reps} reps of ${set.weightInKg} Kg`}</p>
        ))}
      </div>
    </motion.div>
  )
}
