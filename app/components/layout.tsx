import { Notifications } from "./notifications"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Ascend</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/evaluations"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Avaliações
              </Link>
              <Link
                href="/employees"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Funcionários
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Notifications />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  )
} 