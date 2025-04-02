import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Clock } from "lucide-react"

interface TrainingStatsProps {
  totalTrainings: number
  completedTrainings: number
  inProgressTrainings: number
  plannedTrainings: number
  totalParticipants: number
  totalHours: number
}

export function TrainingStats({
  totalTrainings,
  completedTrainings,
  inProgressTrainings,
  plannedTrainings,
  totalParticipants,
  totalHours,
}: TrainingStatsProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Treinamentos</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTrainings}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {completedTrainings} concluídos • {inProgressTrainings} em andamento • {plannedTrainings} planejados
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParticipants}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Média de {(totalParticipants / totalTrainings).toFixed(1)} por treinamento
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Média de {(totalHours / totalTrainings).toFixed(1)} horas por treinamento
          </div>
        </CardContent>
      </Card>
    </>
  )
} 