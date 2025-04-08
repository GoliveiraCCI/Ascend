"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Answer {
  id: string
  question: {
    id: string
    text: string
  }
  selfScore: number | null
  selfComment: string | null
  managerScore: number | null
  managerComment: string | null
}

interface Employee {
  id: string
  name: string
  position: string
  department: {
    name: string
  }
}

interface Evaluator {
  id: string
  name: string
  position: string
}

interface Template {
  id: string
  name: string
  description: string
}

interface Evaluation {
  id: string
  employee: Employee
  evaluator: Evaluator
  template: Template
  date: string
  status: string
  selfEvaluationStatus: string
  managerEvaluationStatus: string
  selfStrengths: string | null
  selfImprovements: string | null
  selfGoals: string | null
  managerStrengths: string | null
  managerImprovements: string | null
  managerGoals: string | null
  selfScore: number | null
  managerScore: number | null
  finalScore: number | null
  answers: Answer[]
}

// Função para classificar pontuações
const getScoreClass = (score: number | null) => {
  if (score === null) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  if (score >= 9) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  if (score >= 8) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
  if (score >= 7) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
  if (score >= 6) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
}

// Função para obter o texto da classificação
const getScoreLabel = (score: number | null) => {
  if (score === null) return "Pendente"
  if (score >= 9) return "Excelente"
  if (score >= 8) return "Muito Bom"
  if (score >= 7) return "Bom"
  if (score >= 6) return "Satisfatório"
  return "Precisa Melhorar"
}

