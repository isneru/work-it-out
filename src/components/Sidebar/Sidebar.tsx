import { useUser } from "@clerk/nextjs"
import { ClosedSidebar } from "components/Sidebar/ClosedSidebar"
import { OpenSidebar } from "components/Sidebar/OpenSidebar"
import { useContext } from "react"
import { api } from "utils/api"
import { SidebarContext } from "utils/providers"

export interface SharedAuthButtonProps {
  isSignedIn: boolean
  children: React.ReactNode
}

export interface SharedSidebarProps {
  toggleSidebar(): void
  isSidebarOpen: boolean
  isSignedIn: boolean
}

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext)
  const { data, isLoading } = api.workouts.getAll.useQuery()

  const { isSignedIn, isLoaded } = useUser()
  if (!isLoaded) return null

  return (
    <aside className="flex h-screen">
      {isSidebarOpen ? (
        <OpenSidebar
          isSidebarOpen={isSidebarOpen}
          isSignedIn={isSignedIn}
          toggleSidebar={toggleSidebar}
          data={data}
          isLoading={isLoading}
        />
      ) : (
        <ClosedSidebar
          isSidebarOpen={isSidebarOpen}
          isSignedIn={isSignedIn}
          toggleSidebar={toggleSidebar}
        />
      )}
    </aside>
  )
}
