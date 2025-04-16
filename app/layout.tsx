"use client"

import "./globals.css"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import {
  LayoutDashboard,
  ClipboardList,
  Star,
  GraduationCap,
  Stethoscope,
  Trophy,
  FileUp,
} from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Formulários", href: "/forms", icon: ClipboardList },
    { name: "Avaliações", href: "/evaluations", icon: Star },
    { name: "Treinamentos", href: "/trainings", icon: GraduationCap },
    { name: "Licenças Médicas", href: "/medical-leaves", icon: Stethoscope },
    { name: "Uploads", href: "/bulk-import", icon: FileUp },
  ]

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
            <div className="flex-1 flex flex-col min-h-0 border-r bg-background">
              <div className="flex-shrink-0 px-4 py-4 border-b">
                <Link href="/" className="flex items-center group">
                  <Trophy className="h-7 w-7 text-blue-600 mr-2 transition-transform duration-300 ease-in-out group-hover:translate-y-[-2px]" />
                  <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    ASCEND
                  </span>
                </Link>
              </div>
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        pathname === item.href
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:pl-64 flex flex-col flex-1">
            <main className="flex-1">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}