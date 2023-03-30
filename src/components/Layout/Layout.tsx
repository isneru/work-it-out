interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen">
      <div className="flex grow flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
