"use client"

import type React from "react"

import { useState } from "react"
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

// Dados de exemplo para atestados médicos
const medicalLeaves = [
  {
    id: "ML001",
    employeeName: "João Silva",
    employeeId: "EMP001",
    department: "TI",
    startDate: "2024-03-10",
    endDate: "2024-03-14",
    days: 5,
    reason: "Gripe",
    cid: "J11",
    status: "Aprovado",
    doctor: "Dr. Carlos Mendes",
    hospital: "Hospital Santa Maria",
  },
  {
    id: "ML002",
    employeeName: "Ana Oliveira",
    employeeId: "EMP002",
    department: "RH",
    startDate: "2024-03-05",
    endDate: "2024-03-06",
    days: 2,
    reason: "Consulta Médica",
    cid: "Z00.0",
    status: "Aprovado",
    doctor: "Dra. Mariana Costa",
    hospital: "Clínica São Lucas",
  },
  {
    id: "ML003",
    employeeName: "Pedro Santos",
    employeeId: "EMP003",
    department: "Vendas",
    startDate: "2024-02-28",
    endDate: "2024-03-10",
    days: 11,
    reason: "Cirurgia",
    cid: "K40",
    status: "Aprovado",
    doctor: "Dr. Ricardo Alves",
    hospital: "Hospital São José",
  },
  {
    id: "ML004",
    employeeName: "Carla Ferreira",
    employeeId: "EMP004",
    department: "Marketing",
    startDate: "2024-02-20",
    endDate: "2024-02-21",
    days: 2,
    reason: "Dor nas Costas",
    cid: "M54.5",
    status: "Aprovado",
    doctor: "Dra. Juliana Ribeiro",
    hospital: "Clínica Ortopédica",
  },
  {
    id: "ML005",
    employeeName: "Lucas Mendes",
    employeeId: "EMP005",
    department: "Financeiro",
    startDate: "2024-02-15",
    endDate: "2024-02-16",
    days: 2,
    reason: "Febre",
    cid: "R50.9",
    status: "Aprovado",
    doctor: "Dr. Fernando Lima",
    hospital: "Hospital Central",
  },
  {
    id: "ML006",
    employeeName: "Fernanda Lima",
    employeeId: "EMP006",
    department: "TI",
    startDate: "2024-04-05",
    endDate: "2024-04-05",
    days: 1,
    reason: "Consulta Médica",
    cid: "Z00.0",
    status: "Pendente",
    doctor: "Dra. Mariana Costa",
    hospital: "Clínica São Lucas",
  },
  {
    id: "ML007",
    employeeName: "Ricardo Oliveira",
    employeeId: "EMP007",
    department: "RH",
    startDate: "2024-04-10",
    endDate: "2024-04-14",
    days: 5,
    reason: "Gripe",
    cid: "J11",
    status: "Pendente",
    doctor: "Dr. Carlos Mendes",
    hospital: "Hospital Santa Maria",
  },
  {
    id: "ML008",
    employeeName: "Camila Sousa",
    employeeId: "EMP008",
    department: "Vendas",
    startDate: "2024-04-15",
    endDate: "2024-04-15",
    days: 1,
    reason: "Consulta Médica",
    cid: "Z00.0",
    status: "Pendente",
    doctor: "Dr. Ricardo Alves",
    hospital: "Hospital São José",
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
  const [editingLeave, setEditingLeave] = useState<any>(null)

  // Estados para novo atestado
  const [newLeaveEmployee, setNewLeaveEmployee] = useState("")
  const [newLeaveStartDate, setNewLeaveStartDate] = useState("")
  const [newLeaveEndDate, setNewLeaveEndDate] = useState("")
  const [newLeaveReason, setNewLeaveReason] = useState("")
  const [newLeaveCID, setNewLeaveCID] = useState("")
  const [newLeaveDoctor, setNewLeaveDoctor] = useState("")
  const [newLeaveHospital, setNewLeaveHospital] = useState("")
  const [newLeaveDocuments, setNewLeaveDocuments] = useState<File[]>([])

  const router = useRouter()

  // Filtrar e ordenar atestados
  const filteredLeaves = medicalLeaves
    .filter(
      (leave) =>
        leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.cid.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((leave) => departmentFilter === "all" || leave.department === departmentFilter)
    .filter((leave) => statusFilter === "all" || leave.status === statusFilter)
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

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
    (leave) => new Date(leave.endDate) >= new Date() && leave.status === "Aprovado",
  ).length

  // Criar novo atestado
  const createNewLeave = () => {
    // Aqui você implementaria a lógica para criar o atestado
    toast({
      title: "Atestado registrado",
      description: `O novo atestado médico foi registrado com sucesso. ${newLeaveDocuments.length} documento(s) anexado(s).`,
    })
    setIsNewLeaveOpen(false)
    resetNewLeaveForm()
  }

  // Editar atestado
  const editLeave = (leave: any) => {
    setEditingLeave(leave)
    setIsEditLeaveOpen(true)
  }

  const saveEditedLeave = () => {
    toast({
      title: "Atestado atualizado",
      description: "As alterações no atestado foram salvas com sucesso.",
    })
    setIsEditLeaveOpen(false)
    setEditingLeave(null)
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
    // Implementação real exportaria os dados para o formato especificado
    console.log(`Exportando dados em formato ${format}`)

    // Simulação de download
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

  // Adicionar funcionalidade para os detalhes da tela de atestados
  const viewLeaveDetails = (leaveId: string) => {
    // Em uma implementação real, isso navegaria para a página de detalhes
    toast({
      title: "Detalhes do atestado",
      description: `Visualizando detalhes do atestado ${leaveId}`,
    })

    // Navegação para detalhes usando o router
    router.push(`/medical-leaves/${leaveId}`)
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl">Atestados Médicos</h1>
        <p className="text-muted-foreground">Gerenciar e acompanhar atestados médicos dos funcionários</p>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="list">Lista de Atestados</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
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
                    <Select value={newLeaveEmployee} onValueChange={setNewLeaveEmployee}>
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
                  <DialogTitle>Editar Atestado Médico</DialogTitle>
                  <DialogDescription>Atualize as informações do atestado médico</DialogDescription>
                </DialogHeader>
                {editingLeave && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-employee" className="text-right">
                        Funcionário
                      </Label>
                      <Select defaultValue={editingLeave.employeeId}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={editingLeave.employeeName} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={editingLeave.employeeId}>{editingLeave.employeeName}</SelectItem>
                          <SelectItem value="emp002">Ana Oliveira</SelectItem>
                          <SelectItem value="emp003">Pedro Santos</SelectItem>
                          <SelectItem value="emp004">Carla Ferreira</SelectItem>
                          <SelectItem value="emp005">Lucas Mendes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-start-date" className="text-right">
                        Data de Início
                      </Label>
                      <Input
                        id="edit-start-date"
                        type="date"
                        defaultValue={editingLeave.startDate}
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
                        defaultValue={editingLeave.endDate}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-reason" className="text-right">
                        Motivo
                      </Label>
                      <Input
                        id="edit-reason"
                        defaultValue={editingLeave.reason}
                        placeholder="Ex: Gripe, Consulta Médica"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-cid" className="text-right">
                        CID
                      </Label>
                      <Input
                        id="edit-cid"
                        defaultValue={editingLeave.cid}
                        placeholder="Código CID (ex: J11)"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-doctor" className="text-right">
                        Médico
                      </Label>
                      <Input
                        id="edit-doctor"
                        defaultValue={editingLeave.doctor}
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
                        defaultValue={editingLeave.hospital}
                        placeholder="Nome do hospital ou clínica"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-status" className="text-right">
                        Status
                      </Label>
                      <Select defaultValue={editingLeave.status}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={editingLeave.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Aprovado">Aprovado</SelectItem>
                          <SelectItem value="Rejeitado">Rejeitado</SelectItem>
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
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-1" />
                            Anexar
                          </Button>
                        </div>

                        <div className="border rounded-md p-3">
                          <p className="text-sm font-medium mb-2">Documentos anexados:</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm p-2 bg-secondary/20 rounded">
                              <div className="flex items-center gap-2">
                                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                                <span>Atestado_Médico.pdf</span>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
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
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Rejeitado">Rejeitado</SelectItem>
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
                <CardTitle className="text-sm font-medium">Total de Atestados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLeaves}</div>
                <p className="text-xs text-muted-foreground">+3 em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card className="animate-scale [animation-delay:100ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atestados Ativos</CardTitle>
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
              <CardTitle>Lista de Atestados Médicos</CardTitle>
              <CardDescription>Visualizar e gerenciar todos os atestados médicos</CardDescription>
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
                    <TableHead className="cursor-pointer" onClick={() => handleSort("startDate")}>
                      Período
                      {sortField === "startDate" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("days")}>
                      Dias
                      {sortField === "days" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("reason")}>
                      Motivo
                      {sortField === "reason" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("cid")}>
                      CID
                      {sortField === "cid" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
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
                      <TableCell className="font-medium">{leave.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{leave.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{leave.employeeId}</div>
                      </TableCell>
                      <TableCell>{leave.department}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(leave.startDate).toLocaleDateString()} a{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{leave.days}</TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>{leave.cid}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            leave.status === "Aprovado"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : leave.status === "Pendente"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {leave.status}
                        </span>
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
                            <DropdownMenuItem onClick={() => viewLeaveDetails(leave.id)}>Ver detalhes</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editLeave(leave)}>Editar atestado</DropdownMenuItem>
                            <DropdownMenuItem>Ver funcionário</DropdownMenuItem>
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
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Dias de Atestado por Mês</CardTitle>
                <CardDescription>Distribuição de dias de atestado ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={leavesByMonth}
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
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Atestados por Motivo</CardTitle>
                <CardDescription>Distribuição de atestados por motivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leavesByReason}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        {leavesByReason.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Atestados por Departamento</CardTitle>
                <CardDescription>Distribuição de atestados entre departamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={leavesByDepartment}
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
                      <Bar dataKey="value" name="Atestados" fill={MODERN_COLORS[2]}>
                        {leavesByDepartment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Funcionários com Mais Atestados</CardTitle>
                <CardDescription>Funcionários com maior número de atestados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "João Silva", department: "TI", count: 5, days: 12 },
                    { name: "Ana Oliveira", department: "RH", count: 4, days: 8 },
                    { name: "Pedro Santos", department: "Vendas", count: 3, days: 15 },
                    { name: "Carla Ferreira", department: "Marketing", count: 3, days: 6 },
                    { name: "Lucas Mendes", department: "Financeiro", count: 2, days: 4 },
                  ].map((employee, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {employee.department} • {employee.count} atestados
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{employee.days} dias</p>
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
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Análise de CIDs Mais Comuns</CardTitle>
              <CardDescription>Códigos CID mais frequentes nos atestados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    cid: "J11",
                    description: "Influenza [gripe] devido a vírus não identificado",
                    count: 15,
                    percentage: 25,
                  },
                  { cid: "Z00.0", description: "Exame médico geral", count: 12, percentage: 20 },
                  { cid: "M54.5", description: "Dor lombar baixa", count: 8, percentage: 13 },
                  { cid: "K40", description: "Hérnia inguinal", count: 5, percentage: 8 },
                  { cid: "R50.9", description: "Febre não especificada", count: 5, percentage: 8 },
                ].map((cid, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{cid.cid}</p>
                        <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                          {cid.count} ocorrências
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{cid.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{cid.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver Todos os CIDs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

