import { createTRPCRouter, privateProcedure } from "server/api/trpc"
import { z } from "zod"

export const exercisesRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        workoutId: z.string(),
        name: z.string().max(20),
        reps: z.number().min(0).max(2000),
        weightInKg: z.number().min(0).max(2000)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exercise = await ctx.prisma.exercise.create({
        data: {
          name: input.name,
          workout: {
            connect: {
              id: input.workoutId
            }
          },
          sets: {
            create: {
              reps: input.reps,
              weightInKg: input.weightInKg
            }
          }
        },
        include: { sets: true }
      })

      return exercise
    })
})
