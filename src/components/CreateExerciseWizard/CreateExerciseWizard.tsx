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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.id]:
        e.target.id === "name" ? e.target.value : e.target.valueAsNumber
    })
  }

  function cleanForm() {
    setFormData({
      name: "",
      reps: 0,
      weightInKg: 0
    })
    setIsFormOpen(false)
  }

  function submit() {
    mutate({
      workoutId,
      ...formData
    })
  }

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
            className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-white font-medium text-black">
            <span className="py-2">Add Exercise</span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.4
            }}
            className="mt-3 flex w-full flex-col gap-2 overflow-hidden rounded bg-zinc-800">
            <fieldset
              disabled={isMutationLoading}
              className="flex flex-col px-3 pt-3 disabled:opacity-60">
              <label htmlFor="name">Exercise name</label>
              <input
                value={formData.name}
                onChange={handleInputChange}
                id="name"
                type="text"
                autoComplete="off"
                className="rounded bg-zinc-900 py-1 px-2 outline-none "
              />
            </fieldset>
            <div className="grid grid-cols-2">
              <fieldset
                disabled={isMutationLoading}
                className="flex flex-col p-3 disabled:opacity-60">
                <label htmlFor="reps">Reps</label>
                <input
                  value={formData.reps}
                  onChange={handleInputChange}
                  id="reps"
                  type="number"
                  min={0}
                  autoComplete="off"
                  className="rounded bg-zinc-900 py-1 px-2 outline-none"
                />
              </fieldset>
              <fieldset
                disabled={isMutationLoading}
                className="flex flex-col p-3 disabled:opacity-60">
                <label htmlFor="weightInKg">Weight (kg)</label>
                <input
                  value={formData.weightInKg}
                  onChange={handleInputChange}
                  id="weightInKg"
                  type="number"
                  min={0}
                  autoComplete="off"
                  className="rounded bg-zinc-900 py-1 px-2 outline-none"
                />
              </fieldset>
              <button
                disabled={isMutationLoading}
                type="button"
                onClick={submit}
                className="order-4 m-3 flex items-center justify-center gap-2 rounded bg-white px-3 py-2 font-medium text-black disabled:opacity-60">
                Complete
              </button>
              <button
                type="button"
                disabled={isMutationLoading}
                onClick={cleanForm}
                className="order-3 m-3 flex items-center justify-center gap-2 rounded bg-red-400 px-3 py-2 font-medium text-black transition-colors disabled:opacity-60 hover:bg-red-500">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  )
}
