"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Download, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PieChart, BarChart } from "@/components/ui/chart"

// Dados simulados de funcionários
const employees = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `Funcionário ${i + 1}`,
  department: ["TI", "RH", "Vendas", "Marketing", "Financeiro"][i % 5],
  position: ["Analista", "Gerente", "Coordenador", "Diretor", "Assistente"][i % 5],
  status: ["Ativo", "Inativo", "Afastado"][i % 3],
  performance: (3 + Math.random() * 2).toFixed(1),
  hireDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toLocaleDateString("pt-BR"),
}))

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState(employees)
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Função para filtrar funcionários
  const filterEmployees = () => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }

  // Atualiza os funcionários filtrados quando os filtros mudam
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setFilteredEmployees(filterEmployees())
  }

  const handleDepartmentFilter = (value: string) => {
    setDepartmentFilter(value)
    setFilteredEmployees(filterEmployees())
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setFilteredEmployees(filterEmployees())
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize informações sobre todos os funcionários da empresa.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar funcionários..."
              className="pl-8 sm:w-[300px] lg:w-[400px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="flex flex-col gap-2 p-2">
                <p className="text-sm font-medium">Departamento</p>
                <Select value={departmentFilter} onValueChange={handleDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os departamentos</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm font-medium">Status</p>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Afastado">Afastado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Mais filtros</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Funcionário
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="grid">Grade</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle>Todos os Funcionários</CardTitle>
              <CardDescription>Total de {filteredEmployees.length} funcionários encontrados.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Desempenho</TableHead>
                      <TableHead>Data de Contratação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.slice(0, 10).map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              employee.status === "Ativo"
                                ? "default"
                                : employee.status === "Inativo"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              Number.parseFloat(employee.performance) >= 4.5
                                ? "text-green-500"
                                : Number.parseFloat(employee.performance) >= 3.5
                                  ? "text-blue-500"
                                  : "text-yellow-500"
                            }
                          >
                            {employee.performance}
                          </span>
                        </TableCell>
                        <TableCell>{employee.hireDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Abrir menu</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a href={`/employees/${employee.id}`}>Ver detalhes</a>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Avaliar</DropdownMenuItem>
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
        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEmployees.slice(0, 12).map((employee) => (
              <Card key={employee.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <a href={`/employees/${employee.id}`} className="hover:underline">
                      {employee.name}
                    </a>
                  </CardTitle>
                  <CardDescription>{employee.position}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Departamento:</span>
                      <span className="text-sm font-medium">{employee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          employee.status === "Ativo"
                            ? "default"
                            : employee.status === "Inativo"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Desempenho:</span>
                      <span
                        className={
                          Number.parseFloat(employee.performance) >= 4.5
                            ? "text-green-500"
                            : Number.parseFloat(employee.performance) >= 3.5
                              ? "text-blue-500"
                              : "text-yellow-500"
                        }
                      >
                        {employee.performance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Contratação:</span>
                      <span className="text-sm">{employee.hireDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "TI", value: employees.filter((e) => e.department === "TI").length },
                    { name: "RH", value: employees.filter((e) => e.department === "RH").length },
                    { name: "Vendas", value: employees.filter((e) => e.department === "Vendas").length },
                    { name: "Marketing", value: employees.filter((e) => e.department === "Marketing").length },
                    { name: "Financeiro", value: employees.filter((e) => e.department === "Financeiro").length },
                  ]}
                  index="name"
                  category="value"
                  colors={["blue", "green", "yellow", "purple", "red"]}
                  className="aspect-[4/3]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Ativo", value: employees.filter((e) => e.status === "Ativo").length },
                    { name: "Inativo", value: employees.filter((e) => e.status === "Inativo").length },
                    { name: "Afastado", value: employees.filter((e) => e.status === "Afastado").length },
                  ]}
                  index="name"
                  category="value"
                  colors={["green", "blue", "red"]}
                  className="aspect-[4/3]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Desempenho Médio por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "TI", value: 4.2 },
                    { name: "RH", value: 3.9 },
                    { name: "Vendas", value: 4.5 },
                    { name: "Marketing", value: 4.1 },
                    { name: "Financeiro", value: 4.0 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => value.toFixed(1)}
                  className="aspect-[4/3]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

