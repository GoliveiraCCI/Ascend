"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  Download,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  User,
  Upload,
  Trash,
  Check,
  ChevronsUpDown,
  FileText,
  TrendingUp,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MedicalLeaveDialog } from "@/components/forms/MedicalLeaveDialog"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"

// Tipos
interface MedicalLeave {
  id: string
  employee: {
    id: string
    name: string
    matricula: string
    department: {
      id: string
      name: string
    }
    shift?: {
      id: string
      name: string
      description: string
    }
    position: {
      id: string
      title: string
    }
  }
  startDate: string
  endDate: string
  days: number
  reason: string
  doctor: string | null
  hospital: string | null
  status: "FINALIZADO" | "AFASTADO"
  notes: string | null
  category?: {
    id: string
    name: string
  }
  file?: File
}

interface Employee {
  id: string
  name: string
  department: string
  matricula: string
}

interface MedicalLeaveCategory {
  id: string
  name: string
  description: string
}

// Dados de exemplo para Afastamentos
const medicalLeaves = [
  {
    id: "ML001",
    employee: {
      id: "EMP001",
      name: "João Silva",
      matricula: "12345"
    },
    startDate: "2024-03-10",
    endDate: "2024-03-14",
    days: 5,
    reason: "Gripe",
    doctor: "Dr. Carlos Mendes",
    hospital: "Hospital Santa Maria",
    status: "FINALIZADO"
  },
  {
    id: "ML002",
    employee: {
      id: "EMP002",
      name: "Ana Oliveira",
      matricula: "12346"
    },
    startDate: "2024-03-05",
    endDate: "2024-03-06",
    days: 2,
    reason: "Consulta Médica",
    doctor: "Dra. Mariana Costa",
    hospital: "Clínica São Lucas",
    status: "FINALIZADO"
  },
  {
    id: "ML003",
    employee: {
      id: "EMP003",
      name: "Pedro Santos",
      matricula: "12347"
    },
    startDate: "2024-02-28",
    endDate: "2024-03-10",
    days: 11,
    reason: "Cirurgia",
    doctor: "Dr. Ricardo Alves",
    hospital: "Hospital São José",
    status: "FINALIZADO"
  },
  {
    id: "ML004",
    employee: {
      id: "EMP004",
      name: "Carla Ferreira",
      matricula: "12348"
    },
    startDate: "2024-02-20",
    endDate: "2024-02-21",
    days: 2,
    reason: "Dor nas Costas",
    doctor: "Dra. Juliana Ribeiro",
    hospital: "Clínica Ortopédica",
    status: "FINALIZADO"
  },
  {
    id: "ML005",
    employee: {
      id: "EMP005",
      name: "Lucas Mendes",
      matricula: "12349"
    },
    startDate: "2024-02-15",
    endDate: "2024-02-16",
    days: 2,
    reason: "Febre",
    doctor: "Dr. Fernando Lima",
    hospital: "Hospital Central",
    status: "FINALIZADO"
  },
  {
    id: "ML006",
    employee: {
      id: "EMP006",
      name: "Fernanda Lima",
      matricula: "12350"
    },
    startDate: "2024-04-05",
    endDate: "2024-04-05",
    days: 1,
    reason: "Consulta Médica",
    doctor: "Dra. Mariana Costa",
    hospital: "Clínica São Lucas",
    status: "AFASTADO"
  },
  {
    id: "ML007",
    employee: {
      id: "EMP007",
      name: "Ricardo Oliveira",
      matricula: "12351"
    },
    startDate: "2024-04-10",
    endDate: "2024-04-14",
    days: 5,
    reason: "Gripe",
    doctor: "Dr. Carlos Mendes",
    hospital: "Hospital Santa Maria",
    status: "AFASTADO"
  },
  {
    id: "ML008",
    employee: {
      id: "EMP008",
      name: "Camila Sousa",
      matricula: "12352"
    },
    startDate: "2024-04-15",
    endDate: "2024-04-15",
    days: 1,
    reason: "Consulta Médica",
    doctor: "Dr. Ricardo Alves",
    hospital: "Hospital São José",
    status: "AFASTADO"
  },
]

