"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"

interface Employee {
  id: string
  name: string
  department: {
    name: string
  }
}

interface TrainingParticipantsProps {
  initialParticipants: string[]
  onParticipantsChange: (participants: string[]) => void
}

export function TrainingParticipants({ initialParticipants, onParticipantsChange }: TrainingParticipantsProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(initialParticipants)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees")
        if (!response.ok) {
          throw new Error("Erro ao carregar funcionários")
        }
        const data = await response.json()
        setEmployees(data)
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error)
      }
    }

    fetchEmployees()
  }, [])

  useEffect(() => {
    onParticipantsChange(selectedEmployees)
  }, [selectedEmployees, onParticipantsChange])

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id))
    } else {
      setSelectedEmployees([])
    }
  }

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId)
      }
      return [...prev, employeeId]
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => handleSelectAll(selectedEmployees.length !== filteredEmployees.length)}
        >
          {selectedEmployees.length === filteredEmployees.length ? "Desselecionar Todos" : "Selecionar Todos"}
        </Button>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="flex items-center space-x-2">
              <Checkbox
                id={employee.id}
                checked={selectedEmployees.includes(employee.id)}
                onCheckedChange={() => handleSelectEmployee(employee.id)}
              />
              <Label
                htmlFor={employee.id}
                className="flex flex-col cursor-pointer"
              >
                <span className="font-medium">{employee.name}</span>
                <span className="text-sm text-muted-foreground">
                  {employee.department.name}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="text-sm text-muted-foreground">
        {selectedEmployees.length} funcionário(s) selecionado(s)
      </div>
    </div>
  )
} 