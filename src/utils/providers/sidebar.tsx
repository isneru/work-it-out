import { ReactNode, createContext, useState } from "react"

interface SidebarContextData {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const SidebarContext = createContext({} as SidebarContextData)

interface SidebarProviderProps {
  children: ReactNode
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function toggleSidebar() {
    setIsSidebarOpen(isOpen => !isOpen)
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}
