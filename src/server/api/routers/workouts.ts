import { createTRPCRouter, publicProcedure } from "server/api/trpc"
import { mergeClerkUsers } from "server/helpers"

export const workoutsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const workouts = await ctx.prisma.workout.findMany({
      take: 100
    })

    const users = await mergeClerkUsers(workouts)

    return users
  })
})
