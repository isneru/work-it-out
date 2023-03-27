import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Head from "next/head"

const Home: NextPage = () => {
  const { isSignedIn, user } = useUser()
  return (
    <>
      <Head>
        <title>Work it Out</title>
        <meta name="description" content="🏋️‍♂️" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1>Hello, world</h1>
        {!!user && <SignOutButton>Sign Out</SignOutButton>}
        {!user && <SignInButton>Sign In</SignInButton>}
      </main>
    </>
  )
}

export default Home
