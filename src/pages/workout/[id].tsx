import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"

const SingleWorkoutPage: NextPage = () => {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser()

  if (!isUserLoaded) return null

  return (
    <main className="flex min-h-screen">
      <div className="flex grow flex-col items-center justify-center">
        <h1>Workout Page</h1>
        {isSignedIn && <SignOutButton>Sign Out</SignOutButton>}
        {!isSignedIn && <SignInButton mode="modal">Sign In</SignInButton>}
      </div>
    </main>
  )
}

export default SingleWorkoutPage
