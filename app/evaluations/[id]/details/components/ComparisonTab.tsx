import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { ScoreIndicator } from "./ScoreIndicator"

interface ComparisonTabProps {
  evaluation: any
}

export function ComparisonTab({ evaluation }: ComparisonTabProps) {
  const getDifferenceIndicator = (selfScore: number, managerScore: number) => {
    const diff = managerScore - selfScore
    const absDiff = Math.abs(diff)

    if (diff === 0) {
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <Minus className="h-4 w-4" />
          <span className="text-sm">Igual</span>
        </div>
      )
    }

    if (diff > 0) {
      return (
        <div className="flex items-center gap-1 text-green-500">
          <ArrowUp className="h-4 w-4" />
          <span className="text-sm">+{absDiff.toFixed(1)}</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1 text-red-500">
        <ArrowDown className="h-4 w-4" />
        <span className="text-sm">-{absDiff.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Pontuações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {evaluation.categories.map((category: any) => {
            const selfAvg = category.answers.reduce((acc: number, ans: any) => acc + (ans.selfScore || 0), 0) / category.answers.length
            const managerAvg = category.answers.reduce((acc: number, ans: any) => acc + (ans.managerScore || 0), 0) / category.answers.length

            return (
              <div key={category.id} className="space-y-4">
                <h3 className="font-medium">{category.name}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Autoavaliação</p>
                    <ScoreIndicator score={selfAvg} size="md" />
                  </div>
                  <div className="flex items-center justify-center">
                    {getDifferenceIndicator(selfAvg, managerAvg)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Avaliação do Gestor</p>
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
          <CardTitle>Comparação de Comentários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Pontos Fortes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Autoavaliação</p>
                <p className="text-sm">{evaluation.selfStrengths || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Avaliação do Gestor</p>
                <p className="text-sm">{evaluation.managerStrengths || "Não informado"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Áreas de Melhoria</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Autoavaliação</p>
                <p className="text-sm">{evaluation.selfImprovements || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Avaliação do Gestor</p>
                <p className="text-sm">{evaluation.managerImprovements || "Não informado"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Metas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Autoavaliação</p>
                <p className="text-sm">{evaluation.selfGoals || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Avaliação do Gestor</p>
                <p className="text-sm">{evaluation.managerGoals || "Não informado"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 