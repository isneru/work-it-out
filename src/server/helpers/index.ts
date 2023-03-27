import { clerkClient } from "@clerk/nextjs/dist/api"
import { Workout } from "@prisma/client"
import { TRPCError } from "@trpc/server"

export async function mergeClerkUsers(workouts: Workout[]) {
  const users = await clerkClient.users.getUserList({
    userId: workouts.map(w => w.ownerId),
    limit: 100
  })

  const filteredUsers = users.map(user => ({
    id: user.id!,
    username: (user.username ?? user.firstName)!,
    profileImageUrl: user.profileImageUrl!
  }))

  return workouts.map(workout => {
    const owner = filteredUsers.find(user => user.id === workout.ownerId)
    if (!owner) throw new TRPCError({ code: "NOT_FOUND" })

    return {
      workout,
      owner
    }
  })
}
