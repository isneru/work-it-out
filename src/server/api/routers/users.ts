import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "server/api/trpc"
import { filterUserForClient } from "server/helpers"
import { z } from "zod"

export const usersRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await clerkClient.users.getUser(input.userId)

      if (!user) throw new TRPCError({ code: "NOT_FOUND" })

      const filteredUser = filterUserForClient(user)

      return {
        ...filteredUser,
        hasPermissions: ctx.authedUserId === user.id
      }
    })
})
