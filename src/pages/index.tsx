import { type NextPage } from "next"
import Head from "next/head"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Work it Out</title>
        <meta name="description" content="🏋️‍♂️" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1>Hello, world</h1>
      </main>
    </>
  )
}

export default Home
