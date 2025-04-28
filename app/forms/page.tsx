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

  const fetchData = async () => {
      try {
        console.log("Iniciando busca de dados...")
      const [employeesRes, departmentsRes, positionsRes, positionLevelsRes, shiftsRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/departments"),
        fetch("/api/positions"),
        fetch("/api/position-levels"),
        fetch("/api/shifts")
      ])

      const employeesData = await employeesRes.json()
      const departmentsData = await departmentsRes.json()
      const positionsData = await positionsRes.json()
      const positionLevelsData = await positionLevelsRes.json()
      const shiftsData = await shiftsRes.json()

      // Processar as datas dos funcionários
      const processedEmployees = employeesData.map((emp: any) => {
        try {
          return {
            ...emp,
            hireDate: emp.hireDate ? new Date(emp.hireDate).toISOString() : null,
            terminationDate: emp.terminationDate ? new Date(emp.terminationDate).toISOString() : null,
            birthDate: emp.birthDate ? new Date(emp.birthDate).toISOString() : null
          }
        } catch (error) {
          console.error(`Erro ao processar datas do funcionário ${emp.name}:`, error)
          return {
            ...emp,
            hireDate: null,
            terminationDate: null,
            birthDate: null
          }
        }
      })

      console.log("Funcionários encontrados:", processedEmployees.length)
      console.log("Detalhes dos funcionários:", processedEmployees.map((emp: any) => ({
        id: emp.id,
        name: emp.name,
        hireDate: emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : "Data inválida",
        terminationDate: emp.terminationDate ? new Date(emp.terminationDate).toLocaleDateString() : null,
        department: emp.department?.name,
        position: emp.position?.title,
        positionLevel: emp.positionlevel?.name,
        shift: emp.shift?.name
      })))
        console.log("Departamentos encontrados:", departmentsData.length)
      console.log("Cargos encontrados:", positionsData.length)
      console.log("Níveis de cargo encontrados:", positionLevelsData.length)
      console.log("Turnos encontrados:", shiftsData.length)

      setEmployees(processedEmployees)
        setDepartments(departmentsData)
        setPositions(positionsData)
        setPositionLevels(positionLevelsData)
        setShifts(shiftsData)
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro",
        description: "Erro ao buscar dados. Por favor, tente novamente.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchData()
  }, [])

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
                onSuccess={fetchData}
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