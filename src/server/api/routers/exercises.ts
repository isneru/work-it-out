import { createTRPCRouter, privateProcedure } from "server/api/trpc"
import { z } from "zod"

export const exercisesRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        workoutId: z.string(),
        name: z
          .string()
          .min(1, { message: "Please provide an exercise name" })
          .max(20),
        sets: z
          .array(
            z.object({
              reps: z
                .number()
                .min(1, { message: "Please provide a number of reps" })
                .max(2000),
              weightInKg: z
                .number()
                .min(1, { message: "Please provide a weight amount" })
                .max(2000)
            })
          )
          .min(1, { message: "Please provide at least one set" })
          .max(20, { message: "Are you a monster?" })
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
            createMany: {
              data: input.sets
            }
          }
        },
        include: { sets: true }
      })

      return exercise
    })
})
