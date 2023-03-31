import { ErrorPage, NestedPageLayout, Spinner } from "components"
import { type GetStaticProps, type NextPage } from "next"
import Head from "next/head"
import { ssg } from "server/helpers/ssg"
import { api } from "utils/api"

const SingleUserPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data, isLoading } = api.users.getById.useQuery({
    userId,
    withWorkouts: true
  })

  if (isLoading) return <Spinner asPage width={60} height={60} />
  if (!data) return <ErrorPage />

  return (
    <>
      <Head>
        <title>{`${data.username}'s profile`}</title>
      </Head>
      <NestedPageLayout>
        <h1>User Page</h1>
      </NestedPageLayout>
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
