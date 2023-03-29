import { CardStackPlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { AnimatePresence, motion } from "framer-motion"
import { CreateExerciseWizardHelper } from "utils/hooks"
import { variants } from "utils/motion"

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
  const {
    isFormOpen,
    setIsFormOpen,
    formData,
    submitForm,
    cleanForm,
    addSetToForm,
    removeSetFromForm,
    isMutationLoading,
    handleInputChange
  } = CreateExerciseWizardHelper({
    refetch,
    workoutId
  })

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
            {formData.sets.map((set, index) => (
              <div key={index} className="grid grid-cols-2">
                <fieldset
                  disabled={isMutationLoading}
                  className="flex flex-col p-3 disabled:opacity-60">
                  <label htmlFor={`reps${index}`}>Reps</label>
                  <input
                    value={set.reps}
                    onChange={e => handleInputChange(e, index)}
                    id={`reps${index}`}
                    type="number"
                    min={0}
                    autoComplete="off"
                    className="rounded bg-zinc-900 py-1 px-2 outline-none"
                  />
                </fieldset>
                <fieldset
                  disabled={isMutationLoading}
                  className="group relative flex flex-col p-3 disabled:opacity-60 ">
                  <label htmlFor={`weightInKg${index}`}>Weight (kg)</label>
                  <input
                    value={set.weightInKg}
                    onChange={e => handleInputChange(e, index)}
                    id={`weightInKg${index}`}
                    type="number"
                    min={0}
                    autoComplete="off"
                    className="rounded bg-zinc-900 py-1 px-2 outline-none"
                  />
                  {index != 0 && (
                    <button
                      onClick={() => removeSetFromForm(index)}
                      type="button"
                      className="absolute right-0 top-0 flex h-8 w-8 translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-900 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 hover:bg-[#17171b]">
                      <TrashIcon />
                    </button>
                  )}
                </fieldset>
              </div>
            ))}
            <button
              disabled={isMutationLoading}
              type="button"
              onClick={addSetToForm}
              className="m-3 flex items-center justify-center gap-2 rounded border-2 border-black/10 bg-zinc-900 px-3 py-2 font-medium shadow-zinc-900 transition-shadow disabled:opacity-60 hover:shadow">
              +1 Set
              <CardStackPlusIcon width={24} height={24} />
            </button>
            <div className="grid grid-cols-2">
              <button
                disabled={isMutationLoading}
                type="button"
                onClick={submitForm}
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
