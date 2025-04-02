"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowUpDown,
  Check,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo para avaliações
const evaluations = [
  {
    id: "EVAL001",
    employeeName: "João Silva",
    employeeId: "EMP001",
    department: "TI",
    position: "Desenvolvedor Senior",
    evaluator: "Maria Santos",
    date: "2024-03-15",
    score: 8.5,
    status: "Concluída",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Concluída",
    managerEvaluationStatus: "Concluída",
  },
  {
    id: "EVAL002",
    employeeName: "Ana Oliveira",
    employeeId: "EMP002",
    department: "RH",
    position: "Analista de RH",
    evaluator: "Carlos Mendes",
    date: "2024-03-10",
    score: 9.2,
    status: "Concluída",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Concluída",
    managerEvaluationStatus: "Concluída",
  },
  {
    id: "EVAL003",
    employeeName: "Pedro Santos",
    employeeId: "EMP003",
    department: "Vendas",
    position: "Gerente de Vendas",
    evaluator: "Mariana Costa",
    date: "2024-03-05",
    score: 7.8,
    status: "Concluída",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Concluída",
    managerEvaluationStatus: "Concluída",
  },
  {
    id: "EVAL004",
    employeeName: "Carla Ferreira",
    employeeId: "EMP004",
    department: "Marketing",
    position: "Especialista em Marketing",
    evaluator: "Roberto Alves",
    date: "2024-02-28",
    score: 8.9,
    status: "Concluída",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Concluída",
    managerEvaluationStatus: "Concluída",
  },
  {
    id: "EVAL005",
    employeeName: "Lucas Mendes",
    employeeId: "EMP005",
    department: "Financeiro",
    position: "Analista Financeiro",
    evaluator: "Juliana Ribeiro",
    date: "2024-02-20",
    score: 8.1,
    status: "Concluída",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Concluída",
    managerEvaluationStatus: "Concluída",
  },
  {
    id: "EVAL006",
    employeeName: "Fernanda Lima",
    employeeId: "EMP006",
    department: "TI",
    position: "Analista de Sistemas",
    evaluator: "Maria Santos",
    date: "2024-04-15",
    score: null,
    status: "Em Progresso",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Concluída",
    managerEvaluationStatus: "Pendente",
  },
  {
    id: "EVAL007",
    employeeName: "Ricardo Oliveira",
    employeeId: "EMP007",
    department: "RH",
    position: "Assistente de RH",
    evaluator: "Carlos Mendes",
    date: "2024-04-20",
    score: null,
    status: "Pendente",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Pendente",
    managerEvaluationStatus: "Pendente",
  },
  {
    id: "EVAL008",
    employeeName: "Camila Sousa",
    employeeId: "EMP008",
    department: "Vendas",
    position: "Representante de Vendas",
    evaluator: "Mariana Costa",
    date: "2024-04-25",
    score: null,
    status: "Pendente",
    type: "Avaliação Anual",
    selfEvaluationStatus: "Pendente",
    managerEvaluationStatus: "Pendente",
  },
]

// Dados para gráficos
const scoreDistribution = [
  { range: "9-10", count: 12 },
  { range: "8-8.9", count: 25 },
  { range: "7-7.9", count: 18 },
  { range: "6-6.9", count: 8 },
  { range: "0-5.9", count: 3 },
]

const departmentScores = [
  { department: "TI", score: 8.7 },
  { department: "RH", score: 8.5 },
  { department: "Vendas", score: 7.9 },
  { department: "Marketing", score: 8.4 },
  { department: "Financeiro", score: 8.2 },
]

const evaluationsByStatus = [
  { name: "Concluídas", value: 66 },
  { name: "Pendentes", value: 23 },
  { name: "Em Progresso", value: 11 },
]

