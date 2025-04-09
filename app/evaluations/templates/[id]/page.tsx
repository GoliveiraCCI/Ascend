import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { prisma } from '@/lib/prisma'
import { TemplateActions } from './template-actions'
import { BackButton } from './back-button'

interface PageProps {
  params: {
    id: string
  }
}

async function getTemplate(id: string) {
  const template = await prisma.evaluationtemplate.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          category: true
        }
      },
      evaluation: {
        include: {
          employee: {
            include: {
              department: true
            }
          }
        }
      }
    }
  })

  if (!template) {
    notFound()
  }

  return template
}

export async function generateMetadata({ params }: PageProps) {
  const template = await getTemplate(params.id)
  return {
    title: `Modelo: ${template.name}`
  }
}

export default async function TemplateDetailsPage({ params }: PageProps) {
  const template = await getTemplate(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold">{template.name}</h1>
        <div className="flex items-center gap-2 ml-auto">
          <TemplateActions templateId={template.id} />
          <Badge variant="outline">
            {template.questions.length} questões
          </Badge>
        </div>
      </div>

      {template.description && (
        <p className="text-muted-foreground">{template.description}</p>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Questões</CardTitle>
          </CardHeader>
          <CardContent>
            {template.questions.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma questão cadastrada</p>
            ) : (
              <div className="space-y-4">
                {Object.values(
                  template.questions.reduce((acc: any, question: any) => {
                    const category = question.category
                    if (!acc[category.id]) {
                      acc[category.id] = {
                        category,
                        questions: []
                      }
                    }
                    acc[category.id].questions.push(question)
                    return acc
                  }, {} as Record<string, { category: any, questions: any[] }>)
                ).map(({ category, questions }, index, array) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{category.name}</h3>
                      <Badge variant="secondary" className="ml-2">
                        {questions.length} {questions.length === 1 ? 'questão' : 'questões'}
                      </Badge>
                    </div>
                    <div className="space-y-2 pl-4">
                      {questions.map((question: any) => (
                        <div key={question.id} className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="text-sm">{question.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {index < array.length - 1 && (
                      <div className="my-4 border-t border-border" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {template.evaluation.map((evaluation) => (
                <div key={evaluation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium">
                        {evaluation.employee.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.employee.department.name}
                      </p>
                    </div>
                    <Badge variant={
                      evaluation.status === 'Concluída' ? 'success' :
                      evaluation.status === 'Pendente' ? 'warning' :
                      'destructive'
                    }>
                      {evaluation.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Criada em {format(new Date(evaluation.createdAt), 'PPP', { locale: ptBR })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 