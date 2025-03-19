"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowUpDown,
  BookOpen,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  Users,
  ImageIcon,
  File,
  X,
  Edit,
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
import { useRouter } from "next/navigation"

// Dados de exemplo de treinamentos
const trainings = [
  {
    id: "TR001",
    name: "JavaScript Avançado",
    category: "Técnico",
    instructor: "Carlos Mendes",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    hours: 24,
    participants: 12,
    status: "Concluído",
    department: "TI",
  },
  {
    id: "TR002",
    name: "Fundamentos de Liderança",
    category: "Habilidades Sociais",
    instructor: "Ana Ferreira",
    startDate: "2024-03-10",
    endDate: "2024-03-11",
    hours: 16,
    participants: 8,
    status: "Concluído",
    department: "Todos",
  },
  {
    id: "TR003",
    name: "Segurança de Dados",
    category: "Conformidade",
    instructor: "Ricardo Santos",
    startDate: "2024-03-05",
    endDate: "2024-03-05",
    hours: 4,
    participants: 45,
    status: "Concluído",
    department: "Todos",
  },
  {
    id: "TR004",
    name: "Gestão de Projetos",
    category: "Liderança",
    instructor: "Mariana Costa",
    startDate: "2024-02-28",
    endDate: "2024-03-01",
    hours: 20,
    participants: 15,
    status: "Concluído",
    department: "Todos",
  },
  {
    id: "TR005",
    name: "Padrões Avançados de React",
    category: "Técnico",
    instructor: "Carlos Mendes",
    startDate: "2024-04-05",
    endDate: "2024-04-06",
    hours: 16,
    participants: 18,
    status: "Agendado",
    department: "TI",
  },
  {
    id: "TR006",
    name: "Comunicação Eficaz",
    category: "Habilidades Sociais",
    instructor: "Ana Ferreira",
    startDate: "2024-04-12",
    endDate: "2024-04-12",
    hours: 8,
    participants: 25,
    status: "Agendado",
    department: "Todos",
  },
  {
    id: "TR007",
    name: "Conformidade com LGPD",
    category: "Conformidade",
    instructor: "Ricardo Santos",
    startDate: "2024-04-18",
    endDate: "2024-04-18",
    hours: 4,
    participants: 50,
    status: "Agendado",
    department: "Todos",
  },
  {
    id: "TR008",
    name: "Planejamento Estratégico",
    category: "Liderança",
    instructor: "Mariana Costa",
    startDate: "2024-04-25",
    endDate: "2024-04-26",
    hours: 12,
    participants: 12,
    status: "Agendado",
    department: "Gerência",
  },
]

// Dados para gráficos
const trainingsByCategory = [
  { name: "Técnico", value: 40 },
  { name: "Habilidades Sociais", value: 24 },
  { name: "Liderança", value: 32 },
  { name: "Conformidade", value: 8 },
]

const trainingsByDepartment = [
  { name: "TI", value: 34 },
  { name: "RH", value: 12 },
  { name: "Financeiro", value: 8 },
  { name: "Marketing", value: 10 },
  { name: "Operações", value: 15 },
  { name: "Gerência", value: 12 },
  { name: "Todos", value: 9 },
]

