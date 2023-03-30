import { useUser } from "@clerk/nextjs"
import { CreateWorkoutWizard, WorkoutFeed } from "components"
import { type NextPage } from "next"
import { api } from "utils/api"

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser()

  // start fetching asap
  api.workouts.getAll.useQuery()

  if (!isUserLoaded) return null

  return (
    <main className="flex h-screen">
      <WorkoutFeed />
      <div className="flex grow">{isSignedIn && <CreateWorkoutWizard />}</div>
    </main>
  )
}

export default Home
