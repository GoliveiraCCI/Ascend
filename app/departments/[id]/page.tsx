"use client"

import { useState } from "react"
import { ArrowLeft, BarChart3, Download, FileSpreadsheet, LineChart, Mail, Phone, User, Users } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados de exemplo do departamento
const department = {
  id: "DEPT001",
  name: "Tecnologia da Informação",
  code: "TI",
  manager: "Sarah Johnson",
  managerEmail: "sarah.johnson@exemplo.com",
  managerPhone: "+55 (11) 98765-4321",
  employees: 78,
  avgPerformance: 8.5,
  trainingHours: 450,
  medicalLeaveDays: 18,
  budget: "R$ 1.250.000",
  location: "São Paulo - 4º andar",
  description:
    "Departamento responsável pelo desenvolvimento e manutenção de sistemas, infraestrutura de TI e suporte técnico para toda a empresa.",
}

// Dados para gráficos
const performanceTrend = [
  { month: "Jan", value: 8.2 },
  { month: "Fev", value: 8.3 },
  { month: "Mar", value: 8.4 },
  { month: "Abr", value: 8.3 },
  { month: "Mai", value: 8.5 },
  { month: "Jun", value: 8.6 },
  { month: "Jul", value: 8.7 },
  { month: "Ago", value: 8.5 },
  { month: "Set", value: 8.6 },
  { month: "Out", value: 8.7 },
  { month: "Nov", value: 8.8 },
  { month: "Dez", value: 8.9 },
]

const skillsDistribution = [
  { name: "Desenvolvimento", value: 35 },
  { name: "Infraestrutura", value: 25 },
  { name: "Suporte", value: 20 },
  { name: "Segurança", value: 15 },
  { name: "Gestão de Projetos", value: 5 },
]

const trainingHoursTrend = [
  { month: "Jan", value: 35 },
  { month: "Fev", value: 42 },
  { month: "Mar", value: 38 },
  { month: "Abr", value: 30 },
  { month: "Mai", value: 45 },
  { month: "Jun", value: 50 },
  { month: "Jul", value: 35 },
  { month: "Ago", value: 40 },
  { month: "Set", value: 45 },
  { month: "Out", value: 38 },
  { month: "Nov", value: 42 },
  { month: "Dez", value: 40 },
]

