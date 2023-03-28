interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="flex min-h-screen">
      <div className="flex grow flex-col items-center justify-center">
        {children}
      </div>
    </main>
  )
}
