"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, FileText, Printer, Send, User } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle, Clock, Circle } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

// Dados de exemplo para a avaliação
const evaluationData = {
  id: "EVAL001",
  employeeName: "João Silva",
  employeeId: "EMP001",
  department: "TI",
  position: "Desenvolvedor Senior",
  manager: "Maria Santos",
  date: "2024-03-15",
  dueDate: "2024-03-30",
  selfEvaluationDate: "2024-03-10",
  managerEvaluationDate: "2024-03-15",
  selfEvaluationStatus: "Concluída",
  managerEvaluationStatus: "Concluída",
  type: "Avaliação Anual",
  sections: [
    {
      id: "technical",
      name: "Habilidades Técnicas",
      questions: [
        {
          id: "q1",
          text: "Demonstra conhecimento técnico adequado para a função",
          selfScore: 8,
          managerScore: 9,
          selfComment: "Tenho buscado me manter atualizado com as tecnologias utilizadas pela empresa.",
          managerComment: "Excelente domínio das tecnologias utilizadas no projeto.",
        },
        {
          id: "q2",
          text: "Mantém-se atualizado com as novas tecnologias e práticas",
          selfScore: 7,
          managerScore: 8,
          selfComment: "Participo de cursos online e eventos da área.",
          managerComment: "Tem buscado constantemente novos conhecimentos.",
        },
        {
          id: "q3",
          text: "Aplica conhecimentos técnicos para resolver problemas complexos",
          selfScore: 8,
          managerScore: 9,
          selfComment: "Consigo resolver a maioria dos problemas técnicos que surgem.",
          managerComment: "Resolveu problemas críticos com soluções inovadoras.",
        },
      ],
    },
    {
      id: "communication",
      name: "Comunicação",
      questions: [
        {
          id: "q4",
          text: "Comunica-se de forma clara e eficaz com a equipe",
          selfScore: 7,
          managerScore: 8,
          selfComment: "Procuro ser claro nas reuniões de equipe.",
          managerComment: "Boa comunicação, mas pode melhorar em reuniões com clientes.",
        },
        {
          id: "q5",
          text: "Apresenta ideias e informações de maneira organizada",
          selfScore: 6,
          managerScore: 7,
          selfComment: "Às vezes tenho dificuldade em organizar minhas ideias.",
          managerComment: "Precisa estruturar melhor suas apresentações.",
        },
        {
          id: "q6",
          text: "Escuta ativamente e responde apropriadamente",
          selfScore: 8,
          managerScore: 8,
          selfComment: "Procuro entender o ponto de vista dos colegas antes de responder.",
          managerComment: "Demonstra atenção às opiniões dos colegas.",
        },
      ],
    },
    {
      id: "teamwork",
      name: "Trabalho em Equipe",
      questions: [
        {
          id: "q7",
          text: "Colabora efetivamente com os membros da equipe",
          selfScore: 8,
          managerScore: 9,
          selfComment: "Sempre me disponibilizo para ajudar os colegas.",
          managerComment: "Excelente colaborador, sempre disposto a ajudar.",
        },
        {
          id: "q8",
          text: "Contribui positivamente para o ambiente de trabalho",
          selfScore: 8,
          managerScore: 9,
          selfComment: "Procuro manter um ambiente positivo e colaborativo.",
          managerComment: "Mantém um ambiente positivo mesmo sob pressão.",
        },
        {
          id: "q9",
          text: "Compartilha conhecimento e apoia colegas",
          selfScore: 7,
          managerScore: 8,
          selfComment: "Compartilho meus conhecimentos quando solicitado.",
          managerComment: "Tem realizado sessões de compartilhamento de conhecimento.",
        },
      ],
    },
    {
      id: "leadership",
      name: "Liderança",
      questions: [
        {
          id: "q10",
          text: "Demonstra iniciativa e proatividade",
          selfScore: 8,
          managerScore: 9,
          selfComment: "Procuro antecipar problemas e propor soluções.",
          managerComment: "Frequentemente propõe melhorias nos processos.",
        },
        {
          id: "q11",
          text: "Inspira e motiva os colegas de trabalho",
          selfScore: 7,
          managerScore: 8,
          selfComment: "Tento motivar a equipe nos momentos difíceis.",
          managerComment: "Bom exemplo para a equipe.",
        },
        {
          id: "q12",
          text: "Assume responsabilidade por suas ações e decisões",
          selfScore: 9,
          managerScore: 9,
          selfComment: "Sempre assumo a responsabilidade pelos meus erros e acertos.",
          managerComment: "Sempre assume responsabilidade pelos resultados.",
        },
      ],
    },
  ],
  comments: {
    selfStrengths:
      "Considero meus pontos fortes o conhecimento técnico e a capacidade de trabalhar em equipe. Tenho facilidade em aprender novas tecnologias e compartilhar conhecimento.",
    selfImprovements:
      "Preciso melhorar minhas habilidades de comunicação, especialmente em apresentações formais. Também preciso aprimorar a organização do meu trabalho.",
    selfGoals:
      "1. Melhorar minhas habilidades de comunicação\n2. Aprender novas tecnologias relevantes para o projeto\n3. Contribuir mais ativamente em reuniões de equipe",
    managerStrengths:
      "João demonstra excelente conhecimento técnico e habilidade para resolver problemas complexos. Sua capacidade de trabalhar em equipe e compartilhar conhecimento é notável.",
    managerImprovements:
      "Pode melhorar na comunicação de ideias complexas e na documentação de seu trabalho. Recomendo focar em desenvolver habilidades de apresentação.",
    managerGoals:
      "1. Aprimorar habilidades de comunicação escrita e verbal\n2. Liderar pelo menos um projeto importante no próximo ano\n3. Compartilhar conhecimento através de workshops internos",
  },
}

