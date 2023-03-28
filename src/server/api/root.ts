import { exercisesRouter } from "server/api/routers/exercises"
import { usersRouter } from "server/api/routers/users"
import { workoutsRouter } from "server/api/routers/workouts"
import { createTRPCRouter } from "server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workouts: workoutsRouter,
  users: usersRouter,
  exercises: exercisesRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
