"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, BarChart3, FileSpreadsheet, Filter, MoreHorizontal, Plus, Search, Users, Building2 } from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Department {
  id: string
  code: string
  name: string
  description: string | null
}

// Sample department data
const departments = [
  {
    id: "DEPT001",
    name: "Information Technology",
    code: "IT",
    manager: "Sarah Johnson",
    employees: 78,
    avgPerformance: 8.5,
    trainingHours: 450,
    medicalLeaveDays: 18,
  },
  {
    id: "DEPT002",
    name: "Human Resources",
    code: "HR",
    manager: "Michael Brown",
    employees: 24,
    avgPerformance: 7.9,
    trainingHours: 280,
    medicalLeaveDays: 12,
  },
  {
    id: "DEPT003",
    name: "Finance",
    code: "FIN",
    manager: "Jennifer Wilson",
    employees: 36,
    avgPerformance: 8.2,
    trainingHours: 320,
    medicalLeaveDays: 15,
  },
  {
    id: "DEPT004",
    name: "Marketing",
    code: "MKT",
    manager: "David Miller",
    employees: 42,
    avgPerformance: 7.8,
    trainingHours: 380,
    medicalLeaveDays: 10,
  },
  {
    id: "DEPT005",
    name: "Operations",
    code: "OPS",
    manager: "Robert Johnson",
    employees: 65,
    avgPerformance: 8.1,
    trainingHours: 420,
    medicalLeaveDays: 22,
  },
]

// Chart data
const employeeDistribution = departments.map((dept) => ({
  name: dept.code,
  value: dept.employees,
}))

const performanceByDepartment = departments.map((dept) => ({
  name: dept.code,
  value: dept.avgPerformance * 10, // Scale to 0-100 for better visualization
}))

const trainingHoursByDepartment = departments.map((dept) => ({
  name: dept.code,
  value: dept.trainingHours,
}))

const medicalLeaveByDepartment = departments.map((dept) => ({
  name: dept.code,
  value: dept.medicalLeaveDays,
}))

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function DepartmentsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments")
      if (!response.ok) throw new Error("Erro ao buscar departamentos")
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar departamentos",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar departamento")
      }

      await fetchDepartments()
      setCreateDialogOpen(false)
      setFormData({ code: "", name: "", description: "" })
      toast({
        title: "Sucesso",
        description: "Departamento criado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao criar departamento:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar departamento",
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedDepartment) return

    try {
      const response = await fetch(`/api/departments/${selectedDepartment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao atualizar departamento")
      }

      await fetchDepartments()
      setEditDialogOpen(false)
      setSelectedDepartment(null)
      setFormData({ code: "", name: "", description: "" })
      toast({
        title: "Sucesso",
        description: "Departamento atualizado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao atualizar departamento:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar departamento",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedDepartment) return

    try {
      const response = await fetch(`/api/departments/${selectedDepartment.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao excluir departamento")
      }

      await fetchDepartments()
      setDeleteDialogOpen(false)
      setSelectedDepartment(null)
      toast({
        title: "Sucesso",
        description: "Departamento excluído com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir departamento:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir departamento",
      })
    }
  }

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Departamentos</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Departamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Departamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Setor</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Criar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar departamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum departamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.code}</TableCell>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDepartment(department)
                            setFormData({
                              code: department.code,
                              name: department.name,
                              description: department.description || "",
                            })
                            setEditDialogOpen(true)
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDepartment(department)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Departamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código do Setor</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <Button onClick={handleEdit} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Departamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