// Função para classificar pontuações
const getScoreClass = (score: number | null) => {
  if (score === null) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  if (score >= 9) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  if (score >= 6) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
  if (score >= 4) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
  if (score >= 2) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
}

// Função para obter o texto da classificação
const getScoreLabel = (score: number | null) => {
  if (score === null) return "Pendente"
  if (score >= 9) return "Excelente"
  if (score >= 6) return "Bom"
  if (score >= 4) return "Médio"
  if (score >= 2) return "Ruim"
  return "Péssimo"
}

// Calcular pontuação média
const calculateAverageScore = (sections: typeof evaluationData.sections, type: "self" | "manager") => {
  let totalScore = 0
  let totalQuestions = 0

  sections.forEach((section) => {
    section.questions.forEach((question) => {
      const score = type === "self" ? question.selfScore : question.managerScore
      if (score !== null) {
        totalScore += score
        totalQuestions++
      }
    })
  })

  return totalQuestions > 0 ? totalScore / totalQuestions : 0
}

interface EvaluationPageProps {
  params: {
    id: string;
  };
}

export default function EvaluationPage({ params }: EvaluationPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("questions")
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch(`/api/evaluations/${params.id}`)
        if (!response.ok) {
          throw new Error("Erro ao carregar avaliação")
        }
        const data = await response.json()
        setEvaluation(data)
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error)
        toast({
          title: "Erro",
          description: "Erro ao carregar avaliação",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvaluation()
  }, [params.id])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/evaluations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: evaluation.answers.map((answer: any) => ({
            id: answer.id,
            questionId: answer.questionId,
            selfScore: answer.selfScore,
            selfComment: answer.selfComment,
            managerScore: answer.managerScore,
            managerComment: answer.managerComment,
          })),
          selfStrengths: evaluation.selfStrengths,
          selfImprovements: evaluation.selfImprovements,
          selfGoals: evaluation.selfGoals,
          managerStrengths: evaluation.managerStrengths,
          managerImprovements: evaluation.managerImprovements,
          managerGoals: evaluation.managerGoals,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar avaliação")
      }

      const updatedEvaluation = await response.json()
      setEvaluation(updatedEvaluation)

      toast({
        title: "Sucesso",
        description: "Avaliação salva com sucesso",
      })
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error)
      toast({
        title: "Erro",
        description: "Erro ao salvar avaliação",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswerChange = (answerId: string, field: string, value: any) => {
    setEvaluation((prev: any) => ({
      ...prev,
      answers: prev.answers.map((answer: any) =>
        answer.id === answerId ? { ...answer, [field]: value } : answer
      ),
    }))
  }

  const handleEvaluationChange = (field: string, value: string) => {
    setEvaluation((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Finalizado":
        return "success"
      case "Pendente":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Finalizado":
        return <CheckCircle className="h-4 w-4" />
      case "Pendente":
        return <Clock className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Carregando avaliação...</p>
        </div>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Avaliação não encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Avaliação de Desempenho</h1>
          <p className="text-muted-foreground">
            {format(new Date(evaluation.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-4">
          <Badge variant={getStatusBadgeVariant(evaluation.selfEvaluationStatus)}>
            {getStatusIcon(evaluation.selfEvaluationStatus)}
            Autoavaliação: {evaluation.selfEvaluationStatus}
          </Badge>
          <Badge variant={getStatusBadgeVariant(evaluation.managerEvaluationStatus)}>
            {getStatusIcon(evaluation.managerEvaluationStatus)}
            Avaliação do Gestor: {evaluation.managerEvaluationStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{evaluation.employee.name}</p>
              <p className="text-sm text-muted-foreground">
                Matrícula: {evaluation.employee.matricula}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{evaluation.evaluator.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{evaluation.template.name}</p>
              <p className="text-sm text-muted-foreground">
                {evaluation.template.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="questions">Questões</TabsTrigger>
          <TabsTrigger value="self">Autoavaliação</TabsTrigger>
          <TabsTrigger value="manager">Avaliação do Gestor</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          {evaluation?.template.questions.map((question: any) => {
            const answer = evaluation.answers.find(
              (a: any) => a.questionId === question.id
            )

            return (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle>{question.text}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Autoavaliação</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Nota:</span>
                          <span className={`px-2 py-1 rounded-md text-sm ${getScoreClass(answer?.selfScore)}`}>
                            {answer?.selfScore !== null ? `${answer.selfScore} - ${getScoreLabel(answer.selfScore)}` : "Pendente"}
                          </span>
                        </div>
                        <RadioGroup
                          value={answer?.selfScore?.toString()}
                          onValueChange={(value) =>
                            handleAnswerChange(answer.id, "selfScore", parseInt(value))
                          }
                          className="flex gap-4 flex-wrap"
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                            <div key={score} className="flex items-center space-x-2">
                              <RadioGroupItem value={score.toString()} id={`self-${question.id}-${score}`} />
                              <Label htmlFor={`self-${question.id}-${score}`}>{score}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Textarea
                          placeholder="Comentários"
                          value={answer?.selfComment || ""}
                          onChange={(e) =>
                            handleAnswerChange(answer.id, "selfComment", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Avaliação do Gestor</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Nota:</span>
                          <span className={`px-2 py-1 rounded-md text-sm ${getScoreClass(answer?.managerScore)}`}>
                            {answer?.managerScore !== null ? `${answer.managerScore} - ${getScoreLabel(answer.managerScore)}` : "Pendente"}
                          </span>
                        </div>
                        <RadioGroup
                          value={answer?.managerScore?.toString()}
                          onValueChange={(value) =>
                            handleAnswerChange(answer.id, "managerScore", parseInt(value))
                          }
                          className="flex gap-4 flex-wrap"
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                            <div key={score} className="flex items-center space-x-2">
                              <RadioGroupItem value={score.toString()} id={`manager-${question.id}-${score}`} />
                              <Label htmlFor={`manager-${question.id}-${score}`}>{score}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Textarea
                          placeholder="Comentários"
                          value={answer?.managerComment || ""}
                          onChange={(e) =>
                            handleAnswerChange(answer.id, "managerComment", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="self" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pontos Fortes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Descreva seus pontos fortes"
                value={evaluation?.selfStrengths || ""}
                onChange={(e) => handleEvaluationChange("selfStrengths", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pontos de Melhoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Descreva seus pontos de melhoria"
                value={evaluation?.selfImprovements || ""}
                onChange={(e) => handleEvaluationChange("selfImprovements", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Descreva suas metas"
                value={evaluation?.selfGoals || ""}
                onChange={(e) => handleEvaluationChange("selfGoals", e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manager" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pontos Fortes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Descreva os pontos fortes do funcionário"
                value={evaluation?.managerStrengths || ""}
                onChange={(e) => handleEvaluationChange("managerStrengths", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pontos de Melhoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Descreva os pontos de melhoria do funcionário"
                value={evaluation?.managerImprovements || ""}
                onChange={(e) => handleEvaluationChange("managerImprovements", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Descreva as metas para o funcionário"
                value={evaluation?.managerGoals || ""}
                onChange={(e) => handleEvaluationChange("managerGoals", e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Avaliação"}
        </Button>
      </div>
    </div>
  )
}

