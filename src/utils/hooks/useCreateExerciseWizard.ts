import { useContext, useState } from "react"
import { api } from "utils/api"
import { ToastContext } from "utils/providers"

interface CreateExerciseWizardHelperProps {
  refetch: () => void
  workoutId: string
}

interface CreateExerciseWizardHelperReturn {
  isFormOpen: boolean
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>
  formData: {
    name: string
    reps: number
    weightInKg: number
  }
  submitForm(): void
  cleanForm(): void
  isMutationLoading: boolean
  handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void
}

export const CreateExerciseWizardHelper = ({
  refetch,
  workoutId
}: CreateExerciseWizardHelperProps): CreateExerciseWizardHelperReturn => {
  const [formData, setFormData] = useState({
    name: "",
    reps: 0,
    weightInKg: 0
  })
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { addToast } = useContext(ToastContext)

  const { mutate, isLoading: isMutationLoading } =
    api.exercises.create.useMutation({
      onSuccess: () => {
        addToast("Exercise created!", 3000)
        cleanForm()
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

  function submitForm() {
    mutate({
      workoutId,
      ...formData
    })
  }

  return {
    isFormOpen,
    setIsFormOpen,
    formData,
    submitForm,
    cleanForm,
    isMutationLoading,
    handleInputChange
  }
}
