import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Image from "next/image"
import { useState } from "react"
import { api, type RouterOutputs } from "utils/api"
import { dayjs } from "utils/dayjs"

type WorkoutWithUser = RouterOutputs["workouts"]["getAll"][number]
const WorkoutView = ({ data }: { data: WorkoutWithUser }) => {
  const { workout, owner } = data
  console.log(owner)
  return (
    <div className="flex items-center gap-3">
      <Image
        width={40}
        height={40}
        className="rounded ring-2 ring-white"
        src={owner.profileImageUrl}
        alt={`${owner.username}'s profile picture`}
      />
      <div>
        <p>Workout by {owner.username}</p>
        <p>{dayjs(workout.createdAt).fromNow()}</p>
      </div>
    </div>
  )
}

const CreateWorkout = () => {
  const [exerciseName, setExerciseName] = useState("")
  const { user } = useUser()

  if (!user) return null

  return (
    <div className="mt-4 flex items-center gap-4">
      <Image
        width={100}
        height={100}
        className="rounded ring ring-white"
        src={user.profileImageUrl}
        alt={`${user.username}'s profile picture`}
      />
      <div className="flex flex-col items-start gap-2">
        <input
          value={exerciseName}
          onChange={e => setExerciseName(e.target.value)}
          type="text"
          placeholder="Exercise name"
          className="bg-transparent p-1 outline-none"
        />
        {
          <button
            className="w-full rounded bg-white p-2 text-black"
            disabled={!exerciseName}>
            Create Exercise
          </button>
        }
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const { isSignedIn, user } = useUser()

  const { data } = api.workouts.getAll.useQuery()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {!!user && <SignOutButton>Sign Out</SignOutButton>}
      {!user && <SignInButton mode="modal">Sign In</SignInButton>}
      <div className="absolute top-1/2 left-0 flex h-full w-[400px] -translate-y-1/2 flex-col items-center bg-zinc-900 py-5">
        {data?.map(fullWorkout => (
          <WorkoutView data={fullWorkout} key={fullWorkout.workout.id} />
        ))}
      </div>
      {isSignedIn && <CreateWorkout />}
    </main>
  )
}

export default Home
