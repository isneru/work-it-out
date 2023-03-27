import { Spinner } from "components"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { ssg } from "server/helpers/ssg"
import { api } from "utils/api"

const SingleUserPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data, isLoading } = api.users.getById.useQuery({ userId })

  if (isLoading) return <Spinner asPage width={60} height={60} />
  if (!data)
    return (
      <div className="absolute top-0 right-0 flex h-screen w-screen flex-col items-center justify-center">
        404
        <Link className="underline" href="/">
          Go Back
        </Link>
      </div>
    )

  return (
    <>
      <Head>
        <title>{`${data.username}'s profile`}</title>
      </Head>
      <main className="flex min-h-screen">
        <div className="flex grow flex-col items-center justify-center">
          <h1>User Page</h1>
        </div>
      </main>
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
