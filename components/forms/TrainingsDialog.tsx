"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Training {
  id: string
  name: string
  startDate: string
  endDate: string
  hours: number
  status: string
  category: string
  source: string
  instructor: string
  institution: string
}

interface TrainingsDialogProps {
  employeeId: string
  isOpen: boolean
  onClose: () => void
}

export function TrainingsDialog({
  employeeId,
  isOpen,
  onClose,
}: TrainingsDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch(`/api/employees/${employeeId}/trainings`)
        if (!response.ok) {
          throw new Error("Erro ao carregar treinamentos")
        }
        const data = await response.json()
        setTrainings(data)
      } catch (error) {
        console.error("Erro ao carregar treinamentos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os treinamentos.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen && employeeId) {
      fetchTrainings()
    }
  }, [employeeId, isOpen, toast])

  const handleViewDetails = (trainingId: string) => {
    router.push(`/trainings/${trainingId}`)
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500 hover:bg-green-600"
      case "IN_PROGRESS":
        return "bg-blue-500 hover:bg-blue-600"
      case "PLANNED":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Concluído"
      case "IN_PROGRESS":
        return "Em Andamento"
      case "PLANNED":
        return "Planejado"
      default:
        return status
    }
  }

  const getTrainingStatus = (training: Training) => {
    const today = new Date()
    const startDate = new Date(training.startDate)
    const endDate = training.endDate ? new Date(training.endDate) : null

    if (endDate && endDate < today) {
      return "COMPLETED"
    } else if (startDate <= today && (!endDate || endDate >= today)) {
      return "IN_PROGRESS"
    } else {
      return "PLANNED"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Histórico de Treinamentos</DialogTitle>
          <DialogDescription>
            Visualize o histórico de treinamentos do funcionário.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p>Carregando histórico...</p>
        ) : trainings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Treinamento</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data Inicial</TableHead>
                <TableHead>Data Final</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell>{training.name}</TableCell>
                  <TableCell>{training.category}</TableCell>
                  <TableCell>
                    {new Date(training.startDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {training.endDate ? new Date(training.endDate).toLocaleDateString('pt-BR') : "-"}
                  </TableCell>
                  <TableCell>{training.hours}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(getTrainingStatus(training))}>
                      {getStatusLabel(getTrainingStatus(training))}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(training.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhum treinamento registrado.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
} 