// Dados para gráficos
const leavesByReason = [
  { name: "Gripe/Resfriado", value: 35 },
  { name: "Consulta Médica", value: 25 },
  { name: "Dor nas Costas", value: 15 },
  { name: "Cirurgia", value: 10 },
  { name: "Febre", value: 8 },
  { name: "Outros", value: 7 },
]

const leavesByDepartment = [
  { name: "TI", value: 28 },
  { name: "RH", value: 22 },
  { name: "Vendas", value: 18 },
  { name: "Marketing", value: 15 },
  { name: "Financeiro", value: 12 },
  { name: "Operações", value: 5 },
]

const leavesByMonth = [
  { name: "Jan", dias: 45 },
  { name: "Fev", dias: 60 },
  { name: "Mar", dias: 35 },
  { name: "Abr", dias: 20 },
  { name: "Mai", dias: 0 },
  { name: "Jun", dias: 0 },
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

export default function MedicalLeavesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("startDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("list")
  const [isNewLeaveOpen, setIsNewLeaveOpen] = useState(false)
  const [isEditLeaveOpen, setIsEditLeaveOpen] = useState(false)
  const [editingLeave, setEditingLeave] = useState<MedicalLeave | null>(null)
  const [editingFile, setEditingFile] = useState<File | null>(null)
  const [editingFilePreview, setEditingFilePreview] = useState<string | null>(null)
  const [medicalLeaves, setMedicalLeaves] = useState<MedicalLeave[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [medicalLeaveCategories, setMedicalLeaveCategories] = useState<MedicalLeaveCategory[]>([])
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MedicalLeaveCategory | null>(null)
  const [categoryStats, setCategoryStats] = useState<any[]>([])

  // Estados para novo atestado
  const [newLeaveEmployee, setNewLeaveEmployee] = useState("")
  const [newLeaveStartDate, setNewLeaveStartDate] = useState("")
  const [newLeaveEndDate, setNewLeaveEndDate] = useState("")
  const [newLeaveReason, setNewLeaveReason] = useState("")
  const [newLeaveCID, setNewLeaveCID] = useState("")
  const [newLeaveDoctor, setNewLeaveDoctor] = useState("")
  const [newLeaveHospital, setNewLeaveHospital] = useState("")
  const [newLeaveDocuments, setNewLeaveDocuments] = useState<File[]>([])

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const router = useRouter()

  // Carregar dados iniciais
  useEffect(() => {
    fetchMedicalLeaves()
    fetchEmployees()
    fetchMedicalLeaveCategories()
    fetchCategoryStats()
  }, [departmentFilter, statusFilter, searchTerm])

  const fetchMedicalLeaveCategories = async () => {
    try {
      const response = await fetch('/api/medical-leave-categories')
      if (!response.ok) throw new Error('Erro ao buscar categorias')
      const data = await response.json()
      setMedicalLeaveCategories(data)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias de afastamento",
        variant: "destructive",
      })
    }
  }

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch('/api/medical-leaves/categories/stats')
      if (!response.ok) throw new Error('Erro ao buscar estatísticas das categorias')
      const data = await response.json()
      setCategoryStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas das categorias:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas das categorias",
        variant: "destructive",
      })
    }
  }

  const createCategory = async (category: { name: string; description: string }) => {
    try {
      const response = await fetch('/api/medical-leave-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar categoria')
      }

      const data = await response.json()
      await fetchMedicalLeaveCategories()
      setIsNewCategoryOpen(false)
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso",
      })
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar categoria",
        variant: "destructive",
      })
    }
  }

  const updateCategory = async (id: string, name: string, description: string) => {
    try {
      // Verifica se o ID existe
      if (!id) {
        throw new Error('ID da categoria é obrigatório')
      }

      // Verifica se os campos obrigatórios estão preenchidos
      if (!name || !description) {
        throw new Error('Nome e descrição são obrigatórios')
      }

      const response = await fetch(`/api/medical-leave-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })

      // Verifica se a resposta é válida
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = 'Erro ao atualizar categoria'
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('Erro ao processar resposta:', e)
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      // Processa a resposta de sucesso
      const updatedCategory = await response.json()
      
      // Atualiza o estado
      setMedicalLeaveCategories(prevCategories => 
        prevCategories.map(cat => cat.id === id ? updatedCategory : cat)
      )
      
      // Limpa o estado e fecha o diálogo
      setIsNewCategoryOpen(false)
      setEditingCategory(null)
      
      // Mostra mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso",
      })
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar categoria",
        variant: "destructive",
      })
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/medical-leave-categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir categoria')
      }

      await fetchMedicalLeaveCategories()
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso",
      })
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir categoria",
        variant: "destructive",
      })
    }
  }

  const editCategory = (category: MedicalLeaveCategory) => {
    setEditingCategory(category)
    setIsNewCategoryOpen(true)
  }

  // Buscar licenças médicas
  const fetchMedicalLeaves = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (departmentFilter !== "all") params.append("department", departmentFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchTerm) params.append("search", searchTerm)

      console.log("Buscando licenças médicas com parâmetros:", params.toString())
      const response = await fetch(`/api/medical-leaves?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Erro ao buscar licenças médicas")
      }
      
      const data = await response.json()
      console.log("Dados recebidos:", data)
      setMedicalLeaves(data)

      // Extrair departamentos únicos
      const uniqueDepartments = Array.from(new Set(data.map((leave: MedicalLeave) => leave.employee.department.name))) as string[]
      setDepartments(uniqueDepartments)
    } catch (error) {
      console.error("Erro ao buscar licenças médicas:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível carregar as licenças médicas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Buscar funcionários
  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      if (!response.ok) throw new Error("Erro ao buscar funcionários")
      
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de funcionários",
        variant: "destructive",
      })
    }
  }

  // Filtrar e ordenar atestados
  const filteredLeaves = [...medicalLeaves].sort((a, b) => {
    const aValue = a[sortField as keyof MedicalLeave]
    const bValue = b[sortField as keyof MedicalLeave]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
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

  // Calcular totais
  const totalDays = medicalLeaves.reduce((total, leave) => total + leave.days, 0)
  const totalLeaves = medicalLeaves.length
  const activeLeaves = medicalLeaves.filter(
    (leave) => new Date(leave.endDate) >= new Date() && leave.status === "FINALIZADO"
  ).length

  // Criar novo atestado
  const createNewLeave = async () => {
    try {
      const startDate = new Date(newLeaveStartDate)
      const endDate = new Date(newLeaveEndDate)
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

      const response = await fetch("/api/medical-leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: newLeaveEmployee,
          startDate: newLeaveStartDate,
          endDate: newLeaveEndDate,
          days,
          reason: newLeaveReason,
          cid: newLeaveCID,
          doctor: newLeaveDoctor,
          hospital: newLeaveHospital,
        }),
      })

      if (!response.ok) throw new Error("Erro ao criar licença médica")

      toast({
        title: "Atestado registrado",
        description: `O novo atestado médico foi registrado com sucesso. ${newLeaveDocuments.length} documento(s) anexado(s).`,
      })

      setIsNewLeaveOpen(false)
      resetNewLeaveForm()
      fetchMedicalLeaves()
    } catch (error) {
      console.error("Erro ao criar licença médica:", error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar o atestado médico",
        variant: "destructive",
      })
    }
  }

  // Editar atestado
  const editLeave = (leave: MedicalLeave) => {
    setEditingLeave(leave)
    setIsEditLeaveOpen(true)
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setEditingFile(file)
      
      // Criar preview para imagens
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setEditingFilePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setEditingFilePreview(null)
      }
    }
  }

  const handleRemoveEditFile = () => {
    setEditingFile(null)
    setEditingFilePreview(null)
  }

  const saveEditedLeave = async () => {
    if (!editingLeave) return

    try {
      const formData = new FormData()
      formData.append('id', editingLeave.id)
      formData.append('startDate', editingLeave.startDate)
      formData.append('endDate', editingLeave.endDate)
      formData.append('days', editingLeave.days.toString())
      formData.append('reason', editingLeave.reason)
      formData.append('doctor', editingLeave.doctor || '')
      formData.append('hospital', editingLeave.hospital || '')
      formData.append('status', editingLeave.status)

      if (editingFile) {
        formData.append('file', editingFile)
      }

      const response = await fetch("/api/medical-leaves", {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) throw new Error("Erro ao atualizar licença médica")

      toast({
        title: "Atestado atualizado",
        description: "As alterações no atestado foram salvas com sucesso.",
      })

      setIsEditLeaveOpen(false)
      setEditingLeave(null)
      setEditingFile(null)
      setEditingFilePreview(null)
      fetchMedicalLeaves()
    } catch (error) {
      console.error("Erro ao atualizar licença médica:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o atestado médico",
        variant: "destructive",
      })
    }
  }

  // Resetar formulário
  const resetNewLeaveForm = () => {
    setNewLeaveEmployee("")
    setNewLeaveStartDate("")
    setNewLeaveEndDate("")
    setNewLeaveReason("")
    setNewLeaveCID("")
    setNewLeaveDoctor("")
    setNewLeaveHospital("")
    setNewLeaveDocuments([])
  }

  // Gerenciar documentos
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setNewLeaveDocuments([...newLeaveDocuments, ...filesArray])
    }
  }

  const removeDocument = (index: number) => {
    const updatedDocs = [...newLeaveDocuments]
    updatedDocs.splice(index, 1)
    setNewLeaveDocuments(updatedDocs)
  }

  // Exportar dados
  const exportData = (format: string) => {
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(filteredLeaves, null, 2)], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `atestados_${new Date().toISOString().split("T")[0]}.${format}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Exportação concluída",
      description: `Os dados foram exportados em formato ${format.toUpperCase()}.`,
    })
  }

  // Visualizar detalhes
  const viewLeaveDetails = (id: string) => {
    router.push(`/medical-leaves/${id}`)
  }

  // Dados para o gráfico de tendência mensal
  const monthlyData = useMemo(() => {
    // Agrupar licenças por mês
    const leavesByMonth = medicalLeaves.reduce((acc, leave) => {
      const month = new Date(leave.startDate).getMonth()
      if (!acc[month]) {
        acc[month] = 0
      }
      acc[month] += leave.days
      return acc
    }, {} as Record<number, number>)

    // Criar array com os últimos 12 meses
    return Array.from({ length: 12 }, (_, i) => {
      const month = (new Date().getMonth() - i + 12) % 12
      const monthName = new Date(2000, month).toLocaleString('pt-BR', { month: 'short' })
      const daysInMonth = leavesByMonth[month] || 0
      
      return {
        name: monthName,
        dias: daysInMonth
      }
    }).reverse()
  }, [medicalLeaves])

  // Dados para o gráfico de departamentos
  const departmentData = useMemo(() => {
    const leavesByDepartment = medicalLeaves.reduce((acc, leave) => {
      const departmentName = leave.employee.department.name
      if (!acc[departmentName]) {
        acc[departmentName] = 0
      }
      acc[departmentName] += leave.days
      return acc
    }, {} as Record<string, number>)

    return Object.entries(leavesByDepartment).map(([department, days]) => ({
      name: department,
      dias: days
    }))
  }, [medicalLeaves])

  // Dados para o gráfico de categorias
  const categoryData = useMemo(() => {
    const leavesByCategory = medicalLeaves.reduce((acc, leave) => {
      const categoryName = leave.category?.name || "Sem Categoria"
      if (!acc[categoryName]) {
        acc[categoryName] = {
          count: 0,
          days: 0
        }
      }
      acc[categoryName].count++
      acc[categoryName].days += leave.days
      return acc
    }, {} as Record<string, { count: number; days: number }>)

    return Object.entries(leavesByCategory).map(([category, data]) => ({
      name: category,
      quantidade: data.count,
      dias: data.days
    }))
  }, [medicalLeaves])

  // Dados para o gráfico de funcionários com mais atestados
  const employeesWithMostLeaves = useMemo(() => {
    const leavesByEmployee = medicalLeaves.reduce((acc, leave) => {
      if (!acc[leave.employee.id]) {
        acc[leave.employee.id] = {
          name: leave.employee.name,
          department: leave.employee.department.name,
          count: 0,
          days: 0
        }
      }
      acc[leave.employee.id].count++
      acc[leave.employee.id].days += leave.days
      return acc
    }, {} as Record<string, { name: string; department: string; count: number; days: number }>)

    return Object.values(leavesByEmployee)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [medicalLeaves])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "afastado":
        return "bg-red-500 hover:bg-red-600"
      case "finalizado":
        return "bg-black hover:bg-black text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getLeaveStatus = (leave: MedicalLeave) => {
    const today = new Date()
    const endDate = new Date(leave.endDate)
    
    if (endDate < today) {
      return "FINALIZADO"
    }
    return "AFASTADO"
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl">Afastamentos</h1>
        <p className="text-muted-foreground">Gerenciar e acompanhar Afastamentos dos funcionários</p>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="list">Lista de Atestados</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isNewLeaveOpen} onOpenChange={setIsNewLeaveOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Atestado
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Registrar Atestado Médico</DialogTitle>
                  <DialogDescription>Registre um novo atestado médico para um funcionário</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employee" className="text-right">
                      Funcionário
                    </Label>
                    <div className="col-span-3">
                      <Command className="border rounded-md">
                        <CommandInput 
                          placeholder="Digite o nome ou matrícula do funcionário..."
                          className="h-9"
                          value={searchValue}
                          onValueChange={(value) => {
                            setSearchValue(value)
                            const searchLower = value.toLowerCase()
                            const filtered = employees.filter(employee => 
                              employee.name.toLowerCase().includes(searchLower) ||
                              employee.matricula.toLowerCase().includes(searchLower)
                            )
                            setFilteredEmployees(filtered)
                          }}
                        />
                        <CommandEmpty>Nenhum funcionário encontrado.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-auto">
                          {(searchValue ? filteredEmployees : employees).map((employee) => (
                            <CommandItem
                              key={employee.id}
                              value={`${employee.name} ${employee.matricula}`}
                              onSelect={() => {
                                setNewLeaveEmployee(employee.id)
                                setSearchValue(employee.name)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newLeaveEmployee === employee.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{employee.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  Matrícula: {employee.matricula}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start-date" className="text-right">
                      Data de Início
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newLeaveStartDate}
                      onChange={(e) => setNewLeaveStartDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end-date" className="text-right">
                      Data de Término
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={newLeaveEndDate}
                      onChange={(e) => setNewLeaveEndDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">
                      Motivo
                    </Label>
                    <Input
                      id="reason"
                      value={newLeaveReason}
                      onChange={(e) => setNewLeaveReason(e.target.value)}
                      placeholder="Ex: Gripe, Consulta Médica"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cid" className="text-right">
                      CID
                    </Label>
                    <Input
                      id="cid"
                      value={newLeaveCID}
                      onChange={(e) => setNewLeaveCID(e.target.value)}
                      placeholder="Código CID (ex: J11)"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="doctor" className="text-right">
                      Médico
                    </Label>
                    <Input
                      id="doctor"
                      value={newLeaveDoctor}
                      onChange={(e) => setNewLeaveDoctor(e.target.value)}
                      placeholder="Nome do médico"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hospital" className="text-right">
                      Hospital/Clínica
                    </Label>
                    <Input
                      id="hospital"
                      value={newLeaveHospital}
                      onChange={(e) => setNewLeaveHospital(e.target.value)}
                      placeholder="Nome do hospital ou clínica"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Observações
                    </Label>
                    <Textarea id="notes" placeholder="Observações adicionais" className="col-span-3" />
                  </div>

                  {/* Seção de anexos */}
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Documentos</Label>
                    <div className="col-span-3 space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          id="document-upload"
                          type="file"
                          multiple
                          onChange={handleDocumentUpload}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Anexar
                        </Button>
                      </div>

                      {newLeaveDocuments.length > 0 && (
                        <div className="border rounded-md p-3">
                          <p className="text-sm font-medium mb-2">Documentos anexados:</p>
                          <div className="space-y-2">
                            {newLeaveDocuments.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm p-2 bg-secondary/20 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                  <span>{doc.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocument(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Formatos suportados: PDF, JPG, JPEG, PNG, DOC, DOCX. Tamanho máximo: 10MB por arquivo.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewLeaveOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={createNewLeave}>
                    Registrar Atestado
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Dialog para editar atestado */}
            <Dialog open={isEditLeaveOpen} onOpenChange={setIsEditLeaveOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Editar afastamento</DialogTitle>
                  <DialogDescription>Atualize as informações do afastamento</DialogDescription>
                </DialogHeader>
                {editingLeave && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-employee" className="text-right">
                        Funcionário
                      </Label>
                      <Input
                        id="edit-employee"
                        value={editingLeave.employee.name}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-start-date" className="text-right">
                        Data de Início
                      </Label>
                      <Input
                        id="edit-start-date"
                        type="date"
                        value={editingLeave.startDate.split('T')[0]}
                        onChange={(e) => setEditingLeave({
                          ...editingLeave,
                          startDate: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-end-date" className="text-right">
                        Data de Término
                      </Label>
                      <Input
                        id="edit-end-date"
                        type="date"
                        value={editingLeave.endDate.split('T')[0]}
                        onChange={(e) => setEditingLeave({
                          ...editingLeave,
                          endDate: e.target.value
                        })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-reason" className="text-right">
                        Motivo
                      </Label>
                      <Input
                        id="edit-reason"
                        value={editingLeave.reason}
                        onChange={(e) => setEditingLeave({
                          ...editingLeave,
                          reason: e.target.value
                        })}
                        placeholder="Ex: Gripe, Consulta Médica"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-doctor" className="text-right">
                        Médico
                      </Label>
                      <Input
                        id="edit-doctor"
                        value={editingLeave.doctor || ''}
                        onChange={(e) => setEditingLeave({
                          ...editingLeave,
                          doctor: e.target.value
                        })}
                        placeholder="Nome do médico"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-hospital" className="text-right">
                        Hospital/Clínica
                      </Label>
                      <Input
                        id="edit-hospital"
                        value={editingLeave.hospital || ''}
                        onChange={(e) => setEditingLeave({
                          ...editingLeave,
                          hospital: e.target.value
                        })}
                        placeholder="Nome do hospital ou clínica"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-status" className="text-right">
                        Status
                      </Label>
                      <Select 
                        value={editingLeave.status}
                        onValueChange={(value) => setEditingLeave({
                          ...editingLeave,
                          status: value as "FINALIZADO" | "AFASTADO"
                        })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                          <SelectItem value="AFASTADO">Afastado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Seção de anexos */}
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">Documentos</Label>
                      <div className="col-span-3 space-y-4">
                        <div className="flex items-center gap-2">
                          <Input
                            id="edit-document-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleEditFileChange}
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-1" />
                            Anexar
                          </Button>
                        </div>

                        <div className="border rounded-md p-3">
                          <p className="text-sm font-medium mb-2">Documentos anexados:</p>
                          <div className="space-y-2">
                            {editingLeave.file && (
                              <div className="flex items-center justify-between text-sm p-2 bg-secondary/20 rounded">
                                <div className="flex items-center gap-2">
                                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                  <span>{editingLeave.file.name}</span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            )}
                            {editingFile && (
                              <div className="flex items-center justify-between text-sm p-2 bg-secondary/20 rounded">
                                <div className="flex items-center gap-2">
                                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                  <span>{editingFile.name}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={handleRemoveEditFile}
                                >
                                  <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingFilePreview && (
                          <div className="relative h-40 w-full">
                            <Image
                              src={editingFilePreview}
                              alt="Preview"
                              fill
                              className="object-contain rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditLeaveOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={saveEditedLeave}>
                    Salvar Alterações
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
                  placeholder="Buscar atestados..."
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
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  <SelectItem value="AFASTADO">Afastado</SelectItem>
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
                <CardTitle className="text-sm font-medium">Afastamentos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLeaves}</div>
                <p className="text-xs text-muted-foreground">+3 em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card className="animate-scale [animation-delay:100ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Afastamentos Ativos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeLeaves}</div>
                <p className="text-xs text-muted-foreground">+1 em relação à semana anterior</p>
              </CardContent>
            </Card>
            <Card className="animate-scale [animation-delay:200ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Dias</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDays}</div>
                <p className="text-xs text-muted-foreground">+15 em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Lista de Afastamentos</CardTitle>
              <CardDescription>Visualizar e gerenciar todos os Afastamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("employee.matricula")}>
                      Matrícula
                      {sortField === "employee.matricula" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("employee.name")}>
                      Funcionário
                      {sortField === "employee.name" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("startDate")}>
                      Período
                      {sortField === "startDate" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("days")}>
                      Dias
                      {sortField === "days" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                      Status
                      {sortField === "status" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.map((leave) => (
                    <TableRow key={leave.id} className="animate-fade">
                      <TableCell className="font-medium">{leave.employee.matricula}</TableCell>
                      <TableCell>
                        <div className="font-medium">{leave.employee.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(leave.startDate).toLocaleDateString()} a{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{leave.days}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(getLeaveStatus(leave))}>
                          {getLeaveStatus(leave)}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => editLeave(leave)}>Editar atestado</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => viewLeaveDetails(leave.id)}>Ver detalhes</DropdownMenuItem>
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
                Mostrando {filteredLeaves.length} de {medicalLeaves.length} atestados
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

        <TabsContent value="analytics" className="animate-fade">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Dias perdidos de afastamento por Mês</CardTitle>
                <CardDescription>Distribuição de dias de afastamento ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="dias" name="Dias" fill={MODERN_COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Departamento</CardTitle>
                <CardDescription>Total de dias de afastamento por departamento</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData.map(item => ({
                        ...item,
                        displayName: item.name
                          .split(' ')
                          .map(word => {
                            if (word.length <= 3) return word;
                            if (word.toLowerCase() === 'departamento') return 'Dep.';
                            if (word.toLowerCase() === 'recursos') return 'Rec.';
                            if (word.toLowerCase() === 'humanos') return 'Hum.';
                            if (word.toLowerCase() === 'financeiro') return 'Fin.';
                            if (word.toLowerCase() === 'administrativo') return 'Adm.';
                            if (word.toLowerCase() === 'comercial') return 'Com.';
                            if (word.toLowerCase() === 'operacional') return 'Op.';
                            return word.slice(0, 3) + '.';
                          })
                          .join(' '),
                        name: item.name
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="displayName" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <RechartsTooltip 
                        contentStyle={{ fontSize: 12 }}
                        formatter={(value, name, props) => {
                          const fullName = props.payload.name;
                          return [value, fullName];
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="dias" name="Dias" fill={MODERN_COLORS[1]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Afastamento por Categoria</CardTitle>
                <CardDescription>Distribuição de Afastamento por categoria de licença</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryStats}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 30,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis 
                        type="category" 
                        dataKey="name"
                        width={120}
                        tick={{ fontSize: 11 }}
                      />
                      <RechartsTooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="total" name="Quantidade" fill={MODERN_COLORS[2]} />
                      <Bar dataKey="days" name="Dias" fill={MODERN_COLORS[3]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funcionários com Mais Dias Perdidos</CardTitle>
                <CardDescription>Funcionários com maior número de dias de afastamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employeesWithMostLeaves
                    .sort((a, b) => b.days - a.days)
                    .slice(0, 5)
                    .map((employee) => (
                      <div
                        key={employee.name}
                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{employee.name}</p>
                            <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                              {employee.count} atestados
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{employee.days} dias</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((employee.days / totalDays) * 100)}% do total
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Todos os Funcionários
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise de afastamento por Turno</CardTitle>
                <CardDescription>Distribuição de afastamento por turno de trabalho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const leavesByShift = medicalLeaves.reduce((acc, leave) => {
                      const shiftName = leave.employee.shift?.name || "Sem Turno"
                      if (!acc[shiftName]) {
                        acc[shiftName] = {
                          count: 0,
                          days: 0,
                          description: leave.employee.shift?.description || "Turno não definido"
                        }
                      }
                      acc[shiftName].count++
                      acc[shiftName].days += leave.days
                      return acc
                    }, {} as Record<string, { count: number; days: number; description: string }>)

                    return Object.entries(leavesByShift)
                      .map(([shift, data]) => ({
                        name: shift,
                        description: data.description,
                        count: data.count,
                        days: data.days,
                        percentage: Math.round((data.days / totalDays) * 100)
                      }))
                      .sort((a, b) => b.days - a.days)
                      .slice(0, 5)
                      .map((shift) => (
                        <div
                          key={shift.name}
                          className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{shift.name}</p>
                              <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                                {shift.count} atestados
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{shift.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{shift.days} dias</p>
                            <p className="text-xs text-muted-foreground">
                              {shift.percentage}% do total
                            </p>
                          </div>
                        </div>
                      ))
                  })()}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Todos os Turnos
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="animate-fade">
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Afastamento</CardTitle>
              <CardDescription>Gerenciar categorias de afastamento médico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setIsNewCategoryOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Categoria
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalLeaveCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => editCategory(category)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteCategory(category.id)}>
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MedicalLeaveDialog
        open={isNewLeaveOpen}
        onOpenChange={setIsNewLeaveOpen}
        onSuccess={() => {
          setIsNewLeaveOpen(false)
          resetNewLeaveForm()
          fetchMedicalLeaves()
        }}
      />

      {/* Dialog para nova categoria */}
      <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'} de Afastamento
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Edite' : 'Adicione'} uma categoria de afastamento médico
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editingCategory?.name || ''}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : { id: '', name: e.target.value, description: '' })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editingCategory?.description || ''}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : { id: '', name: '', description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsNewCategoryOpen(false)
              setEditingCategory(null)
            }}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (editingCategory && editingCategory.id) {
                updateCategory(editingCategory.id, editingCategory.name, editingCategory.description)
              } else {
                const name = (document.getElementById('name') as HTMLInputElement)?.value
                const description = (document.getElementById('description') as HTMLTextAreaElement)?.value
                if (name && description) {
                  createCategory({
                    name: name.trim(),
                    description: description.trim()
                  })
                } else {
                  toast({
                    title: "Erro",
                    description: "Nome e descrição são obrigatórios",
                    variant: "destructive",
                  })
                }
              }
            }}>
              {editingCategory ? 'Atualizar' : 'Criar'} Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

