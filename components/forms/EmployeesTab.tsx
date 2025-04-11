"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, MoreHorizontal, SlidersHorizontal, Pencil, History, Trash, Stethoscope, FileText, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import type { Department, Position, PositionLevel, Shift, Employee } from "@prisma/client"
import { EmployeeEditForm } from "./EmployeeEditForm"
import { MedicalLeavesDialog } from "./MedicalLeavesDialog"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface EmployeeHistory {
  id: string
  employeeId: string
  positionLevel?: {
    id: string
    name: string
    salary: number
    position: {
      id: string
      title: string
    }
  }
  department?: {
    id: string
    name: string
  }
  shift?: {
    id: string
    name: string
  }
  startDate: string
  endDate?: string
}

interface EmployeeStats {
  hires: number[]
  terminations: number[]
  labels: string[]
}

interface EmployeeWithRelations extends Employee {
  department: { id: string; name: string }
  position: { id: string; title: string }
  positionlevel?: { id: string; name: string }
  shift?: { id: string; name: string }
  history?: EmployeeHistory[]
  medicalLeaves?: {
    id: string
    startDate: string
    endDate?: string
    type: string
    status: string
  }[]
  status?: "ATIVO" | "INATIVO" | "AFASTADO"
}

// Constantes para status e cores
const EMPLOYEE_STATUS = {
  ATIVO: {
    label: "Ativo",
    variant: "default" as const,
    className: "bg-green-500 hover:bg-green-600"
  },
  INATIVO: {
    label: "Inativo",
    variant: "secondary" as const,
    className: "bg-black text-white hover:bg-black/90"
  },
  AFASTADO: {
    label: "Afastado",
    variant: "destructive" as const,
    className: "bg-red-500 text-white hover:bg-red-600"
  }
} as const

interface EmployeesTabProps {
  employees: EmployeeWithRelations[]
  departments: Department[]
  positions: Position[]
  positionLevels: PositionLevel[]
  shifts: Shift[]
}

