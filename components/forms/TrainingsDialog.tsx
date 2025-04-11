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
    if (isOpen) {
      fetchTrainings()
    }
  }, [isOpen, employeeId])

  const fetchTrainings = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/trainings`)
      if (!response.ok) throw new Error("Erro ao buscar treinamentos")
      const data = await response.json()
      setTrainings(data)
    } catch (error) {
      console.error("Erro ao buscar treinamentos:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar o histórico de treinamentos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (trainingId: string) => {
    router.push(`/trainings/${trainingId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluído":
        return "bg-green-500 hover:bg-green-600"
      case "em andamento":
        return "bg-blue-500 hover:bg-blue-600"
      case "planejado":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "cancelado":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
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
                  <TableCell>
                    {new Date(training.startDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {training.endDate ? new Date(training.endDate).toLocaleDateString('pt-BR') : "-"}
                  </TableCell>
                  <TableCell>{training.hours}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(training.status)}>
                      {training.status}
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