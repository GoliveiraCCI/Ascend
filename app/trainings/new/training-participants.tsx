"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Search, CheckSquare, X, XSquare } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Employee {
  id: string
  name: string
  matricula: string
  department: string
}

interface TrainingParticipantsProps {
  selectedParticipants: string[]
  onParticipantsChange: (participants: string[]) => void
}

export function TrainingParticipants({ selectedParticipants, onParticipantsChange }: TrainingParticipantsProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    console.log("TrainingParticipants - fetchEmployees - Iniciando busca de funcionários")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/employees")
      
      if (!response.ok) {
        throw new Error("Erro ao buscar funcionários")
      }

      const data = await response.json()
      console.log("TrainingParticipants - fetchEmployees - Funcionários encontrados:", data)
      
      // Garantir que os dados estejam no formato correto
      const formattedData = data.map((emp: any) => ({
        id: String(emp.id),
        name: String(emp.name || ""),
        department: String(emp.department?.name || ""),
        matricula: String(emp.matricula || "")
      }))
      
      setEmployees(formattedData)
    } catch (error) {
      console.error("TrainingParticipants - fetchEmployees - Erro:", error)
      setError("Erro ao buscar funcionários")
      toast.error("Erro ao buscar funcionários")
    } finally {
      setLoading(false)
    }
  }

  // Garantir que os departamentos sejam strings únicas e válidas
  const departments = Array.from(
    new Set(
      employees
        .map(emp => String(emp.department || ""))
        .filter(dept => dept.trim() !== "")
    )
  ).sort()

  const selectedEmployees = employees.filter(emp => selectedParticipants.includes(emp.id))
  const availableEmployees = employees.filter(emp => !selectedParticipants.includes(emp.id))

  const filteredEmployees = availableEmployees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "all" || !selectedDepartment || employee.department === selectedDepartment

    return matchesSearch && matchesDepartment
  })

  const handleParticipantToggle = (employeeId: string) => {
    if (selectedParticipants.includes(employeeId)) {
      onParticipantsChange(selectedParticipants.filter(id => id !== employeeId))
    } else {
      onParticipantsChange([...selectedParticipants, employeeId])
    }
  }

  const handleSelectAll = () => {
    const filteredIds = filteredEmployees.map(emp => emp.id)
    onParticipantsChange([...new Set([...selectedParticipants, ...filteredIds])])
  }

  const handleClearAll = () => {
    onParticipantsChange([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Participantes do Treinamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Seção de Funcionários Selecionados */}
          {selectedEmployees.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Funcionários Selecionados ({selectedEmployees.length})</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedEmployees.map((employee) => (
                  <Badge
                    key={`selected-${employee.id}`}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 px-2 bg-black text-white hover:bg-black/90"
                  >
                    <span>{employee.name} - {employee.matricula}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleParticipantToggle(employee.id)}
                      className="h-4 w-4 p-0 hover:bg-transparent text-white hover:text-white/80"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Seção de Busca e Seleção */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, matrícula ou departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={`dept-${dept}`} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={fetchEmployees}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Atualizar"
                )}
              </Button>
            </div>

            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}

            {filteredEmployees.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  Selecionar Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center gap-2"
                >
                  <XSquare className="h-4 w-4" />
                  Limpar Seleção
                </Button>
              </div>
            )}

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-2">
                {filteredEmployees.map((employee) => (
                  <div
                    key={`employee-${employee.id}`}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                      selectedParticipants.includes(employee.id)
                        ? "bg-black text-white"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleParticipantToggle(employee.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-sm opacity-80">
                        {employee.matricula} - {employee.department}
                      </span>
                    </div>
                    {selectedParticipants.includes(employee.id) && (
                      <X className="h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 