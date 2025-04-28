import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { ScoreIndicator } from "./ScoreIndicator"

interface ComparisonTabProps {
  evaluation: any
}

export function ComparisonTab({ evaluation }: ComparisonTabProps) {
  const getDifferenceIndicator = (selfScore: number, managerScore: number, expectedScore: number) => {
    const selfDiff = selfScore - expectedScore
    const managerDiff = managerScore - expectedScore
    const absSelfDiff = Math.abs(selfDiff)
    const absManagerDiff = Math.abs(managerDiff)

    return (
      <div className="flex flex-col items-center gap-2">
        <div className={`flex items-center gap-1 ${selfDiff === 0 ? 'text-gray-500' : selfDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {selfDiff === 0 ? (
            <Minus className="h-4 w-4" />
          ) : selfDiff > 0 ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          <span className="text-sm">{selfDiff === 0 ? 'Igual' : `${selfDiff > 0 ? '+' : '-'}${absSelfDiff.toFixed(1)}`}</span>
        </div>
        <div className={`flex items-center gap-1 ${managerDiff === 0 ? 'text-gray-500' : managerDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {managerDiff === 0 ? (
            <Minus className="h-4 w-4" />
          ) : managerDiff > 0 ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          <span className="text-sm">{managerDiff === 0 ? 'Igual' : `${managerDiff > 0 ? '+' : '-'}${absManagerDiff.toFixed(1)}`}</span>
        </div>
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
            const expectedAvg = category.answers.reduce((acc: number, ans: any) => acc + (ans.expectedScore || 0), 0) / category.answers.length

            return (
              <div key={category.id} className="space-y-4">
                <h3 className="font-medium">{category.name}</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Autoavaliação</p>
                    <ScoreIndicator score={selfAvg} size="md" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Avaliação do Gestor</p>
                    <ScoreIndicator score={managerAvg} size="md" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Nota Esperada</p>
                    <ScoreIndicator score={expectedAvg} size="md" variant="secondary" />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-500 mb-2">Diferença</div>
                    {getDifferenceIndicator(selfAvg, managerAvg, expectedAvg)}
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