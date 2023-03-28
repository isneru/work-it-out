import { ErrorPage, Spinner } from "components"
import { AnimatePresence, motion } from "framer-motion"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useContext, useState } from "react"
import { ssg } from "server/helpers/ssg"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"
import { ToastContext } from "utils/providers"

const SingleWorkoutPage: NextPage<{ workoutId: string }> = ({ workoutId }) => {
  const { addToast } = useContext(ToastContext)
  const { data, isLoading, refetch } = api.workouts.getById.useQuery({
    workoutId
  })
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

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    reps: 0,
    weightInKg: 0
  })

  if (isLoading) return <Spinner asPage width={60} height={60} />
  if (!data) return <ErrorPage />

  return (
    <>
      <Head>
        <title>Workout</title>
      </Head>
      <main className="flex min-h-screen">
        <div className="flex grow flex-col items-center justify-center">
          <div className="grid h-full w-full grid-cols-1 grid-rows-2 divide-y divide-x-0 divide-white/5 bg-zinc-900 py-5 lg:grid-cols-2 lg:grid-rows-1 lg:divide-x lg:divide-y-0 lg:rounded-md min-[1200px]:h-4/5 min-[1200px]:w-[90%] 2xl:w-2/3">
            <div className="flex flex-col gap-4 py-5 px-5">
              <h1 className="text-3xl font-bold">Viewing Workout</h1>
              <div className="flex items-center gap-3">
                <Image
                  width={40}
                  height={40}
                  className="rounded ring-2 ring-white"
                  src={data.owner.profileImageUrl}
                  alt={`${data.owner.username}'s profile picture`}
                />
                <div>
                  <p className="font-medium">
                    created by{" "}
                    <Link
                      className="hover:underline"
                      href={`/user/${data.owner.id}`}>
                      {data.owner.username}
                    </Link>
                  </p>
                  <p className="text-zinc-400">
                    {dayjs(data.workout.createdAt).format("Do MMMM YYYY")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 py-5 px-5">
              <span className="text-3xl font-bold">Exercises</span>
              <div className="flex w-full flex-col items-center gap-3">
                {data.workout.exercises.map(exercise => (
                  <div className="flex w-full flex-col gap-1 rounded bg-zinc-800 py-2 px-3">
                    <span className="text-lg font-medium">{exercise.name}</span>
                    <div>
                      {exercise.sets.map(set => (
                        <p>{`${set.reps} reps of ${set.weightInKg} Kg`}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <AnimatePresence initial={false}>
                {data.hasPermissions && !isFormOpen && (
                  <motion.button
                    initial={{
                      height: 0,
                      opacity: 0
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1
                    }}
                    transition={{
                      delay: 0.4,
                      duration: 0.4
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
                    initial={{
                      height: 0,
                      opacity: 0
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1
                    }}
                    exit={{
                      height: 0,
                      opacity: 0
                    }}
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
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SingleWorkoutPage

export const getStaticProps: GetStaticProps = async ctx => {
  const id = ctx.params?.id
  if (typeof id !== "string") throw new Error("id must be a string")

  ssg.workouts.getById.prefetch({ workoutId: id })

  return {
    props: {
      dehydratedState: ssg.dehydrate(),
      workoutId: id
    }
  }
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true
})
