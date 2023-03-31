import {
  CreateExerciseWizard,
  ErrorPage,
  ExerciseFeed,
  NestedPageLayout,
  Spinner
} from "components"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import * as scroll from "react-scroll"
import useMeasure from "react-use-measure"
import { ssg } from "server/helpers/ssg"
import { api } from "utils/api"
import { dayjs } from "utils/dayjs"

const SingleWorkoutPage: NextPage<{ workoutId: string }> = ({ workoutId }) => {
  const { data, isLoading, refetch } = api.workouts.getById.useQuery({
    workoutId
  })

  const [ref, { height }] = useMeasure()
  useEffect(() => {
    scroll.animateScroll.scrollTo(height, {
      duration: 500,
      isDynamic: true,
      containerId: "form"
    })
  }, [height])

  if (isLoading)
    return (
      <NestedPageLayout className="grid grid-cols-1 grid-rows-2 divide-y divide-x-0 divide-white/5 lg:grid-cols-2 lg:grid-rows-1 lg:divide-x lg:divide-y-0">
        <div className="flex items-center justify-center">
          <Spinner width={40} height={40} />
        </div>
        <div className="flex items-center justify-center">
          <Spinner width={40} height={40} />
        </div>
      </NestedPageLayout>
    )

  if (!data) return <ErrorPage />

  return (
    <>
      <Head>
        <title>Workout</title>
      </Head>
      <NestedPageLayout className="grid grid-cols-1 grid-rows-2 divide-y divide-x-0 divide-white/5 lg:grid-cols-2 lg:grid-rows-1 lg:divide-x lg:divide-y-0">
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
        <div className="flex flex-col items-center gap-4 py-5 pl-5 pr-3">
          <span className="text-3xl font-bold">Exercises</span>
          <div
            id="form"
            ref={ref}
            className="use-scroll w-full overflow-y-scroll pr-2">
            <ExerciseFeed workoutId={workoutId} />
            <CreateExerciseWizard
              hasPermissions={data.hasPermissions}
              refetch={refetch}
              workoutId={workoutId}
            />
          </div>
        </div>
      </NestedPageLayout>
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
