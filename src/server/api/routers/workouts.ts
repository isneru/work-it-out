import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import {
  createTRPCRouter,
  privateProcedure,
  protectedProcedure,
  publicProcedure
} from "server/api/trpc"
import { filterUserForClient, mergeClerkUsers, ratelimit } from "server/helpers"
import { z } from "zod"

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

  create: privateProcedure.mutation(async ({ ctx, input }) => {
    const { success } = await ratelimit.limit(ctx.authedUserId)
    if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

    const workout = await ctx.prisma.workout.create({
      data: {
        ownerId: ctx.authedUserId
      }
    })

    return workout
  }),
  getById: protectedProcedure
    .input(
      z.object({
        workoutId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const workout = await ctx.prisma.workout.findUnique({
        where: {
          id: input.workoutId
        },
        include: {
          exercises: {
            include: {
              sets: true
            }
          }
        }
      })

      if (!workout) throw new TRPCError({ code: "NOT_FOUND" })

      const user = await clerkClient.users.getUser(workout.ownerId)
      if (!user) throw new TRPCError({ code: "NOT_FOUND" })
      const filteredUser = filterUserForClient(user)

      return {
        workout: {
          id: workout.id,
          exercises: workout.exercises,
          createdAt: workout.createdAt,
          updatedAt: workout.updatedAt
        },
        owner: filteredUser,
        hasPermissions: ctx.authedUserId === workout.ownerId
      }
    })
})
