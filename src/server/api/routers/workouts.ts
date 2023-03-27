import { TRPCError } from "@trpc/server"
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure
} from "server/api/trpc"
import { mergeClerkUsers, ratelimit } from "server/helpers"

export const workoutsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const workouts = await ctx.prisma.workout.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc"
      }
    })

    const users = await mergeClerkUsers(workouts)

    return users
  }),

  create: privateProcedure
    /*     .input(
      z.object({
        name: z.string().min(1).max(50)
      })
    ) */
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.authedUserId)
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

      const workout = await ctx.prisma.workout.create({
        data: {
          ownerId: ctx.authedUserId
          /*           exercises: {
            create: {
              name: input.name
            }
          } */
        }
      })

      return workout
    })
})
