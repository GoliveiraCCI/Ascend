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

interface Evaluation {
  id: string
  employee: {
    id: string
    name: string
    matricula: string
    department: {
      id: string
      name: string
    }
  }
  evaluator: {
    id: string
    name: string
  }
  template: {
    id: string
    name: string
    description: string
  }
  date: string
  status: string
  selfEvaluation: boolean
  selfEvaluationStatus: string
  selfStrengths: string | null
  selfImprovements: string | null
  selfGoals: string | null
  selfScore: number | null
  managerEvaluation: boolean
  managerEvaluationStatus: string
  managerStrengths: string | null
  managerImprovements: string | null
  managerGoals: string | null
  managerScore: number | null
  finalScore: number | null
  answers: {
    id: string
    question: {
      id: string
      text: string
    }
    selfScore: number | null
    selfComment: string | null
    managerScore: number | null
    managerComment: string | null
  }[]
}

interface EvaluationsDialogProps {
  employeeId: string
  isOpen: boolean
  onClose: () => void
}

export function EvaluationsDialog({
  employeeId,
  isOpen,
  onClose,
}: EvaluationsDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchEvaluations()
    }
  }, [isOpen, employeeId])

  const fetchEvaluations = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/evaluations`)
      if (!response.ok) throw new Error("Erro ao buscar avaliações")
      const data = await response.json()
      setEvaluations(data)
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar o histórico de avaliações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (evaluationId: string) => {
    router.push(`/evaluations/${evaluationId}/details`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800'
      case 'Finalizado':
        return 'bg-green-100 text-green-800'
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateFinalScore = (evaluation: Evaluation) => {
    if (!evaluation.answers || evaluation.answers.length === 0) {
      return null
    }

    // Calcular médias apenas para respostas que têm notas
    const validSelfScores = evaluation.answers.filter(a => a.selfScore !== null).map(a => a.selfScore as number)
    const validManagerScores = evaluation.answers.filter(a => a.managerScore !== null).map(a => a.managerScore as number)

    if (validSelfScores.length === 0 || validManagerScores.length === 0) {
      return null
    }

    const selfAverage = Number((validSelfScores.reduce((acc, score) => acc + score, 0) / validSelfScores.length).toFixed(1))
    const managerAverage = Number((validManagerScores.reduce((acc, score) => acc + score, 0) / validManagerScores.length).toFixed(1))

    // Calcular a média ponderada usando 40% da autoavaliação e 60% da avaliação do gestor
    const weightedScore = (selfAverage * 0.4) + (managerAverage * 0.6)
    return Number(weightedScore.toFixed(1))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Histórico de Avaliações</DialogTitle>
          <DialogDescription>
            Visualize o histórico de avaliações do funcionário.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p>Carregando histórico...</p>
        ) : evaluations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo de Avaliação</TableHead>
                <TableHead>Data de Aplicação</TableHead>
                <TableHead>Nota Final</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.template.name}</TableCell>
                  <TableCell>
                    {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {calculateFinalScore(evaluation)?.toFixed(1) || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(evaluation.status)}>
                      {evaluation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(evaluation.id)}
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
            Nenhuma avaliação registrada.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
} 