export function EmployeesTab({
  employees = [],
  departments = [],
  positions = [],
  positionLevels = [],
  shifts = []
}: EmployeesTabProps) {
  console.log("=== EmployeesTab montado ===")
  console.log("Props recebidas:", {
    totalEmployees: employees.length,
    totalDepartments: departments.length,
    totalPositions: positions.length,
    totalPositionLevels: positionLevels.length,
    totalShifts: shifts.length
  })

  if (employees.length > 0) {
    const firstEmployee = employees[0]
    console.log("Detalhes do primeiro funcionário:", {
      id: firstEmployee.id,
      name: firstEmployee.name,
      matricula: firstEmployee.matricula,
      department: firstEmployee.department?.name,
      position: firstEmployee.position?.title,
      positionLevel: firstEmployee.positionlevel?.name,
      shift: firstEmployee.shift?.name,
      active: firstEmployee.active
    })
  }

  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState<{ start: Date; end: Date } | null>(null)
  const [selectedMovementType, setSelectedMovementType] = useState<"hires" | "terminations" | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithRelations | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isMedicalLeavesDialogOpen, setIsMedicalLeavesDialogOpen] = useState(false)

  useEffect(() => {
    console.log("EmployeesTab montado com:", {
      totalEmployees: employees?.length || 0,
      totalDepartments: departments?.length || 0,
      totalPositions: positions?.length || 0,
      totalPositionLevels: positionLevels?.length || 0,
      totalShifts: shifts?.length || 0
    })

    if (employees?.length > 0) {
      const firstEmployee = employees[0]
      console.log("Exemplo do primeiro funcionário:", {
        id: firstEmployee.id,
        name: firstEmployee.name,
        matricula: firstEmployee.matricula,
        department: firstEmployee.department,
        position: firstEmployee.position,
        positionLevel: firstEmployee.positionlevel,
        shift: firstEmployee.shift,
        historyCount: firstEmployee.history?.length || 0
      })
    }
  }, [employees, departments, positions, positionLevels, shifts])

  const getEmployeeStatus = (employee: EmployeeWithRelations) => {
    // Primeiro verifica se tem data de demissão
    if (employee.terminationDate && new Date(employee.terminationDate) <= new Date()) {
      return EMPLOYEE_STATUS.INATIVO
    }

    // Depois verifica se tem atestado médico ativo
    const today = new Date()
    const hasActiveMedicalLeave = employee.medicalLeaves?.some(leave => {
      const startDate = new Date(leave.startDate)
      const endDate = leave.endDate ? new Date(leave.endDate) : null
      return startDate <= today && (!endDate || endDate >= today)
    })

    if (hasActiveMedicalLeave) {
      return EMPLOYEE_STATUS.AFASTADO
    }

    // Se não tiver data de demissão nem atestado ativo, está ativo
    return EMPLOYEE_STATUS.ATIVO
  }

  const filteredEmployees = useMemo(() => {
    console.log("Filtrando funcionários...")
    console.log("Total antes da filtragem:", employees.length)
    
    const filtered = employees.filter((employee) => {
      // Filtro por texto de busca em todas as colunas
      const searchTermLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm || 
        (employee.matricula?.toLowerCase() || "").includes(searchTermLower) ||
        (employee.name?.toLowerCase() || "").includes(searchTermLower) ||
        (employee.email?.toLowerCase() || "").includes(searchTermLower) ||
        (employee.cpf || "").includes(searchTerm) ||
        (employee.phone || "").includes(searchTerm) ||
        (employee.department?.name?.toLowerCase() || "").includes(searchTermLower) ||
        (employee.position?.title?.toLowerCase() || "").includes(searchTermLower) ||
        (employee.positionlevel?.name?.toLowerCase() || "").includes(searchTermLower) ||
        (employee.shift?.name?.toLowerCase() || "").includes(searchTermLower) ||
        (getEmployeeStatus(employee).label.toLowerCase() || "").includes(searchTermLower)

      // Filtro por mês selecionado
      const matchesMonth = !selectedMonth || (
        (new Date(employee.hireDate) >= selectedMonth.start && new Date(employee.hireDate) <= selectedMonth.end) ||
        (employee.terminationDate && new Date(employee.terminationDate) >= selectedMonth.start && new Date(employee.terminationDate) <= selectedMonth.end)
      )

      // Filtro por tipo de movimento
      const matchesMovementType = !selectedMovementType || (
        selectedMovementType === "hires" && new Date(employee.hireDate) >= selectedMonth!.start && new Date(employee.hireDate) <= selectedMonth!.end
      ) || (
        selectedMovementType === "terminations" && employee.terminationDate && new Date(employee.terminationDate) >= selectedMonth!.start && new Date(employee.terminationDate) <= selectedMonth!.end
      )
      
      return matchesSearch && matchesMonth && matchesMovementType
    })

    console.log("Total após filtragem:", filtered.length)
    return filtered
  }, [employees, searchTerm, selectedMonth, selectedMovementType])

  const totalActive = useMemo(() => {
    return filteredEmployees.filter(e => !e.terminationDate).length
  }, [filteredEmployees])

  const calculateStats = useMemo(() => {
    const stats: EmployeeStats = {
      hires: Array(12).fill(0),
      terminations: Array(12).fill(0),
      labels: Array(12).fill(""),
    }

    const today = new Date()
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      return {
        start: date,
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        label: `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`,
      }
    }).reverse()

    months.forEach((month, index) => {
      stats.labels[index] = month.label
      stats.hires[index] = employees.filter((emp) => {
        const hireDate = new Date(emp.hireDate)
        return hireDate >= month.start && hireDate <= month.end
      }).length

      stats.terminations[index] = employees.filter((emp) => {
        const terminationDate = emp.terminationDate ? new Date(emp.terminationDate) : null
        return terminationDate && terminationDate >= month.start && terminationDate <= month.end
      }).length
    })

    return { stats, months }
  }, [employees])

  const handleChartClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const element = elements[0]
      const index = element.index
      const datasetIndex = element.datasetIndex
      const month = calculateStats.months[index]
      
      setSelectedMonth(month)
      setSelectedMovementType(datasetIndex === 0 ? "hires" : "terminations")
    } else {
      setSelectedMonth(null)
      setSelectedMovementType(null)
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 20,
          padding: 20,
          color: 'rgb(0, 0, 0)',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Contratações e Desligamentos',
        font: {
          size: 14
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const chartData = {
    labels: calculateStats.stats.labels,
    datasets: [
      {
        label: "Contratações",
        data: calculateStats.stats.hires,
        backgroundColor: "rgb(59, 130, 246)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Desligamentos",
        data: calculateStats.stats.terminations,
        backgroundColor: "rgb(147, 51, 234)",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
      },
    ],
  }

  const handleEditEmployee = (employee: EmployeeWithRelations) => {
    console.log("Dados do funcionário selecionado:", {
      id: employee.id,
      name: employee.name,
      matricula: employee.matricula,
      email: employee.email,
      cpf: employee.cpf,
      birthDate: employee.birthDate,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate,
      departmentId: employee.departmentId,
      positionId: employee.positionId,
      positionLevelId: employee.positionlevel?.id || "",
      shiftId: employee.shiftId,
      phone: employee.phone,
      address: employee.address,
      department: employee.department,
      position: employee.position,
      positionLevel: employee.positionlevel,
      shift: employee.shift
    })
    setSelectedEmployee(employee)
    setIsEditDialogOpen(true)
  }

  const handleViewMedicalLeaves = (employee: EmployeeWithRelations) => {
    setSelectedEmployee(employee)
    setIsMedicalLeavesDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar em todas as colunas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-[300px] lg:w-[400px]"
          />
        </div>

        <Button onClick={() => setIsEditDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Funcionário
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionários Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length - totalActive}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contratações e Desligamentos</CardTitle>
            {(selectedMonth || selectedMovementType) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Filtrado por: {selectedMonth?.start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })} - {selectedMovementType === "hires" ? "Contratações" : "Desligamentos"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMonth(null)
                    setSelectedMovementType(null)
                  }}
                  className="h-8 px-2"
                >
                  Limpar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matrícula</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.matricula}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.shift?.name || "-"}</TableCell>
                <TableCell>{employee.department.name}</TableCell>
                <TableCell>{employee.position?.title || "-"}</TableCell>
                <TableCell>
                  <Badge 
                    variant={getEmployeeStatus(employee).variant}
                    className={getEmployeeStatus(employee).className}
                  >
                    {getEmployeeStatus(employee).label}
                  </Badge>
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
                      <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewMedicalLeaves(employee)}>
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Atestados
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EmployeeEditForm
        employee={selectedEmployee ? {
          id: selectedEmployee.id,
          matricula: selectedEmployee.matricula,
          name: selectedEmployee.name,
          email: selectedEmployee.email,
          cpf: selectedEmployee.cpf,
          birthDate: selectedEmployee.birthDate 
            ? (selectedEmployee.birthDate instanceof Date 
                ? selectedEmployee.birthDate.toISOString().split('T')[0]
                : new Date(selectedEmployee.birthDate).toISOString().split('T')[0])
            : '',
          hireDate: selectedEmployee.hireDate
            ? (selectedEmployee.hireDate instanceof Date
                ? selectedEmployee.hireDate.toISOString().split('T')[0]
                : new Date(selectedEmployee.hireDate).toISOString().split('T')[0])
            : '',
          terminationDate: selectedEmployee.terminationDate
            ? (selectedEmployee.terminationDate instanceof Date
                ? selectedEmployee.terminationDate.toISOString().split('T')[0]
                : new Date(selectedEmployee.terminationDate).toISOString().split('T')[0])
            : '',
          departmentId: selectedEmployee.department?.id || "",
          positionId: selectedEmployee.position?.id || "",
          positionLevelId: selectedEmployee.positionlevel?.id || "",
          shiftId: selectedEmployee.shift?.id || "",
          phone: selectedEmployee.phone || undefined,
          address: selectedEmployee.address || undefined,
        } : undefined}
        departments={departments}
        positions={positions}
        positionLevels={positionLevels}
        shifts={shifts}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedEmployee(null)
        }}
        onSuccess={() => {
          setIsEditDialogOpen(false)
          setSelectedEmployee(null)
        }}
      />

      <MedicalLeavesDialog
        employeeId={selectedEmployee?.id || ""}
        isOpen={isMedicalLeavesDialogOpen}
        onClose={() => setIsMedicalLeavesDialogOpen(false)}
      />
    </div>
  )
} 