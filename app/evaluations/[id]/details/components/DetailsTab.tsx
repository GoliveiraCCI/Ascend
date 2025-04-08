import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreIndicator } from "./ScoreIndicator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface DetailsTabProps {
  evaluation: any
}

export function DetailsTab({ evaluation }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {evaluation.categories.map((category: any) => {
          const selfAvg = category.answers.reduce((acc: number, ans: any) => acc + (ans.selfScore || 0), 0) / category.answers.length
          const managerAvg = category.answers.reduce((acc: number, ans: any) => acc + (ans.managerScore || 0), 0) / category.answers.length

          return (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{category.name}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Auto:</span>
                      <ScoreIndicator score={selfAvg} showLabel={false} size="sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Gestor:</span>
                      <ScoreIndicator score={managerAvg} showLabel={false} size="sm" />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {category.answers.map((answer: any) => (
                    <Card key={answer.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{answer.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Autoavaliação</p>
                            <ScoreIndicator score={answer.selfScore} size="md" />
                            {answer.selfComment && (
                              <p className="text-sm mt-2">{answer.selfComment}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Avaliação do Gestor</p>
                            <ScoreIndicator score={answer.managerScore} size="md" />
                            {answer.managerComment && (
                              <p className="text-sm mt-2">{answer.managerComment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
} 