export default function EvaluationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [evaluationType, setEvaluationType] = useState<"self" | "manager">("self")
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch(`/api/evaluations/${params.id}`)
        const data = await response.json()
        
        if (response.ok) {
          setEvaluation(data)
        } else {
          console.error("Erro ao carregar avaliação:", data.error)
          toast({
            title: "Erro",
            description: "Não foi possível carregar a avaliação",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar a avaliação",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [params.id])

  const handleGoBack = () => {
    router.back()
  }

  const handleScoreChange = (questionId: string, value: number) => {
    setScores({
      ...scores,
      [questionId]: value,
    })
  }

  const handleCommentChange = (questionId: string, value: string) => {
    setComments({
      ...comments,
      [questionId]: value,
    })
  }

  const handleSaveEvaluation = () => {
    toast({
      title: "Avaliação salva",
      description: "A avaliação foi salva com sucesso.",
    })
  }

  const handleSubmitEvaluation = () => {
    toast({
      title: "Avaliação enviada",
      description: "A avaliação foi enviada com sucesso.",
    })
  }

  // Exportar para PDF
  const exportToPDF = () => {
    const evaluationElement = document.getElementById("evaluation-content")
    if (!evaluationElement) return

    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 10

    html2canvas(evaluationElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgWidth = pdfWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (imgHeight <= pdfHeight - margin * 2) {
        const imgData = canvas.toDataURL("image/png")
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight)
      } else {
        let heightLeft = imgHeight
        let position = 0
        const imgData = canvas.toDataURL("image/png")

        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight, "", "FAST")
        heightLeft -= pdfHeight - margin * 2
        position = -(pdfHeight - margin * 2)

        while (heightLeft > 0) {
          pdf.addPage()
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight, "", "FAST")
          heightLeft -= pdfHeight - margin * 2
          position -= pdfHeight - margin * 2
        }
      }

      pdf.save(`avaliacao_${evaluation?.employee.name.replace(/\s+/g, "_")}.pdf`)

      toast({
        title: "PDF gerado",
        description: "A avaliação foi exportada para PDF com sucesso.",
      })
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Avaliação não encontrada</h1>
        <Button onClick={() => router.push("/evaluations")}>
          Voltar para lista de avaliações
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <h1 className="font-heading text-3xl">Avaliação de Desempenho</h1>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {evaluation.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={handleSaveEvaluation}>Salvar</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações da Avaliação</CardTitle>
            <CardDescription>Detalhes sobre esta avaliação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{evaluation.employee.name}</h2>
                  <p className="text-sm text-muted-foreground">{evaluation.employee.position}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Departamento:</span>
                  <span className="text-sm">{evaluation.employee.department.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Gestor:</span>
                  <span className="text-sm">{evaluation.evaluator.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Template:</span>
                  <span className="text-sm">{evaluation.template.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Data:</span>
                  <span className="text-sm">{new Date(evaluation.date).toLocaleDateString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Autoavaliação:</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      evaluation.selfEvaluationStatus === "Concluída"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {evaluation.selfEvaluationStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Avaliação do Gestor:</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      evaluation.managerEvaluationStatus === "Concluída"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {evaluation.managerEvaluationStatus}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação (Autoavaliação):</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                      evaluation.selfScore,
                    )}`}
                  >
                    {evaluation.selfScore?.toFixed(1) || "0"}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação (Gestor):</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                      evaluation.managerScore,
                    )}`}
                  >
                    {evaluation.managerScore?.toFixed(1) || "0"}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação Final:</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                      evaluation.finalScore,
                    )}`}
                  >
                    {evaluation.finalScore?.toFixed(1) || "0"}/10
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Avaliação de Desempenho</CardTitle>
            <CardDescription>Comparação entre autoavaliação e avaliação do gestor</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="comparison">Comparação</TabsTrigger>
                <TabsTrigger value="evaluation">Avaliação</TabsTrigger>
              </TabsList>
              <div id="evaluation-content">
                <TabsContent value="overview" className="space-y-6">
                  <div className="mt-6 space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Pontos Fortes (Autoavaliação)</h3>
                        <p className="text-sm">{evaluation.selfStrengths || "Não informado"}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Pontos Fortes (Gestor)</h3>
                        <p className="text-sm">{evaluation.managerStrengths || "Não informado"}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Áreas para Melhoria (Autoavaliação)</h3>
                        <p className="text-sm">{evaluation.selfImprovements || "Não informado"}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Áreas para Melhoria (Gestor)</h3>
                        <p className="text-sm">{evaluation.managerImprovements || "Não informado"}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Metas e Objetivos (Autoavaliação)</h3>
                        <div className="space-y-2">
                          {evaluation.selfGoals?.split("\n").map((goal, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-primary" />
                              <p className="text-sm">{goal}</p>
                            </div>
                          )) || <p className="text-sm">Não informado</p>}
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Metas e Objetivos (Gestor)</h3>
                        <div className="space-y-2">
                          {evaluation.managerGoals?.split("\n").map((goal, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-primary" />
                              <p className="text-sm">{goal}</p>
                            </div>
                          )) || <p className="text-sm">Não informado</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Comparação de Avaliações</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <span className="text-xs">Autoavaliação</span>
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs">Avaliação do Gestor</span>
                      </Badge>
                    </div>
                  </div>

                  {evaluation.answers.map((answer) => (
                    <div key={answer.id} className="space-y-2 border p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{answer.question.text}</Label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                              answer.selfScore,
                            )}`}
                          >
                            Auto: {answer.selfScore?.toFixed(1) || "0"}
                          </span>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                              answer.managerScore,
                            )}`}
                          >
                            Gestor: {answer.managerScore?.toFixed(1) || "0"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Dif: {Math.abs((answer.managerScore || 0) - (answer.selfScore || 0)).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Comentário (Autoavaliação):</Label>
                          <p className="text-sm p-2 bg-muted/50 rounded-md">
                            {answer.selfComment || "Sem comentário"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Comentário (Gestor):</Label>
                          <p className="text-sm p-2 bg-muted/50 rounded-md">
                            {answer.managerComment || "Sem comentário"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Formulário de Avaliação</h3>
                    <div className="flex items-center gap-2">
                      <Select
                        value={evaluationType}
                        onValueChange={(value) => setEvaluationType(value as "self" | "manager")}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Tipo de Avaliação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Autoavaliação</SelectItem>
                          <SelectItem value="manager">Avaliação do Gestor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {evaluation.answers.map((answer) => {
                    const currentScore = evaluationType === "self" ? answer.selfScore : answer.managerScore
                    const currentComment = evaluationType === "self" ? answer.selfComment : answer.managerComment

                    return (
                      <div key={answer.id} className="space-y-2 border p-4 rounded-md">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={answer.id} className="text-sm font-medium">
                            {answer.question.text}
                          </Label>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                              scores[answer.id] || currentScore,
                            )}`}
                          >
                            {(scores[answer.id] || currentScore || 0).toFixed(1)}/10
                          </span>
                        </div>

                        <div className="pt-2">
                          <Label className="text-sm mb-1 block">Pontuação:</Label>
                          <RadioGroup
                            value={(scores[answer.id] || currentScore || 0).toString()}
                            onValueChange={(value) => handleScoreChange(answer.id, Number.parseInt(value))}
                            className="flex flex-wrap gap-2"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                              <div key={value} className="flex items-center space-x-1">
                                <RadioGroupItem value={value.toString()} id={`${answer.id}-${value}`} />
                                <Label htmlFor={`${answer.id}-${value}`} className="text-sm">
                                  {value}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="pt-3">
                          <Label htmlFor={`comment-${answer.id}`} className="text-sm mb-1 block">
                            Comentário:
                          </Label>
                          <Textarea
                            id={`comment-${answer.id}`}
                            placeholder="Adicione um comentário sobre esta questão"
                            value={comments[answer.id] || currentComment || ""}
                            onChange={(e) => handleCommentChange(answer.id, e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    )
                  })}

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 font-medium">Comentários Gerais</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="strengths" className="text-sm">
                          Pontos Fortes
                        </Label>
                        <Textarea
                          id="strengths"
                          placeholder="Descreva os pontos fortes do funcionário"
                          defaultValue={
                            evaluationType === "self"
                              ? evaluation.selfStrengths || ""
                              : evaluation.managerStrengths || ""
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="improvements" className="text-sm">
                          Áreas para Melhoria
                        </Label>
                        <Textarea
                          id="improvements"
                          placeholder="Descreva as áreas que precisam de melhoria"
                          defaultValue={
                            evaluationType === "self"
                              ? evaluation.selfImprovements || ""
                              : evaluation.managerImprovements || ""
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="goals" className="text-sm">
                          Metas e Objetivos
                        </Label>
                        <Textarea
                          id="goals"
                          placeholder="Defina metas e objetivos para o próximo período"
                          defaultValue={
                            evaluationType === "self" ? evaluation.selfGoals || "" : evaluation.managerGoals || ""
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleSaveEvaluation}>
              Salvar Rascunho
            </Button>
            <Button onClick={handleSubmitEvaluation}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Avaliação
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 