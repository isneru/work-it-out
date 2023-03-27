import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import { ssg } from "server/helpers/ssg"
import { api } from "utils/api"

const SingleUserPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data } = api.users.getById.useQuery({ userId })

  if (!data) return <div>404</div>

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
