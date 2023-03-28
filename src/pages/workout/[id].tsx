import {
  CreateExerciseWizard,
  ErrorPage,
  ExerciseFeed,
  Layout,
  Spinner
} from "components"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { ssg } from "server/helpers/ssg"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"

const SingleWorkoutPage: NextPage<{ workoutId: string }> = ({ workoutId }) => {
  const { data, isLoading, refetch } = api.workouts.getById.useQuery({
    workoutId
  })

  if (isLoading) return <Spinner asPage width={60} height={60} />
  if (!data) return <ErrorPage />

  return (
    <>
      <Head>
        <title>Workout</title>
      </Head>
      <Layout>
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
            <ExerciseFeed workoutId={workoutId} />
            <CreateExerciseWizard
              hasPermissions={data.hasPermissions}
              refetch={refetch}
              workoutId={workoutId}
            />
          </div>
        </div>
      </Layout>
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
