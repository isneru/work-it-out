import { AnimatePresence, motion } from "framer-motion"
import { useContext, useState } from "react"
import { api } from "utils/api"
import { variants } from "utils/motion"
import { ToastContext } from "utils/providers"

interface CreateExerciseWizardProps {
  refetch: () => void
  hasPermissions: boolean
  workoutId: string
}

export const CreateExerciseWizard = ({
  refetch,
  hasPermissions,
  workoutId
}: CreateExerciseWizardProps) => {
  const { addToast } = useContext(ToastContext)
  const { mutate, isLoading: isMutationLoading } =
    api.exercises.create.useMutation({
      onSuccess: () => {
        addToast("Exercise created!", 3000)
        setIsFormOpen(false)
        setFormData({
          name: "",
          reps: 0,
          weightInKg: 0
        })
        refetch()
      },
      onError: error => {
        const errorMessage =
          error.data?.zodError?.fieldErrors.name ??
          error.data?.zodError?.fieldErrors.reps ??
          error.data?.zodError?.fieldErrors.weightInKg

        if (errorMessage && errorMessage[0]) {
          addToast(errorMessage[0], 3000)
        } else {
          addToast("Something went wrong, please try again later!", 3000)
        }
      }
    })

  const [formData, setFormData] = useState({
    name: "",
    reps: 0,
    weightInKg: 0
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  return (
    <>
      <AnimatePresence initial={false}>
        {hasPermissions && !isFormOpen && (
          <motion.button
            variants={variants}
            initial="initial"
            animate="animate"
            transition={{
              delay: 0.4,
              duration: 0.2
            }}
            onClick={() => setIsFormOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded bg-white font-medium text-black">
            <span className="py-2">Add Exercise</span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.4
            }}
            className="flex w-full flex-col gap-2 overflow-hidden rounded bg-zinc-800">
            <fieldset
              disabled={isMutationLoading}
              className="disabled:opacity-60">
              <div className="flex flex-col px-3 pt-3">
                <label htmlFor="name">Exercise name</label>
                <input
                  value={formData.name}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                  }
                  id="name"
                  type="text"
                  autoComplete="off"
                  className="rounded bg-zinc-900 py-1 px-2 outline-none"
                />
              </div>
              <div className="flex w-full">
                <div className="flex grow flex-col p-3">
                  <label htmlFor="reps">Reps</label>
                  <input
                    value={formData.reps}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        reps: e.target.valueAsNumber
                      })
                    }
                    id="reps"
                    type="number"
                    min={0}
                    autoComplete="off"
                    className="rounded bg-zinc-900 py-1 px-2 outline-none"
                  />
                  <button
                    onClick={() => {
                      setIsFormOpen(false)
                      setFormData({
                        name: "",
                        reps: 0,
                        weightInKg: 0
                      })
                    }}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded bg-red-400 px-3 py-2 font-medium text-black transition-colors hover:bg-red-500">
                    Cancel
                  </button>
                </div>
                <div className="flex grow flex-col p-3">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    value={formData.weightInKg}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        weightInKg: e.target.valueAsNumber
                      })
                    }
                    id="weight"
                    type="number"
                    min={0}
                    autoComplete="off"
                    className="rounded bg-zinc-900 py-1 px-2 outline-none"
                  />
                  <button
                    onClick={() =>
                      mutate({
                        workoutId,
                        ...formData
                      })
                    }
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded bg-white px-3 py-2 font-medium text-black">
                    Complete
                  </button>
                </div>
              </div>
            </fieldset>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
