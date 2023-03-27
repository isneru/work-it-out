import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { appRouter } from "server/api/root"
import { prisma } from "server/db"
import superjson from "superjson"

export const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: { prisma, authedUserId: null },
  transformer: superjson
})
