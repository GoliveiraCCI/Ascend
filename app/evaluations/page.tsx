"use client"

import { useState, useEffect } from "react"
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
  X,
  Eye,
  Pencil,
  FileDown,
  Clock,
  HelpCircle,
  CheckCircle,
  Circle,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileText,
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

interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  matricula: string;
  department: Department;
}

interface Template {
  id: string;
  name: string;
  description: string | null;
  questions?: {
    id: string;
    text: string;
    category: {
      id: string;
      name: string;
    };
  }[];
  _count?: {
    evaluations: number;
  };
  updatedAt?: string;
}

interface CustomQuestion {
  id: string
  text: string
  category: string
}

interface Evaluation {
  id: string;
  employee: {
    id: string;
    name: string;
    matricula: string;
    department: {
      id: string;
      name: string;
    };
  };
  evaluator: {
    id: string;
    name: string;
  };
  template: {
    id: string;
    name: string;
    description: string | null;
  };
  date: string;
  status: "Pendente" | "Finalizado";
  selfEvaluation: boolean;
  selfEvaluationStatus: "Pendente" | "Finalizado";
  selfStrengths: string | null;
  selfImprovements: string | null;
  selfGoals: string | null;
  selfScore: number | null;
  selfEvaluationDate: string | null;
  managerEvaluation: boolean;
  managerEvaluationStatus: "Pendente" | "Finalizado";
  managerStrengths: string | null;
  managerImprovements: string | null;
  managerGoals: string | null;
  managerScore: number | null;
  managerEvaluationDate: string | null;
  finalScore: number | null;
  answers: Array<{
    id: string;
    question: {
      id: string;
      text: string;
    };
    selfScore: number | null;
    managerScore: number | null;
    selfComment: string | null;
    managerComment: string | null;
  }>;
}

interface Stats {
  statusStats: {
    name: string;
    value: number;
  }[];
  scoreDistribution: {
    range: string;
    count: number;
  }[];
  departmentScores: {
    department: string;
    score: number;
  }[];
}

interface Evaluator {
  id: string;
  name: string;
  email: string;
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

// Função para determinar a variante do Badge com base no status
const getStatusBadgeVariant = (status: "Pendente" | "Finalizado" | null) => {
  if (!status) return "destructive";
  switch (status) {
    case "Finalizado":
      return "success";
    case "Pendente":
      return "destructive";
    default:
      return "destructive";
  }
};

// Função para obter o ícone com base no status
const getStatusIcon = (status: "Pendente" | "Finalizado" | null) => {
  if (!status) return <AlertCircle className="h-4 w-4" />;
  switch (status) {
    case "Finalizado":
      return <CheckCircle2 className="h-4 w-4" />;
    case "Pendente":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export default function EvaluationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [isEmployeeComboboxOpen, setIsEmployeeComboboxOpen] = useState(false)
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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedEvaluator, setSelectedEvaluator] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [evaluationCategories, setEvaluationCategories] = useState<Department[]>([])
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionCategory, setNewQuestionCategory] = useState("")
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")
  const [stats, setStats] = useState<Stats>({
    statusStats: [
      { name: "Concluídas", value: 0 },
      { name: "Pendentes", value: 0 },
      { name: "Em Progresso", value: 0 }
    ],
    scoreDistribution: [
      { range: "9-10", count: 0 },
      { range: "8-8.9", count: 0 },
      { range: "7-7.9", count: 0 },
      { range: "6-6.9", count: 0 },
      { range: "0-5.9", count: 0 }
    ],
    departmentScores: []
  })
  const [evaluators, setEvaluators] = useState<Evaluator[]>([])
  const router = useRouter()

  // Filtrar e ordenar avaliações
  const filteredEvaluations = evaluations
    .filter(
      (evaluation) =>
        evaluation.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.evaluator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((evaluation) => departmentFilter === "all" || evaluation.employee.department.id === departmentFilter)
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
      id: Date.now().toString(),
      text: newQuestionText,
      category: newQuestionCategory,
    }

