import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ScoreIndicator } from "./ScoreIndicator"

interface SummaryTabProps {
  evaluation: any
}

export function SummaryTab({ evaluation }: SummaryTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Processo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Tipo de Avaliação</p>
              <p className="font-medium">{evaluation.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data de Início</p>
              <p className="font-medium">
                {format(new Date(evaluation.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant={evaluation.isCompleted ? "success" : "warning"}>
                {evaluation.isCompleted ? "Concluída" : "Em Andamento"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pontuações por Seção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {evaluation.categories.map((category: any) => {
            const selfAvg = category.answers.reduce((acc: number, ans: any) => acc + (ans.selfScore || 0), 0) / category.answers.length
            const managerAvg = category.answers.reduce((acc: number, ans: any) => acc + (ans.managerScore || 0), 0) / category.answers.length
            
            return (
              <div key={category.id} className="space-y-2">
                <h3 className="font-medium">{category.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Autoavaliação</p>
                    <ScoreIndicator score={selfAvg} size="md" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avaliação do Gestor</p>
                    <ScoreIndicator score={managerAvg} size="md" />
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comentários Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Pontos Fortes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Autoavaliação</p>
                <p className="text-sm">{evaluation.selfStrengths || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avaliação do Gestor</p>
                <p className="text-sm">{evaluation.managerStrengths || "Não informado"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Áreas de Melhoria</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Autoavaliação</p>
                <p className="text-sm">{evaluation.selfImprovements || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avaliação do Gestor</p>
                <p className="text-sm">{evaluation.managerImprovements || "Não informado"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Metas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Autoavaliação</p>
                <p className="text-sm">{evaluation.selfGoals || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avaliação do Gestor</p>
                <p className="text-sm">{evaluation.managerGoals || "Não informado"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 