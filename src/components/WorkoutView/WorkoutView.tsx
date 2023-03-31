import Image from "next/image"
import Link from "next/link"
import { type RouterOutputs } from "utils/api"
import { dayjs } from "utils/dayjs"

interface WorkoutViewProps {
  data: RouterOutputs["workouts"]["getAll"][number]
}

export const WorkoutView = ({ data }: WorkoutViewProps) => {
  const { workout, owner } = data
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="flex w-full items-center gap-3 rounded py-1 px-2 transition-colors hover:bg-white/5">
      <Link href={`/user/${owner.id}`}>
        <Image
          priority
          width={40}
          height={40}
          className="rounded ring-2 ring-white"
          src={owner.profileImageUrl}
          alt={`${owner.username}'s profile picture`}
        />
      </Link>
      <div>
        <p className="font-medium">
          Workout by{" "}
          <Link className="hover:underline" href={`/user/${owner.id}`}>
            {owner.username}
          </Link>
        </p>
        <p className="text-zinc-400">{dayjs(workout.createdAt).fromNow()}</p>
      </div>
    </Link>
  )
}
