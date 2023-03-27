import { clerkClient, User } from "@clerk/nextjs/dist/api"
import { Workout } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export function filterUsersForClient(users: User[]) {
  return users.map(user => ({
    id: user.id!,
    username: user.username ?? user.firstName! + user.lastName!,
    profileImageUrl: user.profileImageUrl!
  }))
}

export function filterUserForClient(user: User) {
  return {
    id: user.id!,
    username: user.username ?? user.firstName! + user.lastName!,
    profileImageUrl: user.profileImageUrl!
  }
}

export async function mergeClerkUsers(workouts: Workout[]) {
  const users = await clerkClient.users.getUserList({
    userId: workouts.map(w => w.ownerId),
    limit: 100
  })

  const filteredUsers = filterUsersForClient(users)

  return workouts.map(workout => {
    const owner = filteredUsers.find(user => user.id === workout.ownerId)
    if (!owner) throw new TRPCError({ code: "NOT_FOUND" })

    return {
      workout,
      owner
    }
  })
}

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 d"),
  analytics: true
})