// Categorias de avaliação
const evaluationCategories = [
  {
    id: "technical",
    name: "Habilidades Técnicas",
    description: "Avaliação das competências técnicas específicas da função",
  },
  {
    id: "communication",
    name: "Comunicação",
    description: "Capacidade de comunicação escrita e verbal",
  },
  {
    id: "teamwork",
    name: "Trabalho em Equipe",
    description: "Colaboração e trabalho eficaz com colegas",
  },
  {
    id: "leadership",
    name: "Liderança",
    description: "Capacidade de liderar e influenciar positivamente",
  },
  {
    id: "problem_solving",
    name: "Resolução de Problemas",
    description: "Capacidade de identificar e resolver problemas",
  },
  {
    id: "adaptability",
    name: "Adaptabilidade",
    description: "Capacidade de se adaptar a mudanças e novos desafios",
  },
]

// Perguntas de exemplo para avaliação
const sampleQuestions = [
  {
    id: "q1",
    category: "technical",
    text: "Demonstra conhecimento técnico adequado para a função",
  },
  {
    id: "q2",
    category: "technical",
    text: "Mantém-se atualizado com as novas tecnologias e práticas",
  },
  {
    id: "q3",
    category: "communication",
    text: "Comunica-se de forma clara e eficaz com a equipe",
  },
  {
    id: "q4",
    category: "communication",
    text: "Apresenta ideias e informações de maneira organizada",
  },
  {
    id: "q5",
    category: "teamwork",
    text: "Colabora efetivamente com os membros da equipe",
  },
  {
    id: "q6",
    category: "teamwork",
    text: "Contribui positivamente para o ambiente de trabalho",
  },
  {
    id: "q7",
    category: "leadership",
    text: "Demonstra iniciativa e proatividade",
  },
  {
    id: "q8",
    category: "leadership",
    text: "Inspira e motiva os colegas de trabalho",
  },
  {
    id: "q9",
    category: "problem_solving",
    text: "Identifica problemas e propõe soluções eficazes",
  },
  {
    id: "q10",
    category: "problem_solving",
    text: "Toma decisões de forma lógica e fundamentada",
  },
  {
    id: "q11",
    category: "adaptability",
    text: "Adapta-se bem a mudanças e novas situações",
  },
  {
    id: "q12",
    category: "adaptability",
    text: "Aprende rapidamente novas habilidades e processos",
  },
]

// Cores modernas para gráficos
const MODERN_COLORS = [
  "#4361ee",
  "#3a0ca3",
  "#7209b7",
  "#f72585",
  "#4cc9f0",
  "#4895ef",
  "#560bad",
  "#b5179e",
  "#f15bb5",
  "#00bbf9",
]

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