    setCustomQuestions([...customQuestions, newQuestion])
    setNewQuestionText("")
    setNewQuestionCategory("")
  }

  // Alternar seleção de pergunta
  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId)
      } else {
        return [...prev, questionId]
      }
    })
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

  // Buscar avaliações
  const fetchEvaluations = async () => {
    try {
      const response = await fetch('/api/evaluations')
      const data = await response.json()
      
      if (response.ok) {
        setEvaluations(data)
      } else {
        throw new Error(data.error || 'Erro ao buscar avaliações')
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações.",
        variant: "destructive",
      })
    }
  }

  // Efeito para carregar avaliações quando a página carregar
  useEffect(() => {
    if (activeTab === 'list') {
      fetchEvaluations()
    }
  }, [activeTab])

  // Buscar modelos de avaliação
  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/evaluations/templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Erro ao buscar modelos de avaliação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os modelos de avaliação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Efeito para carregar modelos de avaliação
  useEffect(() => {
    if (activeTab === 'templates') {
      fetchTemplates()
    }
  }, [activeTab])

  // Buscar categorias de avaliação
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/evaluations/categories')
      if (!response.ok) {
        throw new Error('Erro ao buscar categorias')
      }
      const data = await response.json()
      setEvaluationCategories(data)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias de avaliação.",
        variant: "destructive",
      })
    }
  }

  // Efeito para carregar categorias quando a página carregar
  useEffect(() => {
    if (activeTab === 'templates') {
      fetchCategories()
    }
  }, [activeTab])

  // Buscar funcionários
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (!response.ok) throw new Error('Erro ao buscar funcionários')
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de funcionários.",
        variant: "destructive",
      })
    }
  }

  // Buscar avaliadores
  const fetchEvaluators = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Erro ao buscar avaliadores')
      const data = await response.json()
      setEvaluators(data)
    } catch (error) {
      console.error('Erro ao buscar avaliadores:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de avaliadores.",
        variant: "destructive",
      })
    }
  }

  // Carregar dados ao abrir o modal
  useEffect(() => {
    if (isNewEvaluationOpen) {
      fetchEmployees()
      fetchTemplates()
      fetchEvaluators()
    }
  }, [isNewEvaluationOpen])

  // Filtrar funcionários baseado na busca
  useEffect(() => {
    if (employees.length > 0) {
      const filtered = employees.filter((employee) =>
        employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        employee.matricula.toLowerCase().includes(employeeSearch.toLowerCase())
      )
      setFilteredEmployees(filtered)
    }
  }, [employeeSearch, employees])

  // Atualizar funcionário selecionado
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId)
    setIsEmployeeComboboxOpen(false)
    const selected = employees.find(emp => emp.id === employeeId)
    if (selected) {
      setEmployeeSearch(selected.name)
    }
  }

  // Salvar novo modelo de avaliação
  const saveTemplate = async () => {
    try {
      const response = await fetch('/api/evaluations/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplateName,
          description: newTemplateDescription,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar modelo de avaliação')
      }

      await fetchTemplates()
      toast({
        title: "Modelo de avaliação criado",
        description: `O modelo "${newTemplateName}" foi criado com sucesso.`,
      })
      setIsTemplateDialogOpen(false)
      setNewTemplateName("")
      setNewTemplateDescription("")
      setSelectedQuestions([])
    } catch (error) {
      console.error('Erro ao criar modelo de avaliação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o modelo de avaliação.",
        variant: "destructive",
      })
    }
  }

  // Criar nova avaliação
  const createNewEvaluation = async () => {
    if (!selectedEmployee || !selectedTemplate || !selectedEvaluator) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um funcionário, um modelo de avaliação e um avaliador.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          evaluatorId: selectedEvaluator,
          templateId: selectedTemplate,
          date: new Date().toISOString(),
          selfEvaluation: true,
          managerEvaluation: true,
          status: "Pendente",
          selfEvaluationStatus: "Pendente",
          managerEvaluationStatus: "Pendente"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar avaliação');
      }

      const newEvaluation = await response.json();
      setEvaluations([...evaluations, newEvaluation]);
      
      // Resetar todos os estados
      setSelectedEmployee('');
      setSelectedTemplate(null);
      setSelectedEvaluator(null);
      setEmployeeSearch('');
      setIsEmployeeComboboxOpen(false);
      
      // Fechar o diálogo
      setIsNewEvaluationOpen(false);
      
      toast({
        title: "Sucesso",
        description: "Avaliação criada com sucesso!",
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar avaliação. Verifique se o funcionário e o avaliador existem no sistema.",
        variant: "destructive",
      });
    }
  };

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
    setSelectedEvaluator(null)
    setQuestionScores({})
    setQuestionComments({})
  }

  // Função para excluir modelo de avaliação
  const deleteTemplate = async (templateId: string) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/evaluations/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao excluir modelo de avaliação')
      }

      await fetchTemplates()
      toast({
        title: "Modelo excluído",
        description: "O modelo de avaliação foi excluído com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao excluir modelo de avaliação:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível excluir o modelo de avaliação.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Função para editar modelo de avaliação
  const editTemplate = async (templateId: string) => {
    if (!editingTemplate) return;
    
    try {
      setIsEditing(true);
      const response = await fetch(`/api/evaluations/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplateName,
          description: newTemplateDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar modelo de avaliação');
      }

      await fetchTemplates();
      toast({
        title: "Modelo atualizado",
        description: "O modelo de avaliação foi atualizado com sucesso.",
      });
      setIsEditDialogOpen(false);
      setNewTemplateName("");
      setNewTemplateDescription("");
      setEditingTemplate(null);
    } catch (error) {
      console.error('Erro ao atualizar modelo de avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o modelo de avaliação.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  // Função para abrir diálogo de edição
  const openEditDialog = (template: Template) => {
    setEditingTemplate(template)
    setIsEditDialogOpen(true)
  }

  // Função para duplicar modelo de avaliação
  const duplicateTemplate = async (templateId: string) => {
    if (!editingTemplate) return;
    
    try {
      setIsDuplicating(true);
      const response = await fetch(`/api/evaluations/templates/${templateId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplateName,
          description: newTemplateDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao duplicar modelo de avaliação');
      }

      await fetchTemplates();
      toast({
        title: "Modelo duplicado",
        description: "O modelo de avaliação foi duplicado com sucesso.",
      });
      setIsDuplicateDialogOpen(false);
      setNewTemplateName("");
      setNewTemplateDescription("");
      setEditingTemplate(null);
    } catch (error) {
      console.error('Erro ao duplicar modelo de avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível duplicar o modelo de avaliação.",
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  // Função para abrir diálogo de duplicação
  const openDuplicateDialog = (template: Template) => {
    setEditingTemplate(template)
    setIsDuplicateDialogOpen(true)
  }

  // Adicionar função para remover pergunta personalizada
  const removeCustomQuestion = (questionId: string) => {
    setCustomQuestions(customQuestions.filter(q => q.id !== questionId))
    setSelectedQuestions(selectedQuestions.filter(id => id !== questionId))
  }

  // Função para buscar estatísticas
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/evaluations/stats')
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  // Buscar estatísticas quando a página carregar
  useEffect(() => {
    fetchStats()
  }, [])

  // Efeito para fechar o combobox quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.employee-combobox')) {
        setIsEmployeeComboboxOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Adicionar a função handleDeleteEvaluation
  const handleDeleteEvaluation = async (evaluationId: string) => {
    try {
      const response = await fetch(`/api/evaluations/${evaluationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir avaliação');
      }

      setEvaluations(evaluations.filter(e => e.id !== evaluationId));
      toast({
        title: "Sucesso",
        description: "Avaliação excluída com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a avaliação.",
        variant: "destructive",
      });
    }
  };

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
            {activeTab === 'list' && (
              <>
                <Dialog open={isNewEvaluationOpen} onOpenChange={setIsNewEvaluationOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Avaliação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Avaliação</DialogTitle>
                      <DialogDescription>
                        Crie uma nova avaliação de desempenho para um funcionário.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="employee" className="text-right">
                          Funcionário
                        </Label>
                        <div className="col-span-3 relative employee-combobox">
                          <div className="relative">
                            <Input
                              id="employee"
                              placeholder="Buscar funcionário..."
                              value={employeeSearch}
                              onChange={(e) => {
                                setEmployeeSearch(e.target.value)
                                setIsEmployeeComboboxOpen(true)
                              }}
                              onFocus={() => setIsEmployeeComboboxOpen(true)}
                              className="w-full"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setIsEmployeeComboboxOpen(!isEmployeeComboboxOpen)}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform ${isEmployeeComboboxOpen ? 'transform rotate-180' : ''}`} />
                            </Button>
                          </div>
                          {isEmployeeComboboxOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
                              {filteredEmployees.length === 0 ? (
                                <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                                  Nenhum funcionário encontrado
                                </div>
                              ) : (
                                filteredEmployees.map((employee) => (
                                  <div
                                    key={employee.id}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                      selectedEmployee === employee.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                                    }`}
                                    onClick={() => handleEmployeeSelect(employee.id)}
                                  >
                                    <div className="font-medium">
                                      {employee.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {employee.matricula || 'Sem matrícula'}
                                    </div>
                                    {employee.department && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {employee.department.name}
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="template" className="text-right">
                          Modelo de Avaliação
                        </Label>
                        <div className="col-span-3">
                          <Select
                            value={selectedTemplate || ""}
                            onValueChange={setSelectedTemplate}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um modelo de avaliação" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="evaluator" className="text-right">
                          Avaliador
                        </Label>
                        <div className="col-span-3">
                          <Select
                            value={selectedEvaluator || ""}
                            onValueChange={setSelectedEvaluator}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um avaliador" />
                            </SelectTrigger>
                            <SelectContent>
                              {evaluators.map((evaluator) => (
                                <SelectItem key={evaluator.id} value={evaluator.id}>
                                  {evaluator.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                          Prazo
                        </Label>
                        <Input
                          id="deadline"
                          type="date"
                          className="col-span-3"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Observações
                        </Label>
                        <Textarea id="notes" placeholder="Observações adicionais" className="col-span-3" value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={createNewEvaluation}>
                        Criar Avaliação
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {activeTab === 'templates' && (
              <Dialog open={isTemplateDialogOpen} onOpenChange={(open) => {
                setIsTemplateDialogOpen(open)
                if (!open) {
                  setNewTemplateName("")
                  setNewTemplateDescription("")
                  setSelectedQuestions([])
                  setCustomQuestions([])
                  setNewQuestionText("")
                  setNewQuestionCategory("technical")
                }
              }}>
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
                                  {typeof category.name === 'string' ? category.name : 'Categoria sem nome'}
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
                                {typeof category.name === 'string' ? category.name : 'Categoria sem nome'}
                                <ChevronDown className="h-4 w-4" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pt-2">
                                {customQuestions
                                  .filter((q) => q.category === category.id)
                                  .map((question) => (
                                    <div key={question.id} className="flex items-center gap-2 py-2">
                                      <input
                                        type="checkbox"
                                        id={question.id}
                                        checked={selectedQuestions.includes(question.id)}
                                        onChange={() => toggleQuestionSelection(question.id)}
                                        className="h-4 w-4 rounded border-gray-300"
                                      />
                                      <label htmlFor={question.id} className="text-sm flex-1">
                                        {typeof question.text === 'string' ? question.text : 'Pergunta sem texto'}
                                      </label>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => removeCustomQuestion(question.id)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
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
            )}
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
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
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
                    evaluations.filter((e) => e.finalScore !== null).reduce((sum, e) => sum + (e.finalScore || 0), 0) /
                    evaluations.filter((e) => e.finalScore !== null).length
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
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Avaliador</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Autoavaliação</TableHead>
                    <TableHead>Avaliação do Gestor</TableHead>
                    <TableHead>Nota Final</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{evaluation.employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {evaluation.employee.matricula || 'Sem matrícula'}
                          </div>
                          {evaluation.employee.department && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {evaluation.employee.department.name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{evaluation.evaluator.name}</TableCell>
                      <TableCell>{evaluation.template.name}</TableCell>
                      <TableCell>
                        {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(evaluation.selfEvaluationStatus)} className="flex items-center gap-1">
                            {getStatusIcon(evaluation.selfEvaluationStatus)}
                            <span>{evaluation.selfEvaluationStatus || "Pendente"}</span>
                            {evaluation.selfScore !== null && (
                              <span className="ml-2">({evaluation.selfScore.toFixed(1)})</span>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(evaluation.managerEvaluationStatus)} className="flex items-center gap-1">
                            {getStatusIcon(evaluation.managerEvaluationStatus)}
                            <span>{evaluation.managerEvaluationStatus || "Pendente"}</span>
                            {evaluation.managerScore !== null && (
                              <span className="ml-2">({evaluation.managerScore.toFixed(1)})</span>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {evaluation.finalScore !== null ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <span>{evaluation.finalScore.toFixed(1)}</span>
                          </Badge>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/evaluations/${evaluation.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/evaluations/${evaluation.id}/details`)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(evaluation.template)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEvaluation(evaluation.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
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
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Modelos de Avaliação</CardTitle>
                <CardDescription>Modelos disponíveis para avaliações de desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : templates.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Nenhum modelo de avaliação encontrado.
                    </div>
                  ) : (
                    templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{template._count?.evaluations} avaliações</span>
                            <span>•</span>
                            <span>Última atualização: {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(template)}>
                              Editar modelo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDuplicateDialog(template)}>
                              Duplicar modelo
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deleteTemplate(template.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                  Excluindo...
                                </>
                              ) : (
                                'Excluir modelo'
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Avaliações</CardTitle>
                  <CardDescription>Distribuição de pontuações e status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Status das Avaliações</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {stats.statusStats.map((stat) => (
                          <div
                            key={stat.name}
                            className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg dark:bg-green-900/20"
                          >
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {stat.value}%
                            </span>
                            <span className="text-sm text-muted-foreground">{stat.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Distribuição de Pontuações</h3>
                      <div className="space-y-2">
                        {stats.scoreDistribution.map((item) => (
                          <div
                            key={item.range}
                            className={`flex items-center justify-between p-2 rounded-md ${
                              item.range === "9-10"
                                ? "bg-green-100 dark:bg-green-900/50"
                                : item.range === "8-8.9"
                                  ? "bg-blue-100 dark:bg-blue-900/50"
                                  : item.range === "7-7.9"
                                    ? "bg-yellow-100 dark:bg-yellow-900/50"
                                    : item.range === "6-6.9"
                                      ? "bg-orange-100 dark:bg-orange-900/50"
                                      : "bg-red-100 dark:bg-red-900/50"
                            }`}
                          >
                            <div>
                              <span className="font-medium">{item.range}</span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                {item.range === "9-10"
                                  ? "Excelente"
                                  : item.range === "8-8.9"
                                    ? "Muito Bom"
                                    : item.range === "7-7.9"
                                      ? "Bom"
                                      : item.range === "6-6.9"
                                        ? "Satisfatório"
                                        : "Precisa Melhorar"}
                              </span>
                            </div>
                            <div className="font-medium">{item.count} avaliações</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pontuação Média por Departamento</CardTitle>
                  <CardDescription>Comparação de desempenho entre departamentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.departmentScores.map((dept, index) => (
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
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar Modelo de Avaliação</DialogTitle>
            <DialogDescription>
              Edite as informações do modelo de avaliação
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-template-name" className="text-right">
                Nome do Modelo
              </Label>
              <Input
                id="edit-template-name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Ex: Avaliação Técnica"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-template-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="edit-template-description"
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                placeholder="Descreva o propósito deste modelo de avaliação"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => editingTemplate && editTemplate(editingTemplate.id)}
              disabled={isEditing || !newTemplateName.trim() || !editingTemplate}
            >
              {isEditing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Duplicar Modelo de Avaliação</DialogTitle>
            <DialogDescription>
              Crie uma cópia do modelo de avaliação selecionado
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duplicate-template-name" className="text-right">
                Nome do Modelo
              </Label>
              <Input
                id="duplicate-template-name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Ex: Avaliação Técnica"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duplicate-template-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="duplicate-template-description"
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                placeholder="Descreva o propósito deste modelo de avaliação"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDuplicateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (editingTemplate) {
                  duplicateTemplate(editingTemplate.id);
                }
              }}
              disabled={isDuplicating || !newTemplateName.trim() || !editingTemplate}
            >
              {isDuplicating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Duplicando...
                </>
              ) : (
                'Duplicar Modelo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

