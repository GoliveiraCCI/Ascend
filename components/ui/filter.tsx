"use client"

import { Filter as FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterProps {
  onClick?: () => void
}

export function Filter({ onClick }: FilterProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 border-dashed"
      onClick={onClick}
    >
      <FilterIcon className="mr-2 h-4 w-4" />
      Filtros
    </Button>
  )
} 