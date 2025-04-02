import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Employee {
  id: string
  name: string
  matricula: string
  department: {
    id: string
    name: string
  }
}

interface TrainingParticipantsProps {
  departmentId: string
  selectedParticipants: string[]
  onParticipantsChange: (participants: string[]) => void
  type: "INDIVIDUAL" | "TEAM"
}

export function TrainingParticipants({
  departmentId,
  selectedParticipants,
  onParticipantsChange,
  type
}: TrainingParticipantsProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!departmentId) return

      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/departments/${departmentId}/employees`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar funcionários")
        }

        setEmployees(data)
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error)
        setError(error instanceof Error ? error.message : "Erro ao buscar funcionários")
        toast.error("Erro ao buscar funcionários")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [departmentId])

  const handleAddParticipant = (employeeId: string) => {
    if (type === "INDIVIDUAL") {
      onParticipantsChange([employeeId])
    } else if (!selectedParticipants.includes(employeeId)) {
      onParticipantsChange([...selectedParticipants, employeeId])
    }
  }

  const handleRemoveParticipant = (employeeId: string) => {
    onParticipantsChange(selectedParticipants.filter(id => id !== employeeId))
  }

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = searchTerm === "" || 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricula.toLowerCase().includes(searchTerm.toLowerCase())
    const notSelected = !selectedParticipants.includes(emp.id)
    return matchesSearch && notSelected
  })

  const selectedEmployees = employees.filter(emp => selectedParticipants.includes(emp.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "INDIVIDUAL" ? "Selecionar Funcionário" : "Selecionar Participantes"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar funcionário</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Digite o nome ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}

        {selectedEmployees.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedEmployees.map(employee => (
              <Badge key={employee.id} variant="secondary" className="flex items-center gap-1">
                {employee.name} - {employee.matricula}
                <button
                  onClick={() => handleRemoveParticipant(employee.id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="grid gap-2">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              {searchTerm ? "Nenhum funcionário encontrado" : "Nenhum funcionário disponível"}
            </div>
          ) : (
            filteredEmployees.map(employee => (
              <Button
                key={employee.id}
                variant="outline"
                className="justify-start"
                onClick={() => handleAddParticipant(employee.id)}
                disabled={loading || (type === "INDIVIDUAL" && selectedParticipants.length > 0)}
              >
                {employee.name} - {employee.matricula}
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 