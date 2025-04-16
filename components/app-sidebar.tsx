"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, Home, Settings, Users, Building2, BookOpen, FileCheck, UserCircle, FileUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  className?: string
}

// Interface para as rotas
interface Route {
  label: string
  icon: React.ElementType
  href: string
  active: boolean
  count?: number // Contador opcional para notificações
}

export function AppSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  const routes: Route[] = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Funcionários",
      icon: Users,
      href: "/employees",
      active: pathname === "/employees" || pathname.startsWith("/employees/"),
      count: 5, // Exemplo: 5 novos funcionários
    },
    {
      label: "Avaliações",
      icon: FileCheck,
      href: "/evaluations",
      active: pathname === "/evaluations" || pathname.startsWith("/evaluations/"),
      count: 12, // Exemplo: 12 avaliações pendentes
    },
    {
      label: "Atestados",
      icon: FileText,
      href: "/medical-leaves",
      active: pathname === "/medical-leaves" || pathname.startsWith("/medical-leaves/"),
      count: 3, // Exemplo: 3 novos atestados
    },
    {
      label: "Treinamentos",
      icon: BookOpen,
      href: "/trainings",
      active: pathname === "/trainings" || pathname.startsWith("/trainings/"),
    },
    {
      label: "Uploads",
      icon: FileUp,
      href: "/bulk-import",
      active: pathname === "/bulk-import" || pathname.startsWith("/bulk-import/"),
    },
    {
      label: "Departamentos",
      icon: Building2,
      href: "/departments",
      active: pathname === "/departments" || pathname.startsWith("/departments/"),
    },
    {
      label: "Relatórios",
      icon: BarChart3,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: "Usuários",
      icon: Users,
      href: "/users",
      active: pathname === "/users" || pathname.startsWith("/users/"),
    },
    {
      label: "Perfil",
      icon: UserCircle,
      href: "/profile",
      active: pathname === "/profile",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  const sidebarContent = (
    <div className="flex h-full w-full flex-col space-y-2 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">ASCEND</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start transition-all hover:bg-secondary/80",
                route.active ? "bg-secondary font-medium" : "",
              )}
              asChild
              onClick={close}
            >
              <Link href={route.href} className="flex w-full items-center">
                <route.icon className="mr-2 h-5 w-5" />
                <span>{route.label}</span>
                {route.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {route.count}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  // Versão para desktop
  return (
    <>
      <aside className={cn("hidden h-screen w-64 border-r bg-background lg:block", className)}>{sidebarContent}</aside>

      {/* Versão para mobile */}
      <Sheet open={isOpen} onOpenChange={close}>
        <SheetContent side="left" className="p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}