const medicalLeavesTrend = [
  { month: "Jan", value: 2 },
  { month: "Fev", value: 1 },
  { month: "Mar", value: 3 },
  { month: "Abr", value: 2 },
  { month: "Mai", value: 1 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 2 },
  { month: "Ago", value: 1 },
  { month: "Set", value: 2 },
  { month: "Out", value: 1 },
  { month: "Nov", value: 1 },
  { month: "Dez", value: 2 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]
const MODERN_COLORS = [
  "#4318FF",
  "#6AD2FF",
  "#74E09A",
  "#FFC154",
  "#FF6347",
  "#A020F0",
  "#ADD8E6",
  "#E0FFFF",
  "#008000",
  "#FFD700",
]

export default function DepartmentDetailsPage({ params }: { params: { id: string } }) {
  const [timeRange, setTimeRange] = useState("year")

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/departments">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </a>
          </Button>
          <h1 className="font-heading text-3xl">{department.name}</h1>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {department.code}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
              <SelectItem value="all">Todo o Período</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Departamento</CardTitle>
            <CardDescription>Detalhes e estatísticas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                <BarChart3 className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{department.name}</h2>
                <p className="text-sm text-muted-foreground">Código: {department.code}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Gerente:</span>
                <span className="text-sm">{department.manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm break-all">{department.managerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Telefone:</span>
                <span className="text-sm">{department.managerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Funcionários:</span>
                <span className="text-sm">{department.employees}</span>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Desempenho Médio:</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                  {department.avgPerformance.toFixed(1)}/10
                </span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Descrição</h3>
              <p className="text-sm text-muted-foreground">{department.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho do Departamento</CardTitle>
            <CardDescription>Pontuação média de desempenho ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={performanceTrend}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[7, 10]} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Pontuação" stroke="#8884d8" activeDot={{ r: 8 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver Análise Detalhada de Desempenho
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:w-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="training">Treinamentos</TabsTrigger>
          <TabsTrigger value="attendance">Presença</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="animate-fade">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{department.employees}</div>
                <p className="text-xs text-muted-foreground">+5 em relação ao trimestre anterior</p>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horas de Treinamento</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{department.trainingHours}</div>
                <p className="text-xs text-muted-foreground">+50 em relação ao trimestre anterior</p>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dias de Atestado</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{department.medicalLeaveDays}</div>
                <p className="text-xs text-muted-foreground">-2 em relação ao trimestre anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Habilidades</CardTitle>
                <CardDescription>Distribuição de funcionários por área de especialização</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillsDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {skillsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Métricas-Chave</CardTitle>
                <CardDescription>Indicadores de desempenho do departamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Orçamento Anual",
                      value: department.budget,
                      change: "+8%",
                      positive: true,
                    },
                    {
                      title: "Projetos Concluídos",
                      value: "24",
                      change: "+5",
                      positive: true,
                    },
                    {
                      title: "Taxa de Retenção",
                      value: "94%",
                      change: "+2%",
                      positive: true,
                    },
                    {
                      title: "Satisfação dos Clientes",
                      value: "4.8/5",
                      change: "+0.3",
                      positive: true,
                    },
                    {
                      title: "Tempo Médio de Resposta",
                      value: "2.5h",
                      change: "-0.5h",
                      positive: true,
                    },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{metric.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{metric.value}</p>
                        <p className={`text-xs ${metric.positive ? "text-green-500" : "text-red-500"}`}>
                          {metric.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Relatório Completo
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="employees" className="animate-fade">
          <Card>
            <CardHeader>
              <CardTitle>Funcionários do Departamento</CardTitle>
              <CardDescription>Lista de funcionários e suas informações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "João Silva",
                    position: "Desenvolvedor Sênior",
                    performance: 9.2,
                    joinDate: "15/05/2020",
                  },
                  {
                    name: "Maria Santos",
                    position: "Gerente de Projetos",
                    performance: 9.0,
                    joinDate: "10/02/2019",
                  },
                  {
                    name: "Roberto Oliveira",
                    position: "Analista de Sistemas",
                    performance: 8.7,
                    joinDate: "22/08/2021",
                  },
                  {
                    name: "Camila Pereira",
                    position: "Desenvolvedora Frontend",
                    performance: 8.5,
                    joinDate: "05/01/2022",
                  },
                  {
                    name: "Lucas Mendes",
                    position: "Administrador de Redes",
                    performance: 8.8,
                    joinDate: "18/03/2020",
                  },
                  {
                    name: "Ana Ferreira",
                    position: "Analista de QA",
                    performance: 8.6,
                    joinDate: "30/09/2021",
                  },
                  {
                    name: "Pedro Costa",
                    position: "Desenvolvedor Backend",
                    performance: 8.9,
                    joinDate: "14/06/2021",
                  },
                  {
                    name: "Juliana Martins",
                    position: "Designer UX/UI",
                    performance: 8.4,
                    joinDate: "22/11/2022",
                  },
                ].map((employee, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {employee.position} • Desde {employee.joinDate}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-4 sm:mt-0">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          employee.performance >= 9.0
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : employee.performance >= 8.0
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }`}
                      >
                        {employee.performance.toFixed(1)}/10
                      </span>
                      <Button variant="ghost" size="sm">
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between">
              <div className="text-sm text-muted-foreground mb-2 sm:mb-0">Mostrando 8 de 78 funcionários</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Ver Todos
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Lista
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Cargo</CardTitle>
                <CardDescription>Número de funcionários por cargo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Desenvolvedores", value: 35 },
                        { name: "Analistas", value: 15 },
                        { name: "Gerentes", value: 8 },
                        { name: "Designers", value: 10 },
                        { name: "Administradores", value: 10 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="value" name="Funcionários" fill="#8884d8">
                        {skillsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Funcionários</CardTitle>
                <CardDescription>Métricas-chave sobre os funcionários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Tempo Médio na Empresa",
                      value: "2.8 anos",
                      change: "+0.3",
                      positive: true,
                    },
                    {
                      title: "Taxa de Promoção",
                      value: "18%",
                      change: "+5%",
                      positive: true,
                    },
                    {
                      title: "Rotatividade Anual",
                      value: "7%",
                      change: "-2%",
                      positive: true,
                    },
                    {
                      title: "Satisfação dos Funcionários",
                      value: "4.2/5",
                      change: "+0.3",
                      positive: true,
                    },
                    {
                      title: "Novas Contratações (Ano)",
                      value: "15",
                      change: "+5",
                      positive: true,
                    },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{metric.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{metric.value}</p>
                        <p className={`text-xs ${metric.positive ? "text-green-500" : "text-red-500"}`}>
                          {metric.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Relatório Completo
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="training" className="animate-fade">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Horas de Treinamento</CardTitle>
                <CardDescription>Horas de treinamento ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={trainingHoursTrend}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Horas" stroke="#00C49F" activeDot={{ r: 8 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between">
                <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
                  Total: 450 horas • Média Mensal: 37.5 horas
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Treinamento</CardTitle>
                <CardDescription>Métricas-chave de treinamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Horas por Funcionário",
                      value: "5.8",
                      change: "+0.7",
                      positive: true,
                    },
                    {
                      title: "Treinamentos Concluídos",
                      value: "12",
                      change: "+3",
                      positive: true,
                    },
                    {
                      title: "Taxa de Conclusão",
                      value: "95%",
                      change: "+2%",
                      positive: true,
                    },
                    {
                      title: "Satisfação com Treinamentos",
                      value: "4.5/5",
                      change: "+0.2",
                      positive: true,
                    },
                    {
                      title: "Funcionários Treinados",
                      value: "92%",
                      change: "+5%",
                      positive: true,
                    },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{metric.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{metric.value}</p>
                        <p className={`text-xs ${metric.positive ? "text-green-500" : "text-red-500"}`}>
                          {metric.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Relatório Completo
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Treinamentos Recentes</CardTitle>
                <CardDescription>Treinamentos realizados recentemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "JavaScript Avançado",
                      instructor: "Carlos Mendes",
                      hours: 24,
                      participants: 12,
                      date: "15-17 Mar, 2024",
                    },
                    {
                      name: "Segurança de Dados",
                      instructor: "Ricardo Santos",
                      hours: 8,
                      participants: 25,
                      date: "05 Mar, 2024",
                    },
                    {
                      name: "React Avançado",
                      instructor: "Carlos Mendes",
                      hours: 16,
                      participants: 10,
                      date: "20-21 Fev, 2024",
                    },
                    {
                      name: "DevOps Essentials",
                      instructor: "Mariana Costa",
                      hours: 16,
                      participants: 8,
                      date: "10-11 Fev, 2024",
                    },
                  ].map((training, i) => (
                    <div
                      key={i}
                      className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{training.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Instrutor: {training.instructor} • {training.date}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-4 sm:mt-0">
                        <div className="text-right">
                          <p className="font-medium">{training.hours} horas</p>
                          <p className="text-xs text-muted-foreground">{training.participants} participantes</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Todos os Treinamentos
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="attendance" className="animate-fade">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendência de Atestados Médicos</CardTitle>
                <CardDescription>Dias de atestado médico ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={medicalLeavesTrend}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="Dias" stroke="#FF8042" activeDot={{ r: 8 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between">
                <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
                  Total: 18 dias • Média Mensal: 1.5 dias
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Presença</CardTitle>
                <CardDescription>Métricas-chave de presença</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Taxa de Presença",
                      value: "97.2%",
                      change: "+0.5%",
                      positive: true,
                    },
                    {
                      title: "Dias de Atestado",
                      value: "18",
                      change: "-2",
                      positive: true,
                    },
                    {
                      title: "Ausências Não Justificadas",
                      value: "0.5%",
                      change: "-0.2%",
                      positive: true,
                    },
                    {
                      title: "Atrasos",
                      value: "2.1%",
                      change: "-0.4%",
                      positive: true,
                    },
                    {
                      title: "Funcionários sem Ausências",
                      value: "72%",
                      change: "+4%",
                      positive: true,
                    },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-medium">{metric.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{metric.value}</p>
                        <p className={`text-xs ${metric.positive ? "text-green-500" : "text-red-500"}`}>
                          {metric.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Relatório Completo
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Atestados Médicos Recentes</CardTitle>
                <CardDescription>Registros recentes de atestados médicos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      employee: "João Silva",
                      reason: "Doença",
                      days: 3,
                      startDate: "10 Mar, 2024",
                      status: "Aprovado",
                    },
                    {
                      employee: "Maria Santos",
                      reason: "Consulta Médica",
                      days: 1,
                      startDate: "05 Mar, 2024",
                      status: "Aprovado",
                    },
                    {
                      employee: "Roberto Oliveira",
                      reason: "Doença",
                      days: 2,
                      startDate: "22 Fev, 2024",
                      status: "Aprovado",
                    },
                    {
                      employee: "Camila Pereira",
                      reason: "Consulta Médica",
                      days: 1,
                      startDate: "15 Fev, 2024",
                      status: "Aprovado",
                    },
                  ].map((leave, i) => (
                    <div
                      key={i}
                      className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{leave.employee}</h3>
                        <p className="text-sm text-muted-foreground">
                          {leave.reason} • A partir de {leave.startDate}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-4 sm:mt-0">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                            leave.status === "Aprovado"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : leave.status === "Pendente"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {leave.days} {leave.days === 1 ? "dia" : "dias"}
                        </span>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Todos os Atestados
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

