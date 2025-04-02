"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, AlertTriangle, ArrowUpRight, CheckCircle2, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
} from "recharts"

// Dados de exemplo para os gráficos
const departmentPerformanceData = [
  { month: "Jan", TI: 4.2, RH: 3.8, Vendas: 4.5, Marketing: 4.1, Financeiro: 3.9 },
  { month: "Fev", TI: 4.3, RH: 3.9, Vendas: 4.4, Marketing: 4.2, Financeiro: 4.0 },
  { month: "Mar", TI: 4.1, RH: 4.0, Vendas: 4.3, Marketing: 4.0, Financeiro: 4.1 },
  { month: "Abr", TI: 4.4, RH: 4.1, Vendas: 4.6, Marketing: 4.3, Financeiro: 4.2 },
  { month: "Mai", TI: 4.5, RH: 4.2, Vendas: 4.7, Marketing: 4.4, Financeiro: 4.3 },
  { month: "Jun", TI: 4.6, RH: 4.3, Vendas: 4.8, Marketing: 4.5, Financeiro: 4.4 },
]

const medicalLeaveData = [
  { name: "Gripe/Resfriado", value: 35 },
  { name: "Problemas Ortopédicos", value: 25 },
  { name: "Saúde Mental", value: 20 },
  { name: "Cirurgias", value: 10 },
  { name: "Outros", value: 10 },
]

const trainingData = [
  { name: "TI", value: 12 },
  { name: "RH", value: 8 },
  { name: "Vendas", value: 15 },
  { name: "Marketing", value: 10 },
  { name: "Financeiro", value: 7 },
]

const performanceTrendData = [
  { month: "Jul", score: 4.1 },
  { month: "Ago", score: 4.0 },
  { month: "Set", score: 4.2 },
  { month: "Out", score: 4.3 },
  { month: "Nov", score: 4.1 },
  { month: "Dez", score: 4.0 },
  { month: "Jan", score: 4.2 },
  { month: "Fev", score: 4.3 },
  { month: "Mar", score: 4.4 },
  { month: "Abr", score: 4.5 },
  { month: "Mai", score: 4.6 },
  { month: "Jun", score: 4.7 },
]

const attendanceData = [
  { name: "TI", value: 97 },
  { name: "RH", value: 95 },
  { name: "Vendas", value: 92 },
  { name: "Marketing", value: 94 },
  { name: "Financeiro", value: 96 },
]

// Dados para o gráfico de radar
const radarData = [
  { subject: "Habilidades Técnicas", TI: 8.5, RH: 6.5, Vendas: 7.0, Marketing: 7.5, Financeiro: 7.0, fullMark: 10 },
  { subject: "Comunicação", TI: 7.0, RH: 9.0, Vendas: 8.5, Marketing: 9.0, Financeiro: 7.5, fullMark: 10 },
  { subject: "Liderança", TI: 8.0, RH: 8.5, Vendas: 8.0, Marketing: 7.5, Financeiro: 8.0, fullMark: 10 },
  { subject: "Trabalho em Equipe", TI: 9.0, RH: 8.5, Vendas: 7.5, Marketing: 8.0, Financeiro: 7.5, fullMark: 10 },
  { subject: "Resolução de Problemas", TI: 9.0, RH: 7.0, Vendas: 7.5, Marketing: 7.0, Financeiro: 8.5, fullMark: 10 },
  { subject: "Pontualidade", TI: 8.5, RH: 8.0, Vendas: 7.0, Marketing: 7.5, Financeiro: 9.0, fullMark: 10 },
]

// Dados adicionais da tela de análises
const skillsDistribution = [
  { name: "Técnico", value: 35 },
  { name: "Comunicação", value: 25 },
  { name: "Liderança", value: 15 },
  { name: "Resolução de Problemas", value: 20 },
  { name: "Trabalho em Equipe", value: 30 },
]

