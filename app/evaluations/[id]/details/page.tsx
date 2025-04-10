"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Download, FileText, Printer, Send, User } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { ResponsiveContainer } from "recharts"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface EvaluationAnswer {
  id: string
  evaluationquestion: {
    id: string
    text: string
    category: {
      name: string
    }
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

interface User {
  id: string
  name: string
  position: string
}

interface EvaluationTemplate {
  id: string
  name: string
  description: string
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
  employee: Employee
  user: User
  evaluationtemplate: EvaluationTemplate
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
      setAlert(null)

      // Preparar as respostas para envio
      const answers = evaluation.evaluationanswer.map(answer => ({
        id: answer.id,
        score: evaluationType === "self" ? answer.selfScore : answer.managerScore,
        comment: evaluationType === "self" ? answer.selfComment : answer.managerComment
      }))

      // Validar se todas as questões foram respondidas
      const unansweredQuestions = answers.filter(a => a.score === null)
      if (unansweredQuestions.length > 0) {
        setAlert({
          type: "error",
          message: "Por favor, responda todas as questões antes de salvar"
        })
        return
      }

      const response = await fetch(`/api/evaluations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: evaluationType,
          answers,
          strengths: evaluationType === "self" ? evaluation.selfStrengths : evaluation.managerStrengths,
          improvements: evaluationType === "self" ? evaluation.selfImprovements : evaluation.managerImprovements,
          goals: evaluationType === "self" ? evaluation.selfGoals : evaluation.managerGoals
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao salvar avaliação")
      }

      // Recarregar os dados da avaliação
      const updatedEvaluation = await response.json()
      setEvaluation(updatedEvaluation)
      setIsEditing(false)

      setAlert({
        type: "success",
        message: "Avaliação salva com sucesso!"
      })

      // Limpar o alerta após 5 segundos
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error)
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Ocorreu um erro ao salvar a avaliação"
      })
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
      {/* Alert */}
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
                  <span className="text-sm">{evaluation.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Template:</span>
                  <span className="text-sm">{evaluation.evaluationtemplate.name}</span>
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
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Gráfico Radar - Médias Brutas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Comparativo por Categoria</CardTitle>
                        <CardDescription>Autoavaliação vs Avaliação do Gestor</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="80%"
                              data={Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.name)))
                                .map(category => {
                                  const categoryAnswers = evaluation.evaluationanswer.filter(a => a.evaluationquestion.category.name === category);
                                  const selfAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.selfScore || 0), 0) / categoryAnswers.length).toFixed(1));
                                  const managerAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.managerScore || 0), 0) / categoryAnswers.length).toFixed(1));
                                  
                                  return {
                                    category,
                                    self: selfAverage,
                                    manager: managerAverage
                                  };
                                })}
                            >
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis 
                                dataKey="category" 
                                tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(value, index) => {
                                  const data = Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.name)))
                                    .map(category => {
                                      const categoryAnswers = evaluation.evaluationanswer.filter(a => a.evaluationquestion.category.name === category);
                                      const selfAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.selfScore || 0), 0) / categoryAnswers.length).toFixed(1));
                                      const managerAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.managerScore || 0), 0) / categoryAnswers.length).toFixed(1));
                                      return { category, selfAverage, managerAverage };
                                    });
                                  const item = data[index];
                                  return `${value}\n${item.selfAverage}/${item.managerAverage}`;
                                }}
                              />
                              <PolarRadiusAxis 
                                angle={30} 
                                domain={[0, 5]} 
                                tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                              />
                              <Radar
                                name="Autoavaliação"
                                dataKey="self"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                              />
                              <Radar
                                name="Gestor"
                                dataKey="manager"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.6}
                              />
                              <Legend 
                                wrapperStyle={{ 
                                  paddingTop: '20px',
                                  fontSize: '12px',
                                  fontWeight: 500
                                }}
                              />
                              <foreignObject x="80%" y="5%" width="100" height="50">
                                <div className="flex flex-col gap-1">
                                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                                    Auto: {Number((evaluation.evaluationanswer.reduce((sum, a) => sum + (a.selfScore || 0), 0) / evaluation.evaluationanswer.length).toFixed(1))}
                                  </Badge>
                                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                                    Gestor: {Number((evaluation.evaluationanswer.reduce((sum, a) => sum + (a.managerScore || 0), 0) / evaluation.evaluationanswer.length).toFixed(1))}
                                  </Badge>
                      </div>
                              </foreignObject>
                            </RadarChart>
                          </ResponsiveContainer>
                      </div>
                      </CardContent>
                    </Card>

                    {/* Gráfico Radar - Média Ponderada */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Média Ponderada por Categoria</CardTitle>
                        <CardDescription>Média Final (40% Autoavaliação + 60% Gestor)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="80%"
                              data={Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.name)))
                                .map(category => {
                                  const categoryAnswers = evaluation.evaluationanswer.filter(a => a.evaluationquestion.category.name === category);
                                  const selfAverage = categoryAnswers.reduce((sum, a) => sum + (a.selfScore || 0), 0) / categoryAnswers.length;
                                  const managerAverage = categoryAnswers.reduce((sum, a) => sum + (a.managerScore || 0), 0) / categoryAnswers.length;
                                  const finalAverage = Number(((selfAverage * 0.4) + (managerAverage * 0.6)).toFixed(1));
                                  
                                  return {
                                    category,
                                    final: finalAverage
                                  };
                                })}
                            >
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis 
                                dataKey="category" 
                                tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(value, index) => {
                                  const data = Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.name)))
                                    .map(category => {
                                      const categoryAnswers = evaluation.evaluationanswer.filter(a => a.evaluationquestion.category.name === category);
                                      const selfAverage = categoryAnswers.reduce((sum, a) => sum + (a.selfScore || 0), 0) / categoryAnswers.length;
                                      const managerAverage = categoryAnswers.reduce((sum, a) => sum + (a.managerScore || 0), 0) / categoryAnswers.length;
                                      const finalAverage = Number(((selfAverage * 0.4) + (managerAverage * 0.6)).toFixed(1));
                                      return { category, finalAverage };
                                    });
                                  const item = data[index];
                                  return `${value}\n${item.finalAverage}`;
                                }}
                              />
                              <PolarRadiusAxis 
                                angle={30} 
                                domain={[0, 5]} 
                                tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                              />
                              <Radar
                                name="Média Final"
                                dataKey="final"
                                stroke="#8b5cf6"
                                fill="#8b5cf6"
                                fillOpacity={0.6}
                              />
                              <Legend 
                                wrapperStyle={{ 
                                  paddingTop: '20px',
                                  fontSize: '12px',
                                  fontWeight: 500
                                }}
                              />
                              <foreignObject x="80%" y="5%" width="100" height="50">
                                <div className="flex flex-col gap-1">
                                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                                    Média: {Math.round((evaluation.evaluationanswer.reduce((sum, a) => sum + (a.selfScore || 0), 0) / evaluation.evaluationanswer.length * 0.4) + 
                                                      (evaluation.evaluationanswer.reduce((sum, a) => sum + (a.managerScore || 0), 0) / evaluation.evaluationanswer.length * 0.6))}
                                  </Badge>
                            </div>
                              </foreignObject>
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
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
                    {Array.from(new Set(evaluation.evaluationanswer.map(answer => answer.evaluationquestion.category.name))).map(category => {
                      // Calcular a média da categoria
                      const categoryAnswers = evaluation.evaluationanswer.filter(
                        answer => answer.evaluationquestion.category.name === category
                      )
                      const selfAverage = categoryAnswers.reduce((acc, answer) => acc + (answer.selfScore ?? 0), 0) / categoryAnswers.length
                      const managerAverage = categoryAnswers.reduce((acc, answer) => acc + (answer.managerScore ?? 0), 0) / categoryAnswers.length
                      const finalAverage = Number(((selfAverage * 0.4) + (managerAverage * 0.6)).toFixed(1))
                      
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
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(selfAverage)}`}>
                                    {selfAverage.toFixed(1)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                    Gestor
                                  </Badge>
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(managerAverage)}`}>
                                    {managerAverage.toFixed(1)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 px-1.5 py-0.5">
                                    Média
                                  </Badge>
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(finalAverage)}`}>
                                    {finalAverage.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="grid gap-1">
                              {evaluation.evaluationanswer
                                .filter(answer => answer.evaluationquestion.category.name === category)
                                .map((answer) => (
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
                                              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(
                                                answer.selfScore ?? 0
                            )}`}
                          >
                                              {(answer.selfScore ?? 0).toFixed(1)}
                          </span>
                                          </div>
                                          <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                            <p className="text-xs text-muted-foreground">
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
                                              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(
                                                answer.managerScore ?? 0
                            )}`}
                          >
                                              {(answer.managerScore ?? 0).toFixed(1)}
                          </span>
                                          </div>
                                          <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                            <p className="text-xs text-muted-foreground">
                                              {answer.managerComment || "Sem comentário"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Diferença */}
                                      <div className="mt-1 flex items-center justify-center border-t border-gray-300 pt-1">
                                        <div className="rounded-full bg-gray-50 px-2 py-0.5 border border-gray-200">
                                          <span className="text-xs font-medium text-muted-foreground">
                                            Diferença: {Math.abs((answer.managerScore ?? 0) - (answer.selfScore ?? 0)).toFixed(1)}
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
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(evaluation.selfScore)}`}>
                              {evaluation.selfScore?.toFixed(1) || "0.0"}
                          </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                              Gestor
                            </Badge>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(evaluation.managerScore)}`}>
                              {evaluation.managerScore?.toFixed(1) || "0.0"}
                          </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 px-1.5 py-0.5">
                              Final
                            </Badge>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${getScoreClass(evaluation.finalScore)}`}>
                              {evaluation.finalScore?.toFixed(1) || "0.0"}
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
                      <div className="grid gap-1">
                        {/* Pontos Fortes */}
                        <div className="space-y-1 border-b border-gray-300 pb-2">
                          <Label className="text-xs font-medium">Pontos Fortes</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1 border-r border-gray-300 pr-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                Autoavaliação
                              </Badge>
                              <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.selfStrengths || "Não informado"}
                          </p>
                        </div>
                            </div>
                            <div className="space-y-1 pl-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                Avaliação do Gestor
                              </Badge>
                              <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.managerStrengths || "Não informado"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pontos de Melhoria */}
                        <div className="space-y-1 border-b border-gray-300 pb-2">
                          <Label className="text-xs font-medium">Pontos de Melhoria</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1 border-r border-gray-300 pr-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                Autoavaliação
                              </Badge>
                              <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.selfImprovements || "Não informado"}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1 pl-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                Avaliação do Gestor
                              </Badge>
                              <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.managerImprovements || "Não informado"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metas e Objetivos */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Metas e Objetivos</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1 border-r border-gray-300 pr-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-1.5 py-0.5">
                                Autoavaliação
                              </Badge>
                              <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.selfGoals || "Não informado"}
                          </p>
                        </div>
                      </div>
                            <div className="space-y-1 pl-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0.5">
                                Avaliação do Gestor
                              </Badge>
                              <div className="rounded-lg bg-gray-50 p-1.5 border border-gray-200 min-h-[60px]">
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.managerGoals || "Não informado"}
                                </p>
                    </div>
                            </div>
                          </div>
                        </div>
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
                  {evaluation.evaluationtemplate && (
                    <div className="space-y-6">
                      {Array.from(new Set(evaluation.evaluationtemplate.questions.map(q => q.category.name))).map(category => (
                        <Card key={category}>
                          <CardHeader>
                            <CardTitle>{category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {evaluation.evaluationanswer
                                .filter((answer) => answer.evaluationquestion.category.name === category)
                                .map((answer) => (
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
                                              console.log("Comentário alterado para:", e.target.value, "na questão:", answer.id)
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
                                              console.log("Comentário alterado para:", e.target.value, "na questão:", answer.id)
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Comentários Gerais</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                      <div>
                          <Label>Pontos Fortes</Label>
                        <Textarea
                            value={evaluationType === "self" ? evaluation.selfStrengths || "" : evaluation.managerStrengths || ""}
                            onChange={(e) => {
                              console.log("Pontos fortes alterados para:", e.target.value)
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
                            value={evaluationType === "self" ? evaluation.selfImprovements || "" : evaluation.managerImprovements || ""}
                            onChange={(e) => {
                              console.log("Pontos de melhoria alterados para:", e.target.value)
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
                            value={evaluationType === "self" ? evaluation.selfGoals || "" : evaluation.managerGoals || ""}
                            onChange={(e) => {
                              console.log("Metas e objetivos alterados para:", e.target.value)
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