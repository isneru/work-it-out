import { ErrorPage, NestedPageLayout, Spinner } from "components"
import { AnimatePresence, motion } from "framer-motion"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { ssg } from "server/helpers/ssg"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"
import { variants } from "utils/motion"

const SingleUserPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data: user, isLoading } = api.users.getById.useQuery({
    userId,
    withWorkouts: true
  })

  if (isLoading) return <Spinner asPage width={60} height={60} />
  if (!user) return <ErrorPage />

  console.log(user)

  return (
    <>
      <Head>
        <title>{`${user.username}'s profile`}</title>
      </Head>
      <NestedPageLayout className="grid grid-cols-1 grid-rows-2 divide-y divide-x-0 divide-white/5 lg:grid-cols-2 lg:grid-rows-1 lg:divide-x lg:divide-y-0">
        <div className="flex flex-col gap-4 py-5 px-5">
          <h1 className="text-3xl font-bold">
            Viewing {user.username}'s profile
          </h1>
        </div>
        <div className="flex flex-col items-center gap-4 py-5 px-5">
          <span className="text-3xl font-bold">Workouts</span>
          {"workouts" in user &&
            user.workouts.map(workout => (
              <Link
                href={`/workout/${workout.id}`}
                className="flex w-full flex-col justify-center gap-3 rounded bg-white/5 p-3"
                key={workout.id}>
                <div className="flex items-center gap-3">
                  <Image
                    width={40}
                    height={40}
                    className="rounded border-2 border-white"
                    src={user.profileImageUrl}
                    alt={`${user.username}'s profile picture`}
                  />
                  <div>
                    <p className="font-medium">Workout</p>
                    <p className="text-zinc-400">
                      {dayjs(workout.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <AnimatePresence>
                  {workout.exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      transition={{
                        duration: 0.3,
                        delay:
                          dayjs(exercise.createdAt).fromNow() ===
                          "a few seconds ago"
                            ? 0
                            : index * 0.1
                      }}
                      className="flex w-full flex-col gap-1 rounded bg-zinc-900 px-3">
                      <span className="pt-2 text-lg font-medium">
                        {exercise.name}
                      </span>
                      <div className="pb-2">
                        {exercise.sets.map(set => (
                          <p
                            key={
                              set.id
                            }>{`${set.reps} reps of ${set.weightInKg} Kg`}</p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Link>
            ))}
        </div>
      </NestedPageLayout>
    </>
  )
}

export default SingleUserPage

export const getStaticProps: GetStaticProps = async ctx => {
  const id = ctx.params?.id
  if (typeof id !== "string") throw new Error("id must be a string")

  ssg.users.getById.prefetch({ userId: id })

  return {
    props: {
      dehydratedState: ssg.dehydrate(),
      userId: id
    }
  }
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true
})
