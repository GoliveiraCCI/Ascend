"use client"

import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrainingStats } from "./training-stats"
import { TrainingFilters } from "./training-filters"
import { MonthlyTrainingsChart, CategoryTrainingsChart } from "./training-charts"
import { useState, useEffect } from "react"
import { Training, Department } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import NewTrainingForm from "./new-training-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface TrainingsPageProps {
  initialTrainings: Training[]
  departments: Department[]
}

export default function TrainingsPage({ initialTrainings, departments }: TrainingsPageProps) {
  const [trainings, setTrainings] = useState<Training[]>(initialTrainings)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    department: ""
  })

  useEffect(() => {
    let filteredTrainings = [...initialTrainings]

    // Aplicar filtros
    if (filters.search) {
      filteredTrainings = filteredTrainings.filter(t => 
        t.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.category) {
      filteredTrainings = filteredTrainings.filter(t => t.category === filters.category)
    }

    if (filters.status) {
      filteredTrainings = filteredTrainings.filter(t => t.status === filters.status)
    }

    if (filters.department) {
      filteredTrainings = filteredTrainings.filter(t => t.departmentId === filters.department)
    }

    setTrainings(filteredTrainings)
  }, [filters, initialTrainings])

  // Calcular estatísticas
  const totalTrainings = trainings.length
  const completedTrainings = trainings.filter(t => t.status === 'COMPLETED').length
  const inProgressTrainings = trainings.filter(t => t.status === 'IN_PROGRESS').length
  const plannedTrainings = trainings.filter(t => t.status === 'PLANNED').length
  const totalParticipants = trainings.reduce((acc, t) => acc + (t.participants?.length || 0), 0)
  const totalHours = trainings.reduce((acc, t) => acc + (t.hours || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Treinamentos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Treinamento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Treinamento</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Preencha os campos abaixo para criar um novo treinamento. Todos os campos marcados com * são obrigatórios.
              </p>
            </div>
            <NewTrainingForm 
              departments={departments} 
              onSuccess={() => {
                setIsDialogOpen(false)
                // Recarregar a página para atualizar a lista
                window.location.reload()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TrainingFilters filters={filters} onFilterChange={setFilters} departments={departments} />

      <MonthlyTrainingsChart trainings={trainings} />

      <div className="grid gap-4 md:grid-cols-2">
        <CategoryTrainingsChart trainings={trainings} />
        <div className="space-y-4">
          <TrainingStats
            totalTrainings={totalTrainings}
            completedTrainings={completedTrainings}
            inProgressTrainings={inProgressTrainings}
            plannedTrainings={plannedTrainings}
            totalParticipants={totalParticipants}
            totalHours={totalHours}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={trainings} />
        </CardContent>
      </Card>
    </div>
  )
} 