export default function EvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("list")
  const [isNewEvaluationOpen, setIsNewEvaluationOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isApplyEvaluationOpen, setIsApplyEvaluationOpen] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [questionScores, setQuestionScores] = useState<Record<string, number>>({})
  const [questionComments, setQuestionComments] = useState<Record<string, string>>({})
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedEvaluationType, setSelectedEvaluationType] = useState("")
  const [selectedEvaluator, setSelectedEvaluator] = useState("self")
  const [customQuestions, setCustomQuestions] = useState<Array<{ id: string; text: string; category: string }>>([])
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionCategory, setNewQuestionCategory] = useState("technical")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const router = useRouter()

  // Filtrar e ordenar avaliações
  const filteredEvaluations = evaluations
    .filter(
      (evaluation) =>
        evaluation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.evaluator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((evaluation) => departmentFilter === "all" || evaluation.department === departmentFilter)
    .filter((evaluation) => statusFilter === "all" || evaluation.status === statusFilter)
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else if (aValue === null) {
        return sortDirection === "asc" ? -1 : 1
      } else if (bValue === null) {
        return sortDirection === "asc" ? 1 : -1
      } else {
        return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
      }
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Adicionar nova pergunta personalizada
  const handleAddCustomQuestion = () => {
    if (newQuestionText.trim() === "") return

    const newQuestion = {
      id: `custom_${Date.now()}`,
      text: newQuestionText,
      category: newQuestionCategory,
    }

    setCustomQuestions([...customQuestions, newQuestion])
    setNewQuestionText("")
  }

  // Alternar seleção de pergunta
  const toggleQuestionSelection = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId))
    } else {
      setSelectedQuestions([...selectedQuestions, questionId])
    }
  }

  // Atualizar pontuação de questão
  const updateQuestionScore = (questionId: string, value: number) => {
    setQuestionScores({
      ...questionScores,
      [questionId]: value,
    })
  }

  // Atualizar comentário de questão
  const updateQuestionComment = (questionId: string, value: string) => {
    setQuestionComments({
      ...questionComments,
      [questionId]: value,
    })
  }

  // Calcular pontuação média
  const calculateAverageScore = () => {
    const scores = Object.values(questionScores)
    if (scores.length === 0) return 0
    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  // Salvar novo modelo de avaliação
  const saveTemplate = () => {
    // Aqui você implementaria a lógica para salvar o modelo
    toast({
      title: "Modelo de avaliação criado",
      description: `O modelo "${newTemplateName}" foi criado com sucesso.`,
    })
    setIsTemplateDialogOpen(false)
    setNewTemplateName("")
    setNewTemplateDescription("")
    setSelectedQuestions([])
  }

  // Criar nova avaliação
  const createNewEvaluation = () => {
    // Aqui você implementaria a lógica para criar a avaliação
    toast({
      title: "Avaliação criada",
      description: "A nova avaliação foi criada e atribuída com sucesso.",
    })
    setIsNewEvaluationOpen(false)
    setSelectedEmployee("")
    setSelectedEvaluationType("")
  }

  // Aplicar avaliação
  const applyEvaluation = () => {
    // Aqui você implementaria a lógica para aplicar a avaliação
    toast({
      title: "Avaliação aplicada",
      description: `A autoavaliação foi aplicada ao funcionário com sucesso. O gestor será notificado para realizar sua avaliação.`,
    })
    setIsApplyEvaluationOpen(false)
    setSelectedEmployee("")
    setSelectedTemplate(null)
    setSelectedEvaluator("self")
    setQuestionScores({})
    setQuestionComments({})
  }

  // Exportar dados
  const exportData = (format: string) => {
    // Implementação real exportaria os dados para o formato especificado
    console.log(`Exportando dados em formato ${format}`)

    // Simulação de download
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(filteredEvaluations, null, 2)], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `avaliacoes_${new Date().toISOString().split("T")[0]}.${format}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Exportação concluída",
      description: `Os dados foram exportados em formato ${format.toUpperCase()}.`,
    })
  }

  // Exportar formulário em branco para PDF
  const exportBlankFormToPDF = () => {
    toast({
      title: "Exportação iniciada",
      description: "O formulário de avaliação está sendo gerado em PDF.",
    })

    // Aqui você implementaria a lógica para exportar o formulário em branco
    setTimeout(() => {
      toast({
        title: "PDF gerado",
        description: "O formulário de avaliação foi exportado para PDF com sucesso.",
      })
    }, 1500)
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl">Avaliações de Desempenho</h1>
        <p className="text-muted-foreground">Gerenciar e acompanhar avaliações de desempenho dos funcionários</p>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="list">Lista de Avaliações</TabsTrigger>
            <TabsTrigger value="templates">Modelos de Avaliação</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isNewEvaluationOpen} onOpenChange={setIsNewEvaluationOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Avaliação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Nova Avaliação de Desempenho</DialogTitle>
                  <DialogDescription>Criar uma nova avaliação para um funcionário</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employee" className="text-right">
                      Funcionário
                    </Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp001">João Silva</SelectItem>
                        <SelectItem value="emp002">Ana Oliveira</SelectItem>
                        <SelectItem value="emp003">Pedro Santos</SelectItem>
                        <SelectItem value="emp004">Carla Ferreira</SelectItem>
                        <SelectItem value="emp005">Lucas Mendes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="evaluation-type" className="text-right">
                      Tipo de Avaliação
                    </Label>
                    <Select value={selectedEvaluationType} onValueChange={setSelectedEvaluationType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Avaliação Anual</SelectItem>
                        <SelectItem value="midyear">Avaliação Semestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template" className="text-right">
                      Modelo
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Avaliação Geral</SelectItem>
                        <SelectItem value="technical">Avaliação Técnica</SelectItem>
                        <SelectItem value="leadership">Avaliação de Liderança</SelectItem>
                        <SelectItem value="custom">Modelo Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deadline" className="text-right">
                      Prazo
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      className="col-span-3"
                      defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Observações
                    </Label>
                    <Textarea id="notes" placeholder="Observações adicionais" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={createNewEvaluation}>
                    Criar Avaliação
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Modelo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Criar Modelo de Avaliação</DialogTitle>
                  <DialogDescription>
                    Crie um novo modelo de avaliação personalizado selecionando as perguntas desejadas.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-name" className="text-right">
                      Nome do Modelo
                    </Label>
                    <Input
                      id="template-name"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="Ex: Avaliação Técnica"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-description" className="text-right">
                      Descrição
                    </Label>
                    <Textarea
                      id="template-description"
                      value={newTemplateDescription}
                      onChange={(e) => setNewTemplateDescription(e.target.value)}
                      placeholder="Descreva o propósito deste modelo de avaliação"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right pt-2">Perguntas</Label>
                    <div className="col-span-3 space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Nova pergunta personalizada"
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                        />
                        <Select value={newQuestionCategory} onValueChange={setNewQuestionCategory}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {evaluationCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={handleAddCustomQuestion}>
                          Adicionar
                        </Button>
                      </div>
                      <ScrollArea className="h-[300px] rounded-md border p-4">
                        {evaluationCategories.map((category) => (
                          <Collapsible key={category.id} className="mb-4">
                            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-secondary p-2 text-left font-medium hover:bg-secondary/80">
                              {category.name}
                              <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-2">
                              {[
                                ...sampleQuestions.filter((q) => q.category === category.id),
                                ...customQuestions.filter((q) => q.category === category.id),
                              ].map((question) => (
                                <div key={question.id} className="flex items-center gap-2 py-2">
                                  <input
                                    type="checkbox"
                                    id={question.id}
                                    checked={selectedQuestions.includes(question.id)}
                                    onChange={() => toggleQuestionSelection(question.id)}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                  <label htmlFor={question.id} className="text-sm">
                                    {question.text}
                                  </label>
                                </div>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={saveTemplate}
                    disabled={!newTemplateName || selectedQuestions.length === 0}
                  >
                    Salvar Modelo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportData("xlsx")}>Exportar como Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportData("csv")}>Exportar como CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportData("json")}>Exportar como JSON</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportData("pdf")}>Exportar como PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="list" className="animate-fade">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar avaliações..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Departamentos</SelectItem>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card className="animate-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{evaluations.length}</div>
                <p className="text-xs text-muted-foreground">+3 em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card className="animate-scale [animation-delay:100ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{evaluations.filter((e) => e.status === "Pendente").length}</div>
                <p className="text-xs text-muted-foreground">Prazo médio: 15 dias</p>
              </CardContent>
            </Card>
            <Card className="animate-scale [animation-delay:200ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    evaluations.filter((e) => e.score !== null).reduce((sum, e) => sum + (e.score || 0), 0) /
                    evaluations.filter((e) => e.score !== null).length
                  ).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">+0.3 em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Lista de Avaliações</CardTitle>
              <CardDescription>Visualizar e gerenciar todas as avaliações de desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                      ID
                      {sortField === "id" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("employeeName")}>
                      Funcionário
                      {sortField === "employeeName" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("department")}>
                      Departamento
                      {sortField === "department" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                      Data
                      {sortField === "date" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer text-center">Autoavaliação</TableHead>
                    <TableHead className="cursor-pointer text-center">Avaliação Gestor</TableHead>
                    <TableHead className="cursor-pointer text-center" onClick={() => handleSort("score")}>
                      Pontuação
                      {sortField === "score" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id} className="animate-fade">
                      <TableCell className="font-medium">{evaluation.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{evaluation.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{evaluation.position}</div>
                      </TableCell>
                      <TableCell>{evaluation.department}</TableCell>
                      <TableCell>{new Date(evaluation.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            evaluation.selfEvaluationStatus === "Concluída"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {evaluation.selfEvaluationStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            evaluation.managerEvaluationStatus === "Concluída"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {evaluation.managerEvaluationStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {evaluation.score !== null ? (
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getScoreClass(
                              evaluation.score,
                            )}`}
                          >
                            {evaluation.score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/evaluations/${evaluation.id}`)}>
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>Editar avaliação</DropdownMenuItem>
                            <DropdownMenuItem>Enviar lembrete</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Exportar PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredEvaluations.length} de {evaluations.length} avaliações
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="animate-fade">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Modelos de Avaliação</CardTitle>
                <CardDescription>Modelos disponíveis para avaliações de desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "template1",
                      name: "Avaliação Geral",
                      description: "Modelo padrão para avaliação de desempenho geral",
                      questions: 12,
                      categories: ["Habilidades Técnicas", "Comunicação", "Trabalho em Equipe", "Liderança"],
                      lastUpdated: "2024-02-15",
                    },
                    {
                      id: "template2",
                      name: "Avaliação Técnica",
                      description: "Modelo focado em habilidades técnicas para equipes de desenvolvimento",
                      questions: 15,
                      categories: ["Habilidades Técnicas", "Resolução de Problemas", "Adaptabilidade"],
                      lastUpdated: "2024-01-20",
                    },
                    {
                      id: "template3",
                      name: "Avaliação de Liderança",
                      description: "Modelo para avaliação de habilidades de liderança e gestão",
                      questions: 10,
                      categories: ["Liderança", "Comunicação", "Tomada de Decisão", "Gestão de Equipe"],
                      lastUpdated: "2024-03-05",
                    },
                    {
                      id: "template4",
                      name: "Avaliação de Período Probatório",
                      description: "Modelo para avaliação de funcionários em período probatório",
                      questions: 8,
                      categories: ["Adaptabilidade", "Aprendizado", "Trabalho em Equipe", "Pontualidade"],
                      lastUpdated: "2024-02-28",
                    },
                  ].map((template) => (
                    <div
                      key={template.id}
                      className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {template.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4 sm:mt-0">
                        <div className="text-sm text-muted-foreground">
                          {template.questions} perguntas • Atualizado em{" "}
                          {new Date(template.lastUpdated).toLocaleDateString()}
                        </div>
                        <Dialog
                          open={isApplyEvaluationOpen && selectedTemplate === template.id}
                          onOpenChange={(open) => {
                            setIsApplyEvaluationOpen(open)
                            if (open) setSelectedTemplate(template.id)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              Aplicar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px]">
                            <DialogHeader>
                              <DialogTitle>Aplicar Avaliação</DialogTitle>
                              <DialogDescription>
                                Preencha o formulário de avaliação para o funcionário selecionado
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="apply-employee" className="text-right">
                                  Funcionário
                                </Label>
                                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o funcionário" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="emp001">João Silva</SelectItem>
                                    <SelectItem value="emp002">Ana Oliveira</SelectItem>
                                    <SelectItem value="emp003">Pedro Santos</SelectItem>
                                    <SelectItem value="emp004">Carla Ferreira</SelectItem>
                                    <SelectItem value="emp005">Lucas Mendes</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="apply-evaluator-type" className="text-right">
                                  Tipo de Avaliação
                                </Label>
                                <div className="col-span-3">
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Autoavaliação</Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Primeiro o funcionário realiza sua autoavaliação, depois o gestor fará sua
                                    avaliação.
                                  </p>
                                </div>
                              </div>

                              <div className="col-span-4 mt-4">
                                <h3 className="font-medium mb-4">Formulário de Avaliação</h3>
                                <ScrollArea className="h-[400px] rounded-md border p-4">
                                  {evaluationCategories.slice(0, 3).map((category) => (
                                    <div key={category.id} className="mb-6">
                                      <h4 className="font-medium mb-3 border-b pb-1">{category.name}</h4>
                                      <div className="space-y-6">
                                        {sampleQuestions
                                          .filter((q) => q.category === category.id)
                                          .slice(0, 2)
                                          .map((question) => (
                                            <div key={question.id} className="space-y-2 border p-3 rounded-md">
                                              <Label className="text-sm font-medium">{question.text}</Label>

                                              <div className="pt-2">
                                                <Label className="text-sm mb-1 block">Pontuação:</Label>
                                                <RadioGroup
                                                  value={(questionScores[question.id] || "5").toString()}
                                                  onValueChange={(value) =>
                                                    updateQuestionScore(question.id, Number.parseInt(value))
                                                  }
                                                  className="flex flex-wrap gap-2"
                                                >
                                                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                                    <div key={value} className="flex items-center space-x-1">
                                                      <RadioGroupItem
                                                        value={value.toString()}
                                                        id={`${question.id}-${value}`}
                                                      />
                                                      <Label htmlFor={`${question.id}-${value}`} className="text-sm">
                                                        {value}
                                                      </Label>
                                                    </div>
                                                  ))}
                                                </RadioGroup>
                                              </div>

                                              <div className="pt-3">
                                                <Label
                                                  htmlFor={`comment-${question.id}`}
                                                  className="text-sm mb-1 block"
                                                >
                                                  Comentário:
                                                </Label>
                                                <Textarea
                                                  id={`comment-${question.id}`}
                                                  placeholder="Adicione um comentário sobre esta questão"
                                                  value={questionComments[question.id] || ""}
                                                  onChange={(e) => updateQuestionComment(question.id, e.target.value)}
                                                  className="min-h-[80px]"
                                                />
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  ))}

                                  <div className="space-y-4 mt-6">
                                    <h4 className="font-medium mb-3 border-b pb-1">Comentários Gerais</h4>
                                    <div>
                                      <Label htmlFor="strengths" className="text-sm">
                                        Pontos Fortes
                                      </Label>
                                      <Textarea
                                        id="strengths"
                                        placeholder="Descreva os pontos fortes do funcionário"
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
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                </ScrollArea>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => exportBlankFormToPDF()}>
                                Imprimir Formulário
                              </Button>
                              <Button onClick={applyEvaluation} disabled={!selectedEmployee}>
                                Salvar Avaliação
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Editar modelo</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar modelo</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Excluir modelo</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Avaliações</CardTitle>
                <CardDescription>Distribuição de pontuações e status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium mb-2">Status das Avaliações</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">66%</span>
                        <span className="text-sm text-muted-foreground">Concluídas</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
                        <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">23%</span>
                        <span className="text-sm text-muted-foreground">Pendentes</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">11%</span>
                        <span className="text-sm text-muted-foreground">Em Progresso</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium mb-2">Distribuição de Pontuações</h3>
                    <div className="space-y-2">
                      {[
                        { range: "9-10", count: 12, label: "Excelente", color: "bg-green-100 dark:bg-green-900/50" },
                        { range: "8-8.9", count: 25, label: "Muito Bom", color: "bg-blue-100 dark:bg-blue-900/50" },
                        { range: "7-7.9", count: 18, label: "Bom", color: "bg-yellow-100 dark:bg-yellow-900/50" },
                        {
                          range: "6-6.9",
                          count: 8,
                          label: "Satisfatório",
                          color: "bg-orange-100 dark:bg-orange-900/50",
                        },
                        { range: "0-5.9", count: 3, label: "Precisa Melhorar", color: "bg-red-100 dark:bg-red-900/50" },
                      ].map((item) => (
                        <div
                          key={item.range}
                          className={`flex items-center justify-between p-2 rounded-md ${item.color}`}
                        >
                          <div>
                            <span className="font-medium">{item.range}</span>
                            <span className="ml-2 text-sm text-muted-foreground">{item.label}</span>
                          </div>
                          <div className="font-medium">{item.count} avaliações</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Pontuação Média por Departamento</CardTitle>
                <CardDescription>Comparação de desempenho entre departamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {departmentScores.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                      <div className="font-medium">{dept.department}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(dept.score / 10) * 100}%`,
                              backgroundColor: MODERN_COLORS[index % MODERN_COLORS.length],
                            }}
                          />
                        </div>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            dept.score >= 8.5
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : dept.score >= 8
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {dept.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

