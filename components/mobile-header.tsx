"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"

export function MobileHeader() {
  const { toggle } = useSidebar()

  return (
    <div className="flex h-14 items-center border-b px-4 lg:hidden">
      <Button variant="ghost" size="icon" onClick={toggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="ml-4 font-semibold">ASCEND</div>
    </div>
  )
}

