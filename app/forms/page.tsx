"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { EmployeesTab } from "@/components/forms/EmployeesTab"
import DepartmentsTab from "@/components/forms/DepartmentsTab"
import PositionsTab from "@/components/forms/PositionsTab"
import ShiftsTab from "@/components/forms/ShiftsTab"
import type { Department, Position, PositionLevel, Shift, Employee } from "@prisma/client"

interface EmployeeWithRelations extends Employee {
  department: { id: string; name: string }
  position: { id: string; title: string }
  positionLevel?: { id: string; name: string }
  shift?: { id: string; name: string }
  status?: string
}

export default function FormsPage() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<EmployeeWithRelations[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [positionLevels, setPositionLevels] = useState<PositionLevel[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Iniciando busca de dados...")
        
        // Buscar funcionários
        const employeesResponse = await fetch("/api/employees")
        if (!employeesResponse.ok) {
          const errorData = await employeesResponse.json()
          console.error("Erro na resposta da API:", errorData)
          throw new Error(errorData.details || "Erro ao buscar funcionários")
        }
        const employeesData = await employeesResponse.json()
        console.log("Funcionários encontrados:", employeesData.length)
        setEmployees(employeesData)

        // Buscar departamentos
        const departmentsResponse = await fetch("/api/departments")
        if (!departmentsResponse.ok) throw new Error("Erro ao buscar departamentos")
        const departmentsData = await departmentsResponse.json()
        console.log("Departamentos encontrados:", departmentsData.length)
        setDepartments(departmentsData)

        // Buscar cargos
        const positionsResponse = await fetch("/api/positions")
        if (!positionsResponse.ok) throw new Error("Erro ao buscar cargos")
        const positionsData = await positionsResponse.json()
        console.log("Cargos encontrados:", positionsData.length)
        setPositions(positionsData)

        // Buscar níveis de cargo
        const positionLevelsResponse = await fetch("/api/position-levels")
        if (!positionLevelsResponse.ok) throw new Error("Erro ao buscar níveis de cargo")
        const positionLevelsData = await positionLevelsResponse.json()
        console.log("Níveis de cargo encontrados:", positionLevelsData.length)
        setPositionLevels(positionLevelsData)

        // Buscar turnos
        const shiftsResponse = await fetch("/api/shifts")
        if (!shiftsResponse.ok) throw new Error("Erro ao buscar turnos")
        const shiftsData = await shiftsResponse.json()
        console.log("Turnos encontrados:", shiftsData.length)
        setShifts(shiftsData)

        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os dados.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Formulários</h1>
        <Tabs defaultValue="employees">
          <TabsList>
            <TabsTrigger value="employees">Funcionários</TabsTrigger>
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="positions">Cargos</TabsTrigger>
            <TabsTrigger value="shifts">Turnos</TabsTrigger>
          </TabsList>
          <TabsContent value="employees">
            <Card className="p-6">
              <EmployeesTab
                employees={employees}
                departments={departments}
                positions={positions}
                positionLevels={positionLevels}
                shifts={shifts}
              />
            </Card>
          </TabsContent>
          <TabsContent value="departments">
            <Card className="p-6">
              <DepartmentsTab />
            </Card>
          </TabsContent>
          <TabsContent value="positions">
            <Card className="p-6">
              <PositionsTab />
            </Card>
          </TabsContent>
          <TabsContent value="shifts">
            <Card className="p-6">
              <ShiftsTab />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 