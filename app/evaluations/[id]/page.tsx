"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
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

export default function EvaluationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [evaluationType, setEvaluationType] = useState<"self" | "manager">("self")
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const router = useRouter()

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
    // Aqui você implementaria a lógica para salvar a avaliação
    toast({
      title: "Avaliação salva",
      description: "A avaliação foi salva com sucesso.",
    })
  }

  const handleSubmitEvaluation = () => {
    // Aqui você implementaria a lógica para enviar a avaliação
    toast({
      title: "Avaliação enviada",
      description: "A avaliação foi enviada com sucesso.",
    })
  }

  // Exportar para PDF
  const exportToPDF = () => {
    const evaluationElement = document.getElementById("evaluation-content")
    if (!evaluationElement) return

    // Configurações para ajustar ao tamanho A4
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 10 // margem em mm

    // Capturar o elemento como imagem
    html2canvas(evaluationElement, {
      scale: 2, // Aumenta a qualidade
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      // Calcular a proporção para ajustar ao tamanho A4
      const imgWidth = pdfWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Se a altura for maior que a página A4, dividir em múltiplas páginas
      if (imgHeight <= pdfHeight - margin * 2) {
        // Cabe em uma única página
        const imgData = canvas.toDataURL("image/png")
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight)
      } else {
        // Dividir em múltiplas páginas
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

      // Salvar o PDF
      pdf.save(`avaliacao_${evaluationData.employeeName.replace(/\s+/g, "_")}.pdf`)

      toast({
        title: "PDF gerado",
        description: "A avaliação foi exportada para PDF com sucesso.",
      })
    })
  }

  // Exportar formulário em branco para PDF
  const exportBlankFormToPDF = () => {
    const formElement = document.getElementById("paper-evaluation-form")
    if (!formElement) return

    // Configurações para ajustar ao tamanho A4
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 10 // margem em mm

    // Capturar o elemento como imagem
    html2canvas(formElement, {
      scale: 2, // Aumenta a qualidade
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      // Calcular a proporção para ajustar ao tamanho A4
      const imgWidth = pdfWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Se a altura for maior que a página A4, dividir em múltiplas páginas
      if (imgHeight <= pdfHeight - margin * 2) {
        // Cabe em uma única página
        const imgData = canvas.toDataURL("image/png")
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight)
      } else {
        // Dividir em múltiplas páginas
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

      // Salvar o PDF
      pdf.save(`formulario_avaliacao_${evaluationData.employeeName.replace(/\s+/g, "_")}.pdf`)

      toast({
        title: "Formulário gerado",
        description: "O formulário de avaliação foi exportado para PDF com sucesso.",
      })
    })
  }

  // Calcular a diferença média entre autoavaliação e avaliação do gestor
  const calculateScoreDifference = () => {
    let totalDiff = 0
    let count = 0

    evaluationData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.selfScore !== null && question.managerScore !== null) {
          totalDiff += Math.abs(question.managerScore - question.selfScore)
          count++
        }
      })
    })

    return count > 0 ? totalDiff / count : 0
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
            {evaluationData.id}
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
                  <h2 className="text-xl font-bold">{evaluationData.employeeName}</h2>
                  <p className="text-sm text-muted-foreground">{evaluationData.position}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Departamento:</span>
                  <span className="text-sm">{evaluationData.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Gestor:</span>
                  <span className="text-sm">{evaluationData.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tipo:</span>
                  <span className="text-sm">{evaluationData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Data de Criação:</span>
                  <span className="text-sm">{new Date(evaluationData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Prazo:</span>
                  <span className="text-sm">{new Date(evaluationData.dueDate).toLocaleDateString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Autoavaliação:</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      evaluationData.selfEvaluationStatus === "Concluída"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {evaluationData.selfEvaluationStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Avaliação do Gestor:</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      evaluationData.managerEvaluationStatus === "Concluída"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {evaluationData.managerEvaluationStatus}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação (Autoavaliação):</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                      calculateAverageScore(evaluationData.sections, "self"),
                    )}`}
                  >
                    {calculateAverageScore(evaluationData.sections, "self").toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Pontuação (Gestor):</span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                      calculateAverageScore(evaluationData.sections, "manager"),
                    )}`}
                  >
                    {calculateAverageScore(evaluationData.sections, "manager").toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Diferença Média:</span>
                  <span className="text-sm font-medium">{calculateScoreDifference().toFixed(1)} pontos</span>
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
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">Pontuação por Categoria</h3>
                      <div className="space-y-4">
                        {evaluationData.sections.map((section) => {
                          const selfAverage =
                            section.questions.reduce((sum, q) => sum + q.selfScore, 0) / section.questions.length
                          const managerAverage =
                            section.questions.reduce((sum, q) => sum + q.managerScore, 0) / section.questions.length

                          return (
                            <div key={section.id} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{section.name}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                    <span className="text-xs">Auto: {selfAverage.toFixed(1)}</span>
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs">Gestor: {managerAverage.toFixed(1)}</span>
                                  </Badge>
                                </div>
                              </div>
                              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                  className="absolute h-full bg-blue-500 opacity-70"
                                  style={{ width: `${(selfAverage / 10) * 100}%` }}
                                />
                                <div
                                  className="absolute h-full bg-green-500 opacity-70"
                                  style={{
                                    width: `${(managerAverage / 10) * 100}%`,
                                    left: `${(managerAverage / 10) * 100}%`,
                                    transform: "translateX(-100%)",
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Pontos Fortes (Autoavaliação)</h3>
                        <p className="text-sm">{evaluationData.comments.selfStrengths}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Pontos Fortes (Gestor)</h3>
                        <p className="text-sm">{evaluationData.comments.managerStrengths}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Áreas para Melhoria (Autoavaliação)</h3>
                        <p className="text-sm">{evaluationData.comments.selfImprovements}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Áreas para Melhoria (Gestor)</h3>
                        <p className="text-sm">{evaluationData.comments.managerImprovements}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Metas e Objetivos (Autoavaliação)</h3>
                        <div className="space-y-2">
                          {evaluationData.comments.selfGoals.split("\n").map((goal, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-primary" />
                              <p className="text-sm">{goal}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-medium">Metas e Objetivos (Gestor)</h3>
                        <div className="space-y-2">
                          {evaluationData.comments.managerGoals.split("\n").map((goal, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="mt-0.5 h-4 w-4 rounded-full border border-primary" />
                              <p className="text-sm">{goal}</p>
                            </div>
                          ))}
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

                  {evaluationData.sections.map((section) => (
                    <div key={section.id} className="space-y-4">
                      <h3 className="font-medium border-b pb-2">{section.name}</h3>
                      <div className="space-y-6">
                        {section.questions.map((question) => (
                          <div key={question.id} className="space-y-2 border p-4 rounded-md">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">{question.text}</Label>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                                    question.selfScore,
                                  )}`}
                                >
                                  Auto: {question.selfScore.toFixed(1)}
                                </span>
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                                    question.managerScore,
                                  )}`}
                                >
                                  Gestor: {question.managerScore.toFixed(1)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Dif: {Math.abs(question.managerScore - question.selfScore).toFixed(1)}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Comentário (Autoavaliação):</Label>
                                <p className="text-sm p-2 bg-muted/50 rounded-md">{question.selfComment}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Comentário (Gestor):</Label>
                                <p className="text-sm p-2 bg-muted/50 rounded-md">{question.managerComment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
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

                  {evaluationData.sections.map((section) => (
                    <div key={section.id} className="space-y-4">
                      <h3 className="font-medium">{section.name}</h3>
                      <div className="space-y-6">
                        {section.questions.map((question) => {
                          const currentScore = evaluationType === "self" ? question.selfScore : question.managerScore
                          const currentComment =
                            evaluationType === "self" ? question.selfComment : question.managerComment

                          return (
                            <div key={question.id} className="space-y-2 border p-4 rounded-md">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={question.id} className="text-sm font-medium">
                                  {question.text}
                                </Label>
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getScoreClass(
                                    scores[question.id] || currentScore,
                                  )}`}
                                >
                                  {(scores[question.id] || currentScore).toFixed(1)}/10
                                </span>
                              </div>

                              <div className="pt-2">
                                <Label className="text-sm mb-1 block">Pontuação:</Label>
                                <RadioGroup
                                  value={(scores[question.id] || currentScore).toString()}
                                  onValueChange={(value) => handleScoreChange(question.id, Number.parseInt(value))}
                                  className="flex flex-wrap gap-2"
                                >
                                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                    <div key={value} className="flex items-center space-x-1">
                                      <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
                                      <Label htmlFor={`${question.id}-${value}`} className="text-sm">
                                        {value}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>

                              <div className="pt-3">
                                <Label htmlFor={`comment-${question.id}`} className="text-sm mb-1 block">
                                  Comentário:
                                </Label>
                                <Textarea
                                  id={`comment-${question.id}`}
                                  placeholder="Adicione um comentário sobre esta questão"
                                  value={comments[question.id] || currentComment || ""}
                                  onChange={(e) => handleCommentChange(question.id, e.target.value)}
                                  className="min-h-[80px]"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <Separator />
                    </div>
                  ))}

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
                              ? evaluationData.comments.selfStrengths
                              : evaluationData.comments.managerStrengths
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
                              ? evaluationData.comments.selfImprovements
                              : evaluationData.comments.managerImprovements
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
                            evaluationType === "self"
                              ? evaluationData.comments.selfGoals
                              : evaluationData.comments.managerGoals
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Formulário de Avaliação em Papel</CardTitle>
            <CardDescription>Versão para impressão da avaliação de desempenho</CardDescription>
          </div>
          <Button variant="outline" onClick={exportBlankFormToPDF}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Formulário
          </Button>
        </CardHeader>
        <CardContent>
          <div id="paper-evaluation-form" className="space-y-6 p-4 border rounded-lg bg-white">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">FORMULÁRIO DE AVALIAÇÃO DE DESEMPENHO</h2>
              <p className="text-sm text-muted-foreground mt-2">{evaluationData.type}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <p className="text-sm font-medium">Nome do Funcionário:</p>
                <p className="text-sm border-b border-dashed pb-1">{evaluationData.employeeName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">ID do Funcionário:</p>
                <p className="text-sm border-b border-dashed pb-1">{evaluationData.employeeId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Departamento:</p>
                <p className="text-sm border-b border-dashed pb-1">{evaluationData.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Cargo:</p>
                <p className="text-sm border-b border-dashed pb-1">{evaluationData.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Gestor:</p>
                <p className="text-sm border-b border-dashed pb-1">{evaluationData.manager}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data da Avaliação:</p>
                <p className="text-sm border-b border-dashed pb-1">
                  {new Date(evaluationData.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm font-medium">Tipo de Avaliação:</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border rounded-sm"></div>
                  <span className="text-sm">Autoavaliação</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border rounded-sm"></div>
                  <span className="text-sm">Avaliação do Gestor</span>
                </div>
              </div>

              <p className="text-sm font-medium mt-4">Instruções:</p>
              <p className="text-sm">
                Avalie cada item de acordo com a escala abaixo, marcando o número correspondente. Adicione comentários
                para justificar sua avaliação.
              </p>

              <div className="flex justify-between text-xs border-t border-b py-2 mt-2">
                <span>0-2: Péssimo</span>
                <span>3-4: Ruim</span>
                <span>5-6: Médio</span>
                <span>7-8: Bom</span>
                <span>9-10: Excelente</span>
              </div>

              {evaluationData.sections.map((section) => (
                <div key={section.id} className="space-y-4 mt-6">
                  <h3 className="font-bold text-lg border-b pb-2">{section.name}</h3>
                  {section.questions.map((question) => (
                    <div key={question.id} className="space-y-2 border p-3 rounded-md">
                      <p className="text-sm font-medium">{question.text}</p>

                      <div className="flex justify-between mt-2 mb-1">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                          <div key={value} className="flex flex-col items-center">
                            <div className="h-4 w-4 border rounded-sm mb-1"></div>
                            <span className="text-xs">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium">Comentário:</p>
                        <div className="border-b border-dashed h-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className="space-y-4 mt-8">
                <h3 className="font-bold text-lg border-b pb-2">Comentários Gerais</h3>

                <div>
                  <p className="text-sm font-medium">Pontos Fortes:</p>
                  <div className="border-b border-dashed h-16"></div>
                </div>

                <div>
                  <p className="text-sm font-medium">Áreas para Melhoria:</p>
                  <div className="border-b border-dashed h-16"></div>
                </div>

                <div>
                  <p className="text-sm font-medium">Metas e Objetivos:</p>
                  <div className="border-b border-dashed h-16"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12 pt-8">
                <div className="text-center">
                  <div className="border-t border-black pt-2 mt-12 mx-auto w-48">
                    <p className="text-sm">Assinatura do Funcionário</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-black pt-2 mt-12 mx-auto w-48">
                    <p className="text-sm">Assinatura do Gestor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={exportBlankFormToPDF} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Baixar Formulário em PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

