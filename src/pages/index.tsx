import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import { api } from "utils/api"

const Home: NextPage = () => {
  const { isSignedIn, user } = useUser()

  const { data: workouts } = api.workouts.getAll.useQuery()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1>Hello, world</h1>
      {!!user && <SignOutButton>Sign Out</SignOutButton>}
      {!user && <SignInButton>Sign In</SignInButton>}
      <div>
        {workouts?.map(workout => (
          <span>{workout.createdAt.toLocaleDateString()}</span>
        ))}
      </div>
    </main>
  )
}

export default Home