const trainingHoursByMonth = [
  { name: "Jan", horas: 45 },
  { name: "Fev", horas: 60 },
  { name: "Mar", horas: 64 },
  { name: "Abr", horas: 40 },
  { name: "Mai", horas: 0 },
  { name: "Jun", horas: 0 },
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

export default function TrainingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("startDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("list")

  const [trainingType, setTrainingType] = useState<"individual" | "team">("individual")
  const [trainingSource, setTrainingSource] = useState<"internal" | "external">("internal")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  // Estados para documentos e fotos
  const [trainingDocuments, setTrainingDocuments] = useState<File[]>([])
  const [trainingPhotos, setTrainingPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])

  const router = useRouter()

  // Filtrar e ordenar treinamentos
  const filteredTrainings = trainings
    .filter(
      (training) =>
        training.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        training.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((training) => categoryFilter === "all" || training.category === categoryFilter)
    .filter((training) => statusFilter === "all" || training.status === statusFilter)
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
  const totalHours = trainings.reduce((total, training) => total + training.hours, 0)
  const totalParticipants = trainings.reduce((total, training) => total + training.participants, 0)
  const completedTrainings = trainings.filter((training) => training.status === "Concluído").length

  // Função para exportar dados
  const exportData = (format: string) => {
    // Implementação real exportaria os dados para o formato especificado
    console.log(`Exportando dados em formato ${format}`)

    // Simulação de download
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(filteredTrainings, null, 2)], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `treinamentos_${new Date().toISOString().split("T")[0]}.${format}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Exportação concluída",
      description: `Os dados foram exportados em formato ${format.toUpperCase()}.`,
    })
  }

  // Função para importar dados
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        console.log("Dados importados:", importedData)
        // Aqui você implementaria a lógica para processar os dados importados
        toast({
          title: "Importação concluída",
          description: `${importedData.length} registros importados com sucesso!`,
        })
      } catch (error) {
        console.error("Erro ao importar dados:", error)
        toast({
          title: "Erro na importação",
          description: "Erro ao importar dados. Verifique o formato do arquivo.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const viewTrainingDetails = (trainingId: string) => {
    // Navegação para detalhes usando o router
    router.push(`/trainings/${trainingId}`)
  }

  // Funções para gerenciar documentos
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setTrainingDocuments([...trainingDocuments, ...filesArray])
    }
  }

  const removeDocument = (index: number) => {
    const updatedDocs = [...trainingDocuments]
    updatedDocs.splice(index, 1)
    setTrainingDocuments(updatedDocs)
  }

  // Funções para gerenciar fotos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setTrainingPhotos([...trainingPhotos, ...filesArray])

      // Criar URLs para preview
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls])
    }
  }

  const removePhoto = (index: number) => {
    // Remover a foto e sua URL de preview
    const updatedPhotos = [...trainingPhotos]
    updatedPhotos.splice(index, 1)
    setTrainingPhotos(updatedPhotos)

    const updatedUrls = [...photoPreviewUrls]
    // Revogar a URL para liberar memória
    URL.revokeObjectURL(updatedUrls[index])
    updatedUrls.splice(index, 1)
    setPhotoPreviewUrls(updatedUrls)
  }

  // Função para criar novo treinamento
  const createNewTraining = () => {
    toast({
      title: "Treinamento criado",
      description: `Novo treinamento criado com sucesso. ${trainingDocuments.length} documento(s) e ${trainingPhotos.length} foto(s) anexado(s).`,
    })

    // Limpar formulário
    setSelectedParticipants([])
    setTrainingDocuments([])
    setTrainingPhotos([])

    // Revogar todas as URLs de preview para liberar memória
    photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    setPhotoPreviewUrls([])
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl">Treinamentos</h1>
        <p className="text-muted-foreground">Gerenciar e acompanhar treinamentos de funcionários</p>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="list">Lista de Treinamentos</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Treinamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Treinamento</DialogTitle>
                  <DialogDescription>Registrar um novo treinamento para funcionários</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="training-name" className="text-right">
                      Nome
                    </Label>
                    <Input id="training-name" placeholder="Nome do treinamento" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoria
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Técnico</SelectItem>
                        <SelectItem value="soft-skills">Habilidades Sociais</SelectItem>
                        <SelectItem value="leadership">Liderança</SelectItem>
                        <SelectItem value="compliance">Conformidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="training-type" className="text-right">
                      Tipo de Treinamento
                    </Label>
                    <div className="col-span-3 flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="individual"
                          checked={trainingType === "individual"}
                          onChange={() => setTrainingType("individual")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="individual">Individual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="team"
                          checked={trainingType === "team"}
                          onChange={() => setTrainingType("team")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="team">Equipe</Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="training-source" className="text-right">
                      Origem
                    </Label>
                    <div className="col-span-3 flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="internal"
                          checked={trainingSource === "internal"}
                          onChange={() => setTrainingSource("internal")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="internal">Interno</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="external"
                          checked={trainingSource === "external"}
                          onChange={() => setTrainingSource("external")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="external">Externo</Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="instructor" className="text-right">
                      Instrutor
                    </Label>
                    <Input id="instructor" placeholder="Nome do instrutor" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start-date" className="text-right">
                      Data de Início
                    </Label>
                    <Input id="start-date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end-date" className="text-right">
                      Data de Término
                    </Label>
                    <Input id="end-date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hours" className="text-right">
                      Horas
                    </Label>
                    <Input id="hours" type="number" placeholder="Duração em horas" className="col-span-3" />
                  </div>

                  {trainingType === "individual" ? (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="participant" className="text-right">
                        Participante
                      </Label>
                      <Select>
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
                  ) : (
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">Participantes</Label>
                      <div className="col-span-3 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {selectedParticipants.map((id) => {
                            const name =
                              {
                                emp001: "João Silva",
                                emp002: "Ana Oliveira",
                                emp003: "Pedro Santos",
                                emp004: "Carla Ferreira",
                                emp005: "Lucas Mendes",
                              }[id] || id

                            return (
                              <div key={id} className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1">
                                <span className="text-sm">{name}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedParticipants(selectedParticipants.filter((p) => p !== id))}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          })}
                        </div>

                        <Select
                          onValueChange={(value) => {
                            if (!selectedParticipants.includes(value)) {
                              setSelectedParticipants([...selectedParticipants, value])
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Adicionar participante" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emp001">João Silva</SelectItem>
                            <SelectItem value="emp002">Ana Oliveira</SelectItem>
                            <SelectItem value="emp003">Pedro Santos</SelectItem>
                            <SelectItem value="emp004">Carla Ferreira</SelectItem>
                            <SelectItem value="emp005">Lucas Mendes</SelectItem>
                          </SelectContent>
                        </Select>

                        <p className="text-xs text-muted-foreground">
                          As horas de treinamento serão contabilizadas para cada participante.
                        </p>
                      </div>
                    </div>
                  )}

                  {trainingSource === "external" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="institution" className="text-right">
                        Instituição
                      </Label>
                      <Input id="institution" placeholder="Nome da instituição" className="col-span-3" />
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Departamento
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="it">TI</SelectItem>
                        <SelectItem value="hr">RH</SelectItem>
                        <SelectItem value="finance">Financeiro</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operações</SelectItem>
                        <SelectItem value="management">Gerência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descrição
                    </Label>
                    <Textarea id="description" placeholder="Descrição do treinamento" className="col-span-3" />
                  </div>

                  {/* Seção de documentos */}
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Documentos</Label>
                    <div className="col-span-3 space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          id="document-upload"
                          type="file"
                          multiple
                          onChange={handleDocumentUpload}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        />
                        <Button type="button" variant="outline" size="sm">
                          <File className="h-4 w-4 mr-1" />
                          Anexar
                        </Button>
                      </div>

                      {trainingDocuments.length > 0 && (
                        <div className="border rounded-md p-3">
                          <p className="text-sm font-medium mb-2">Documentos anexados:</p>
                          <div className="space-y-2">
                            {trainingDocuments.map((doc, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm p-2 bg-secondary/20 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <File className="h-4 w-4 text-muted-foreground" />
                                  <span>{doc.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocument(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT. Tamanho máximo: 10MB por
                        arquivo.
                      </p>
                    </div>
                  </div>

                  {/* Seção de fotos */}
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Fotos</Label>
                    <div className="col-span-3 space-y-4">
                      <div className="flex items-center gap-2">
                        <Input id="photo-upload" type="file" multiple onChange={handlePhotoUpload} accept="image/*" />
                        <Button type="button" variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Anexar
                        </Button>
                      </div>

                      {photoPreviewUrls.length > 0 && (
                        <div className="border rounded-md p-3">
                          <p className="text-sm font-medium mb-2">Fotos anexadas:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {photoPreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`Foto ${index + 1}`}
                                  className="h-24 w-full object-cover rounded-md"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removePhoto(index)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Formatos suportados: JPG, JPEG, PNG, GIF. Tamanho máximo: 5MB por imagem.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button type="submit" onClick={createNewTraining}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Importar Treinamentos</DialogTitle>
                  <DialogDescription>Importe dados de treinamentos a partir de um arquivo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="file-format">Formato do Arquivo</Label>
                    <Select defaultValue="json">
                      <SelectTrigger id="file-format">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file-upload">Arquivo</Label>
                    <Input id="file-upload" type="file" accept=".json,.csv,.xlsx,.xls" onChange={importData} />
                    <p className="text-xs text-muted-foreground">
                      Formatos suportados: Excel (.xlsx, .xls), CSV (.csv), JSON (.json)
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Importar</Button>
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
                  placeholder="Buscar treinamentos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                  <SelectItem value="Habilidades Sociais">Habilidades Sociais</SelectItem>
                  <SelectItem value="Liderança">Liderança</SelectItem>
                  <SelectItem value="Conformidade">Conformidade</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Agendado">Agendado</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
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
                <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours}</div>
                <p className="text-xs text-muted-foreground">+24 em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card className="animate-scale [animation-delay:100ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalParticipants}</div>
                <p className="text-xs text-muted-foreground">+15 em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card className="animate-scale [animation-delay:200ms]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treinamentos Concluídos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTrainings}</div>
                <p className="text-xs text-muted-foreground">+2 em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Lista de Treinamentos</CardTitle>
              <CardDescription>Visualizar e gerenciar todos os treinamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                      ID
                      {sortField === "id" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                      Nome
                      {sortField === "name" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                      Categoria
                      {sortField === "category" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("instructor")}>
                      Instrutor
                      {sortField === "instructor" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("startDate")}>
                      Data de Início
                      {sortField === "startDate" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer text-center" onClick={() => handleSort("hours")}>
                      Horas
                      {sortField === "hours" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                      Status
                      {sortField === "status" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                    </TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainings.map((training) => (
                    <TableRow key={training.id} className="animate-fade">
                      <TableCell className="font-medium">{training.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{training.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {training.department === "Todos" ? "Todos os Departamentos" : training.department}
                        </div>
                      </TableCell>
                      <TableCell>{training.category}</TableCell>
                      <TableCell>{training.instructor}</TableCell>
                      <TableCell>{new Date(training.startDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">{training.hours}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            training.status === "Concluído"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : training.status === "Em Andamento"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                : training.status === "Agendado"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {training.status}
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
                            <DropdownMenuItem onClick={() => viewTrainingDetails(training.id)}>
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar treinamento
                            </DropdownMenuItem>
                            <DropdownMenuItem>Ver participantes</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Cancelar treinamento</DropdownMenuItem>
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
                Mostrando {filteredTrainings.length} de {trainings.length} treinamentos
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
            <Card>
              <CardHeader>
                <CardTitle>Horas de Treinamento por Mês</CardTitle>
                <CardDescription>Distribuição de horas de treinamento ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trainingHoursByMonth}
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
                      <Bar dataKey="horas" name="Horas" fill={MODERN_COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Treinamentos por Categoria</CardTitle>
                <CardDescription>Distribuição de treinamentos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trainingsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {trainingsByCategory.map((entry, index) => (
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
            <Card>
              <CardHeader>
                <CardTitle>Treinamentos por Departamento</CardTitle>
                <CardDescription>Distribuição de treinamentos entre departamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trainingsByDepartment}
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
                      <Bar dataKey="value" name="Treinamentos" fill={MODERN_COLORS[2]}>
                        {trainingsByDepartment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Instrutores Mais Ativos</CardTitle>
                <CardDescription>Instrutores com mais horas de treinamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Carlos Mendes", category: "Técnico", hours: 40, trainings: 2 },
                    { name: "Ana Ferreira", category: "Habilidades Sociais", hours: 24, trainings: 2 },
                    { name: "Ricardo Santos", category: "Conformidade", hours: 8, trainings: 2 },
                    { name: "Mariana Costa", category: "Liderança", hours: 32, trainings: 2 },
                    { name: "Paulo Ribeiro", category: "Técnico", hours: 16, trainings: 1 },
                  ].map((instructor, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{instructor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {instructor.category} • {instructor.trainings} treinamentos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{instructor.hours} horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Todos os Instrutores
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Funcionários com Mais Treinamentos</CardTitle>
              <CardDescription>Funcionários que participaram de mais treinamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "João Silva", department: "TI", hours: 48, trainings: 4 },
                  { name: "Maria Santos", department: "RH", hours: 36, trainings: 3 },
                  { name: "Roberto Oliveira", department: "TI", hours: 32, trainings: 3 },
                  { name: "Camila Pereira", department: "Marketing", hours: 28, trainings: 2 },
                  { name: "Miguel Costa", department: "Operações", hours: 24, trainings: 2 },
                ].map((employee, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.department} • {employee.trainings} treinamentos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{employee.hours} horas</p>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

