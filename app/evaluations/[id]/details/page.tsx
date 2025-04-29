"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Download, FileText, Printer, Send, User, Building2, UserCog, Calendar, UserCheck, UserCog2, CheckCircle, AlertCircle } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface EvaluationAnswer {
  id: string
  evaluationId: string
  questionId: string
  evaluationquestion: {
    id: string
    text: string
    category: {
      id: string
      name: string
    }
    expectedScore: number
  }
  selfScore: number | null
  selfComment: string | null
  managerScore: number | null
  managerComment: string | null
}

interface Employee {
  id: string
  name: string
  position: {
    id: string
    name: string
  }
  department: {
    id: string
    name: string
  }
  matricula: string
}

interface User {
  id: string
  name: string
  position: string
}

interface EvaluationTemplate {
  id: string
  name: string
  description: string | null
  questions: {
    id: string
    text: string
    category: {
      id: string
      name: string
    }
  }[]
}

interface Evaluation {
  id: string
  employeeId: string
  evaluatorId: string
  templateId: string
  employee: Employee
  user: User
  evaluationtemplate: EvaluationTemplate
  date: string
  status: string
  selfEvaluation: boolean
  managerEvaluation: boolean
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
  evaluationanswer: EvaluationAnswer[]
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

// Função para calcular a média das notas
const calculateAverage = (scores: (number | null)[]) => {
  const validScores = scores.filter((score): score is number => score !== null)
  if (validScores.length === 0) return null
  return validScores.reduce((acc, score) => acc + score, 0) / validScores.length
}

// Função para calcular a média final
const calculateFinalScore = (selfScore: number | null, managerScore: number | null) => {
  if (selfScore === null || managerScore === null) return null
  return (selfScore * 0.4) + (managerScore * 0.6)
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
  const [isSaving, setIsSaving] = useState(false)
  const [canEdit, setCanEdit] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error", message: string } | null>(null)

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch(`/api/evaluations/${params.id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          if (response.status === 404) {
            throw new Error("Avaliação não encontrada")
          }
          throw new Error(errorData.error || 'Erro ao buscar avaliação')
        }
        
        const data = await response.json()
        setEvaluation(data)
        setCanEdit(true)
        // Se a avaliação estiver concluída, começa no modo de visualização
        if (data.status === "Concluída" || 
            (evaluationType === "self" && data.selfEvaluationStatus === "Concluída") ||
            (evaluationType === "manager" && data.managerEvaluationStatus === "Concluída")) {
          setIsEditing(false)
        } else {
          setIsEditing(true)
        }
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error)
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar a avaliação",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [params.id, evaluationType])

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

  const handleSaveEvaluation = async () => {
    try {
      setIsSaving(true)
      
      // Preparar os dados para envio
      const data = {
        ...evaluation,
        evaluationanswer: evaluation.evaluationanswer.map(answer => ({
          id: answer.id,
          selfScore: answer.selfScore || 0,
          managerScore: answer.managerScore || 0,
          selfComment: answer.selfComment || "",
          managerComment: answer.managerComment || ""
        }))
      }

      const response = await fetch(`/api/evaluations/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar avaliação')
      }

      const updatedEvaluation = await response.json()
      setEvaluation(updatedEvaluation)
      setIsEditing(false)
      setAlert({ type: "success", message: "Avaliação salva com sucesso!" })
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error)
      setAlert({ type: "error", message: "Erro ao salvar avaliação. Tente novamente." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
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

  // Calcular médias
  const selfAverage = calculateAverage(evaluation?.evaluationanswer.map(a => a.selfScore) || [])
  const managerAverage = calculateAverage(evaluation?.evaluationanswer.map(a => a.managerScore) || [])
  const expectedAverage = calculateAverage(evaluation?.evaluationanswer.map(a => a.evaluationquestion.expectedScore) || [])
  const finalAverage = calculateFinalScore(selfAverage, managerAverage)

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
      {alert && (
        <Alert variant={alert.type === "success" ? "default" : "destructive"} className="mb-4">
          {alert.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alert.type === "success" ? "Sucesso" : "Erro"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
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
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{evaluation.employee.name}</h2>
                  <p className="text-sm text-muted-foreground">{evaluation.employee.matricula}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Departamento:
                  </span>
                  <span className="text-sm">{evaluation.employee.department.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    Gestor:
                  </span>
                  <span className="text-sm">{evaluation.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Template:
                  </span>
                  <span className="text-sm">{evaluation.evaluationtemplate.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Data:
                  </span>
                  <span className="text-sm">{new Date(evaluation.date).toLocaleDateString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    Autoavaliação:
                  </span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      evaluation.evaluationanswer.some(a => a.selfScore !== null)
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {evaluation.evaluationanswer.some(a => a.selfScore !== null) ? "Concluída" : "Pendente"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <UserCog2 className="h-4 w-4 text-muted-foreground" />
                    Avaliação do Gestor:
                  </span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      evaluation.evaluationanswer.some(a => a.managerScore !== null)
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {evaluation.evaluationanswer.some(a => a.managerScore !== null) ? "Concluída" : "Pendente"}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação (Autoavaliação):</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      selfAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                      selfAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                      selfAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                      selfAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                      selfAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {selfAverage === null ? "Pendente" : selfAverage.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação (Gestor):</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      managerAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                      managerAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                      managerAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                      managerAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                      managerAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {managerAverage === null ? "Pendente" : managerAverage.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nota Esperada:</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      expectedAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                      expectedAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                      expectedAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                      expectedAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                      expectedAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {expectedAverage === null ? "Pendente" : expectedAverage.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação Final:</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      finalAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                      finalAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                      finalAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                      finalAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                      finalAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {finalAverage === null ? "Pendente" : finalAverage.toFixed(1)}/10
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
                <TabsContent value="overview" className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" />
                        <span className="text-sm font-medium">Gestor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Colaborador</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {evaluation?.evaluationanswer?.map((answer) => (
                        <Card key={answer.id}>
                          <CardHeader>
                            <CardTitle className="text-base">{answer.evaluationquestion?.text || 'Questão sem título'}</CardTitle>
                            <CardDescription>{answer.evaluationquestion?.description || ''}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getScoreClass(answer.managerScore)}>
                                  {answer.managerScore}
                                </Badge>
                                <span className="text-sm font-medium">{getScoreLabel(answer.managerScore)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getScoreClass(answer.selfScore)}>
                                  {answer.selfScore}
                                </Badge>
                                <span className="text-sm font-medium">{getScoreLabel(answer.selfScore)}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label>Comentário do Gestor</Label>
                              <Textarea value={answer.managerComment} readOnly />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label>Comentário do Colaborador</Label>
                              <Textarea value={answer.selfComment} readOnly />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold">Comparação de Avaliações</h3>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-medium">Autoavaliação</span>
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 hover:bg-green-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium">Avaliação do Gestor</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Questões */}
                  <div className="grid gap-1">
                    {Array.from(new Set(evaluation?.evaluationanswer?.map(answer => answer?.evaluationquestion?.category?.name) || [])).map(category => {
                      // Calcular a média da categoria
                      const categoryAnswers = evaluation?.evaluationanswer?.filter(
                        answer => answer?.evaluationquestion?.category?.name === category
                      ) || [];
                      const selfAverage = categoryAnswers.reduce((acc, answer) => acc + (answer?.selfScore ?? 0), 0) / (categoryAnswers.length || 1);
                      const managerAverage = categoryAnswers.reduce((acc, answer) => acc + (answer?.managerScore ?? 0), 0) / (categoryAnswers.length || 1);
                      const finalAverage = Number(((selfAverage * 0.4) + (managerAverage * 0.6)).toFixed(1));
                      
                      return (
                        <Card key={category} className="border border-gray-300 hover:border-gray-400 transition-colors">
                          <CardHeader className="bg-gray-50 p-2 border-b border-gray-300">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-bold">{category}</CardTitle>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                    Autoavaliação
                                  </Badge>
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                    selfAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                                    selfAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                                    selfAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                                    selfAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                                    selfAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  }`}>
                                    {selfAverage === null ? "Pendente" : selfAverage.toFixed(1)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                    Gestor
                                  </Badge>
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                    managerAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                                    managerAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                                    managerAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                                    managerAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                                    managerAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  }`}>
                                    {managerAverage === null ? "Pendente" : managerAverage.toFixed(1)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 px-1.5 py-0.5">
                                    Média
                                  </Badge>
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                    finalAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                                    finalAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                                    finalAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                                    finalAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                                    finalAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  }`}>
                                    {finalAverage === null ? "Pendente" : finalAverage.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="grid gap-1">
                              {evaluation.evaluationanswer
                                ?.filter(answer => answer?.evaluationquestion?.category?.name === category)
                                ?.map((answer) => (
                                  <Card key={answer.id} className="overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors">
                                    <CardHeader className="bg-gray-50 p-2 border-b border-gray-300">
                                      <CardTitle className="text-sm font-medium">{answer.evaluationquestion.text}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        {/* Autoavaliação */}
                                        <div className="space-y-1 border-r border-gray-300 pr-2">
                                          <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                              Autoavaliação
                                            </Badge>
                                            <span
                                              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                                answer.selfScore === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                                                answer.selfScore >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                                                answer.selfScore >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                                                answer.selfScore >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                                                answer.selfScore >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                              }`}
                                            >
                                              {answer.selfScore === null ? "Pendente" : answer.selfScore.toFixed(1)}
                                            </span>
                                          </div>
                                          <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                            <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                              {answer.selfComment || "Sem comentário"}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Avaliação do Gestor */}
                                        <div className="space-y-1 pl-2">
                                          <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                              Avaliação do Gestor
                                            </Badge>
                                            <span
                                              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                                answer.managerScore === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                                                answer.managerScore >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                                                answer.managerScore >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                                                answer.managerScore >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                                                answer.managerScore >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                              }`}
                                            >
                                              {answer.managerScore === null ? "Pendente" : answer.managerScore.toFixed(1)}
                                            </span>
                                          </div>
                                          <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                            <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                              {answer.managerComment || "Sem comentário"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Diferença e Nota Esperada */}
                                      <div className="mt-1 flex items-center justify-center gap-2 border-t border-gray-300 pt-1">
                                        <div className="rounded-full bg-gray-50 px-2 py-0.5 border border-gray-200">
                                          <span className="text-xs font-medium text-muted-foreground">
                                            Diferença: {Math.abs((answer.managerScore ?? 0) - (answer.selfScore ?? 0)).toFixed(1)}
                                          </span>
                                        </div>
                                        <div className="rounded-full bg-orange-50 px-2 py-0.5 border border-orange-200">
                                          <span className="text-xs font-medium text-orange-700">
                                            Nota Esperada: {answer.evaluationquestion.expectedScore.toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Pontuação Final */}
                  <Card className="border border-gray-300 hover:border-gray-400 transition-colors">
                    <CardHeader className="bg-gray-50 p-2 border-b border-gray-300">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold">Pontuação Final</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                              Autoavaliação
                            </Badge>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                              selfAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                              selfAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                              selfAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                              selfAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                              selfAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}>
                              {selfAverage === null ? "Pendente" : selfAverage.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                              Gestor
                            </Badge>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                              managerAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                              managerAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                              managerAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                              managerAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                              managerAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}>
                              {managerAverage === null ? "Pendente" : managerAverage.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 px-1.5 py-0.5">
                              Esperada
                            </Badge>
                            <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800">
                              {expectedAverage === null ? "Pendente" : expectedAverage.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 px-1.5 py-0.5">
                              Final
                            </Badge>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                              finalAverage === null ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" :
                              finalAverage >= 9 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                              finalAverage >= 8 ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                              finalAverage >= 7 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                              finalAverage >= 6 ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}>
                              {finalAverage === null ? "Pendente" : finalAverage.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Comentários Gerais */}
                  <Card className="border border-gray-300 hover:border-gray-400 transition-colors">
                    <CardHeader className="bg-gray-50 p-2 border-b border-gray-300">
                      <CardTitle className="text-base font-bold">Comentários Gerais</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="space-y-4">
                        {/* Pontos Fortes */}
                        <Card className="overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors">
                          <CardHeader className="bg-gray-50 p-2 border-b border-gray-300">
                            <CardTitle className="text-sm font-medium">Pontos Fortes</CardTitle>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1 border-r border-gray-300 pr-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                    Autoavaliação
                                  </Badge>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                    {evaluation.selfStrengths || "Sem comentário"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-1 pl-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                    Avaliação do Gestor
                                  </Badge>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                    {evaluation.managerStrengths || "Sem comentário"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Pontos de Melhoria */}
                        <Card className="overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors">
                          <CardHeader className="bg-gray-50 p-2 border-b border-gray-300">
                            <CardTitle className="text-sm font-medium">Pontos de Melhoria</CardTitle>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1 border-r border-gray-300 pr-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                    Autoavaliação
                                  </Badge>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                    {evaluation.selfImprovements || "Sem comentário"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-1 pl-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                    Avaliação do Gestor
                                  </Badge>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                    {evaluation.managerImprovements || "Sem comentário"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Metas e Objetivos */}
                        <Card className="overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors">
                          <CardHeader className="bg-gray-50 p-2 border-b border-gray-300">
                            <CardTitle className="text-sm font-medium">Metas e Objetivos</CardTitle>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1 border-r border-gray-300 pr-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                    Autoavaliação
                                  </Badge>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                    {evaluation.selfGoals || "Sem comentário"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-1 pl-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                    Avaliação do Gestor
                                  </Badge>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                  <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                    {evaluation.managerGoals || "Sem comentário"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Formulário de Avaliação</h3>
                    <div className="flex items-center gap-2">
                      <Select
                        value={evaluationType}
                        onValueChange={(value) => {
                          console.log("Tipo de avaliação alterado para:", value)
                          setEvaluationType(value as "self" | "manager")
                        }}
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

                  {/* Questões do Template */}
                  {evaluation?.evaluationtemplate && (
                    <div className="space-y-6">
                      {Array.from(new Set(evaluation?.evaluationtemplate?.questions?.map(q => q?.category?.name) || [])).map(category => (
                        <Card key={category}>
                          <CardHeader>
                            <CardTitle>{category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {evaluation.evaluationanswer
                                ?.filter(answer => answer?.evaluationquestion?.category?.name === category)
                                ?.map((answer) => (
                                  <div key={answer.id} className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className="font-medium">{answer.evaluationquestion.text}</p>
                                        {evaluationType === "self" ? (
                                          <div className="mt-4 space-y-2">
                                            <Label>Sua nota:</Label>
                                            <div className="flex items-center gap-2">
                                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                                <div key={score} className="relative flex flex-col items-center">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      console.log("Nota selecionada:", score, "para questão:", answer.id)
                                                      const newAnswers = evaluation.evaluationanswer.map((a) =>
                                                        a.id === answer.id
                                                          ? { ...a, selfScore: score }
                                                          : a
                                                      )
                                                      setEvaluation({ ...evaluation, evaluationanswer: newAnswers })
                                                    }}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                                      ${answer.selfScore === score
                                                        ? score >= 9 ? 'bg-green-500 text-white' :
                                                          score >= 8 ? 'bg-blue-500 text-white' :
                                                          score >= 7 ? 'bg-yellow-500 text-white' :
                                                          score >= 6 ? 'bg-orange-500 text-white' :
                                                          'bg-red-500 text-white'
                                                        : 'bg-muted hover:bg-muted/80'
                                                      }`}
                                                  >
                                                    {score}
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="mt-4 space-y-2">
                                            <Label>Nota do gestor:</Label>
                                            <div className="flex items-center gap-2">
                                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                                <div key={score} className="relative flex flex-col items-center">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      console.log("Nota selecionada:", score, "para questão:", answer.id)
                                                      const newAnswers = evaluation.evaluationanswer.map((a) =>
                                                        a.id === answer.id
                                                          ? { ...a, managerScore: score }
                                                          : a
                                                      )
                                                      setEvaluation({ ...evaluation, evaluationanswer: newAnswers })
                                                    }}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                                      ${answer.managerScore === score
                                                        ? score >= 9 ? 'bg-green-500 text-white' :
                                                          score >= 8 ? 'bg-blue-500 text-white' :
                                                          score >= 7 ? 'bg-yellow-500 text-white' :
                                                          score >= 6 ? 'bg-orange-500 text-white' :
                                                          'bg-red-500 text-white'
                                                        : 'bg-muted hover:bg-muted/80'
                                                      }`}
                                                  >
                                                    {score}
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      {evaluationType === "self" ? (
                                        <>
                                          <Label htmlFor={`self-comment-${answer.id}`}>Seu comentário:</Label>
                                          <Textarea
                                            id={`self-comment-${answer.id}`}
                                            value={answer.selfComment || ""}
                                            onChange={(e) => {
                                              const newAnswers = evaluation.evaluationanswer.map((a) =>
                                                a.id === answer.id
                                                  ? { ...a, selfComment: e.target.value }
                                                  : a
                                              )
                                              setEvaluation({ ...evaluation, evaluationanswer: newAnswers })
                                            }}
                                            placeholder="Adicione um comentário sobre sua avaliação..."
                                            className="min-h-[80px]"
                                            disabled={!isEditing}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <Label htmlFor={`manager-comment-${answer.id}`}>Comentário do gestor:</Label>
                                          <Textarea
                                            id={`manager-comment-${answer.id}`}
                                            value={answer.managerComment || ""}
                                            onChange={(e) => {
                                              const newAnswers = evaluation.evaluationanswer.map((a) =>
                                                a.id === answer.id
                                                  ? { ...a, managerComment: e.target.value }
                                                  : a
                                              )
                                              setEvaluation({ ...evaluation, evaluationanswer: newAnswers })
                                            }}
                                            placeholder="Adicione um comentário sobre a avaliação do gestor..."
                                            className="min-h-[80px]"
                                            disabled={!isEditing}
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Comentários Gerais */}
                  <Card className="border border-gray-300 hover:border-gray-400 transition-colors">
                    <CardHeader>
                      <CardTitle>Comentários Gerais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Pontos Fortes</Label>
                          <Textarea
                            value={evaluationType === "self" ? (evaluation.selfStrengths || "") : (evaluation.managerStrengths || "")}
                            onChange={(e) => {
                              if (evaluationType === "self") {
                                setEvaluation({ ...evaluation, selfStrengths: e.target.value })
                              } else {
                                setEvaluation({ ...evaluation, managerStrengths: e.target.value })
                              }
                            }}
                            placeholder="Liste os pontos fortes do colaborador..."
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label>Pontos de Melhoria</Label>
                          <Textarea
                            value={evaluationType === "self" ? (evaluation.selfImprovements || "") : (evaluation.managerImprovements || "")}
                            onChange={(e) => {
                              if (evaluationType === "self") {
                                setEvaluation({ ...evaluation, selfImprovements: e.target.value })
                              } else {
                                setEvaluation({ ...evaluation, managerImprovements: e.target.value })
                              }
                            }}
                            placeholder="Liste os pontos de melhoria do colaborador..."
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label>Metas e Objetivos</Label>
                          <Textarea
                            value={evaluationType === "self" ? (evaluation.selfGoals || "") : (evaluation.managerGoals || "")}
                            onChange={(e) => {
                              if (evaluationType === "self") {
                                setEvaluation({ ...evaluation, selfGoals: e.target.value })
                              } else {
                                setEvaluation({ ...evaluation, managerGoals: e.target.value })
                              }
                            }}
                            placeholder="Liste as metas e objetivos do colaborador..."
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Botões de Ação */}
                  <div className="flex justify-end gap-4">
                    {isEditing ? (
                      <Button
                        onClick={handleSaveEvaluation}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        {isSaving ? 'Salvando...' : 'Salvar Avaliação'}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleEditClick}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Editar Avaliação
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 