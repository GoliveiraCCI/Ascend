"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Tipo para os dados do treinamento
interface Training {
  id: string
  name: string
  category: string
  instructor: string
  startDate: Date
  endDate: Date
  hours: number
  status: string
  department?: {
    name: string
  } | null
  participants: {
    employee: {
      name: string
    }
  }[]
}

export const columns: ColumnDef<Training>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const training = row.original
      return (
        <div>
          <div className="font-medium">{training.name}</div>
          <div className="text-xs text-muted-foreground">
            {training.department?.name || "Sem departamento"}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      const categoryMap: Record<string, string> = {
        TECHNICAL: "Técnico",
        SOFT_SKILLS: "Habilidades Sociais",
        LEADERSHIP: "Liderança",
        COMPLIANCE: "Conformidade",
      }
      return categoryMap[category] || category
    },
  },
  {
    accessorKey: "instructor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instrutor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de Início
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("startDate") as Date
      return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    },
  },
  {
    accessorKey: "hours",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Horas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const hours = row.getValue("hours") as number
      return <div className="text-center">{hours}</div>
    },
  },
  {
    accessorKey: "participants",
    header: "Participantes",
    cell: ({ row }) => {
      const participants = row.original.trainingparticipant
      return <div className="text-center">{participants?.length || 0}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusMap: Record<string, { label: string; className: string }> = {
        COMPLETED: {
          label: "Concluído",
          className: "bg-green-600 text-white",
        },
        IN_PROGRESS: {
          label: "Em Andamento",
          className: "bg-blue-600 text-white",
        },
        PLANNED: {
          label: "Planejado",
          className: "bg-yellow-600 text-white",
        },
        CANCELLED: {
          label: "Cancelado",
          className: "bg-red-600 text-white",
        },
      }
      const { label, className } = statusMap[status] || { label: status, className: "" }
      return (
        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${className}`}>
          {label}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const training = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/trainings/${training.id}`}>
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 