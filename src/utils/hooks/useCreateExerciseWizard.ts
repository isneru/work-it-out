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
  formData: TFormData
  submitForm(): void
  cleanForm(): void
  addSetToForm(): void
  removeSetFromForm(index: number): void
  isMutationLoading: boolean
  handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ): void
}

type TFormData = {
  name: string
  sets: {
    reps: number
    weightInKg: number
  }[]
}

export const CreateExerciseWizardHelper = ({
  refetch,
  workoutId
}: CreateExerciseWizardHelperProps): CreateExerciseWizardHelperReturn => {
  const [formData, setFormData] = useState<TFormData>({
    name: "",
    sets: [{ reps: 0, weightInKg: 0 }]
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

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) {
    if (index !== undefined) {
      if (!formData.sets[index]) return
      return setFormData({
        ...formData,
        sets: [
          ...formData.sets.slice(0, index),
          {
            ...formData.sets[index]!,
            [e.target.id.slice(0, -1)]: e.target.valueAsNumber
          },
          ...formData.sets.slice(index + 1)
        ]
      })
    }

    setFormData({
      ...formData,
      name: e.target.value
    })
  }

  function removeSetFromForm(index: number) {
    setFormData({
      ...formData,
      sets: [
        ...formData.sets.slice(0, index),
        ...formData.sets.slice(index + 1)
      ]
    })
  }

  function addSetToForm() {
    setFormData({
      ...formData,
      sets: [...formData.sets, { reps: 0, weightInKg: 0 }]
    })
  }

  function cleanForm() {
    setFormData({
      name: "",
      sets: [{ reps: 0, weightInKg: 0 }]
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
    addSetToForm,
    removeSetFromForm,
    isMutationLoading,
    handleInputChange
  }
}