// Modificar o gráfico "Desempenho por departamento" para remover os meses e mostrar apenas departamento e pontuação
// Criar novos dados para o gráfico
const departmentPerformanceSimpleData = [
  { name: "TI", value: 4.5 },
  { name: "RH", value: 4.2 },
  { name: "Vendas", value: 4.7 },
  { name: "Marketing", value: 4.3 },
  { name: "Financeiro", value: 4.1 },
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

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [department, setDepartment] = useState("all")
  const router = useRouter()

  // Função para navegar para outras seções do app
  const navigateToSection = (path: string) => {
    router.push(path)
  }

  // Formatador para valores monetários
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`

  // Formatador para percentuais
  const formatPercent = (value: number) => `${value}%`

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do desempenho dos funcionários e métricas da empresa.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Departamentos</SelectItem>
              <SelectItem value="TI">TI</SelectItem>
              <SelectItem value="RH">RH</SelectItem>
              <SelectItem value="Vendas">Vendas</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigateToSection("/reports")}>
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card onClick={() => navigateToSection("/dashboard/employees")} className="cursor-pointer hover:bg-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atestados Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinamentos Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="attendance">Atestados</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Desempenho por Departamento</CardTitle>
                <CardDescription>Média de avaliações por departamento</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={departmentPerformanceSimpleData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip formatter={(value) => [`${value}`, "Pontuação"]} />
                      <Legend />
                      <Bar dataKey="value" name="Pontuação" fill={MODERN_COLORS[0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Distribuição de Atestados</CardTitle>
                <CardDescription>Motivos de atestados médicos no último trimestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={medicalLeaveData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {medicalLeaveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Porcentagem"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Treinamentos por Departamento</CardTitle>
                <CardDescription>Número de treinamentos concluídos por departamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={trainingData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, "Treinamentos"]} />
                      <Legend />
                      <Bar dataKey="value" name="Treinamentos" fill={MODERN_COLORS[5]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Ranking de Desempenho</CardTitle>
                <CardDescription>Funcionários com as melhores avaliações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Ana Silva", department: "Vendas", score: 9.8 },
                    { name: "Carlos Oliveira", department: "TI", score: 9.7 },
                    { name: "Mariana Santos", department: "Marketing", score: 9.6 },
                    { name: "Roberto Almeida", department: "TI", score: 9.5 },
                    { name: "Juliana Costa", department: "RH", score: 9.4 },
                    { name: "Fernando Gomes", department: "Financeiro", score: 9.3 },
                    { name: "Patrícia Lima", department: "Vendas", score: 9.2 },
                  ].map((employee, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-2 cursor-pointer hover:bg-muted"
                      onClick={() => router.push(`/employees/${i + 1}`)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-bold">{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.department}</p>
                        </div>
                      </div>
                      <div className="font-medium text-sm">{employee.score.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Métricas de Desempenho por Departamento</CardTitle>
                <CardDescription>Análise comparativa das diferentes áreas de desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="TI"
                        dataKey="TI"
                        stroke={MODERN_COLORS[0]}
                        fill={MODERN_COLORS[0]}
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="RH"
                        dataKey="RH"
                        stroke={MODERN_COLORS[1]}
                        fill={MODERN_COLORS[1]}
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Vendas"
                        dataKey="Vendas"
                        stroke={MODERN_COLORS[2]}
                        fill={MODERN_COLORS[2]}
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Marketing"
                        dataKey="Marketing"
                        stroke={MODERN_COLORS[3]}
                        fill={MODERN_COLORS[3]}
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Financeiro"
                        dataKey="Financeiro"
                        stroke={MODERN_COLORS[4]}
                        fill={MODERN_COLORS[4]}
                        fillOpacity={0.6}
                      />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Individual</CardTitle>
              <CardDescription>Top 10 funcionários com melhor desempenho no último trimestre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-muted"
                    onClick={() => router.push(`/employees/${i + 1}`)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Funcionário {i + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          Departamento de {["TI", "RH", "Vendas", "Marketing", "Financeiro"][i % 5]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{(4.5 + i * 0.05).toFixed(1)}</div>
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dias Perdidos por Departamento</CardTitle>
              <CardDescription>Total de dias de atestado por departamento no último trimestre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "TI", value: 45 },
                      { name: "RH", value: 32 },
                      { name: "Vendas", value: 28 },
                      { name: "Marketing", value: 18 },
                      { name: "Financeiro", value: 12 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} dias`, "Dias Perdidos"]} />
                    <Legend />
                    <Bar dataKey="value" name="Dias Perdidos" fill={MODERN_COLORS[6]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Principais Motivos de Ausência</CardTitle>
              <CardDescription>Distribuição de ausências por motivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "Doença", value: 45 },
                        { name: "Consulta Médica", value: 25 },
                        { name: "Cirurgia", value: 15 },
                        { name: "Lesão", value: 10 },
                        { name: "Outro", value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {medicalLeaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Porcentagem"]} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Habilidades</CardTitle>
                <CardDescription>Pontuações por área de habilidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={skillsDistribution}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, "Pontuação"]} />
                      <Legend />
                      <Bar dataKey="value" name="Pontuação" fill={MODERN_COLORS[7]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Análise de Desempenho</CardTitle>
                <CardDescription>Métricas-chave de desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Pontuação Média",
                      value: "83.75",
                      change: "+5.2%",
                      positive: true,
                    },
                    {
                      title: "Metas Atingidas",
                      value: "87%",
                      change: "+12%",
                      positive: true,
                    },
                    {
                      title: "Avaliações Concluídas",
                      value: "95%",
                      change: "+3%",
                      positive: true,
                    },
                    {
                      title: "Funcionários Abaixo da Meta",
                      value: "8%",
                      change: "-2%",
                      positive: true,
                    },
                    {
                      title: "Funcionários Acima da Meta",
                      value: "32%",
                      change: "+7%",
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
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

