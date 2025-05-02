"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { GraduationCap, Clock, Users, Timer, Calendar, Percent } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

interface DashboardData {
  totalEmployees: number
  activeEmployees: number
  pendingEvaluations: number
  activeMedicalLeaves: number
  completedTrainings: number
  departmentStats: Array<{
    name: string
    employees: number
    evaluations: number
    leaves: number
    trainings: number
    trainingHours: number
  }>
  evaluationScores: Array<{
    department: string
    averageScore: number
  }>
  trainingStats: Array<{
    category: string
    count: number
  }>
  leaveReasons: Array<{
    reason: string
    count: number
  }>
  topPerformers: Array<{
    id: string
    name: string
    department: string
    score: number
  }>
  performanceMetrics: Array<{
    category: string
    score: number
  }>
  topTrainingEmployees: Array<{
    id: string
    name: string
    department: string
    hours: number
  }>
  evaluationsByMonth: Array<{
    month: string
    evaluations: number
    byDepartment: Record<string, number>
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Erro ao carregar dados</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema e métricas importantes.
        </p>
      </div>

      <Tabs defaultValue="evaluations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
          <TabsTrigger value="trainings">Treinamentos</TabsTrigger>
          <TabsTrigger value="medical-leaves">Afastamentos</TabsTrigger>
        </TabsList>

        {/* Aba de Avaliações */}
        <TabsContent value="evaluations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.departmentStats.reduce((acc, dept) => acc + dept.evaluations, 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.pendingEvaluations}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.departmentStats.reduce((acc, dept) => acc + dept.evaluations, 0) - data.pendingEvaluations}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data.evaluationScores.reduce((acc, score) => acc + score.averageScore, 0) / data.evaluationScores.length).toFixed(1)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Avaliações por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="evaluations" name="Total" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Avaliações</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.evaluationsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => {
                        if (name === "total") {
                          return [`${value} avaliações`, "Total"]
                        }
                        return [`${value} avaliações`, name]
                      }}
                      labelFormatter={(label) => {
                        const item = data.evaluationsByMonth.find(d => d.month === label)
                        if (!item) return label

                        const departments = Object.entries(item.byDepartment)
                          .map(([dept, count]) => `${dept}: ${count}`)
                          .join('\n')

                        return (
                          <span>
                            <span className="font-bold block mb-2">{label}</span>
                            <span className="text-sm block whitespace-pre-line">{departments}</span>
                          </span>
                        )
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke={COLORS[0]}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pontuação Média por Departamento</CardTitle>
                <CardDescription>Comparação de desempenho entre departamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.evaluationScores.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                      <div className="font-medium">{dept.department}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(dept.averageScore / 10) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            dept.averageScore >= 8.5
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : dept.averageScore >= 8
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {dept.averageScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPerformers.map((performer, index) => (
                    <div
                      key={performer.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{performer.name}</div>
                        <div className="text-sm text-muted-foreground">{performer.department}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary">{performer.score.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">/ 10</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Treinamentos */}
        <TabsContent value="trainings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Treinamentos
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.completedTrainings}</div>
                <p className="text-xs text-muted-foreground">
                  Treinamentos concluídos
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Treinamentos em Andamento
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.departmentStats.reduce((acc, dept) => acc + dept.trainings, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Treinamentos ativos
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Horas de Treinamento
                </CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.departmentStats.reduce((acc, dept) => acc + dept.trainingHours, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Horas totais
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Média por Funcionário
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.activeEmployees > 0
                    ? Math.round(
                        (data.departmentStats.reduce((acc, dept) => acc + dept.trainings, 0) /
                          data.activeEmployees) *
                          10
                      ) / 10
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Treinamentos por funcionário
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Treinamentos por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="trainings" name="Total" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Treinamentos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.trainingStats}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {data.trainingStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} treinamentos`, 'Quantidade']}
                        labelFormatter={(label) => {
                          const categories: { [key: string]: string } = {
                            'TECHNICAL': 'Técnico',
                            'SOFT_SKILLS': 'Soft Skills',
                            'LEADERSHIP': 'Liderança',
                            'COMPLIANCE': 'Conformidade',
                            'SAFETY': 'Segurança',
                            'HEALTH': 'Saúde',
                            'QUALITY': 'Qualidade',
                            'PROCESS': 'Processos',
                            'CUSTOMER_SERVICE': 'Atendimento',
                            'SALES': 'Vendas',
                            'MARKETING': 'Marketing',
                            'FINANCE': 'Financeiro',
                            'HR': 'RH',
                            'IT': 'TI',
                            'OPERATIONS': 'Operações',
                            'PROJECT_MANAGEMENT': 'Gestão de Projetos',
                            'OTHER': 'Outros'
                          }
                          return categories[label] || label
                        }}
                      />
                      <Legend 
                        formatter={(value) => {
                          const categories: { [key: string]: string } = {
                            'TECHNICAL': 'Técnico',
                            'SOFT_SKILLS': 'Soft Skills',
                            'LEADERSHIP': 'Liderança',
                            'COMPLIANCE': 'Conformidade',
                            'SAFETY': 'Segurança',
                            'HEALTH': 'Saúde',
                            'QUALITY': 'Qualidade',
                            'PROCESS': 'Processos',
                            'CUSTOMER_SERVICE': 'Atendimento',
                            'SALES': 'Vendas',
                            'MARKETING': 'Marketing',
                            'FINANCE': 'Financeiro',
                            'HR': 'RH',
                            'IT': 'TI',
                            'OPERATIONS': 'Operações',
                            'PROJECT_MANAGEMENT': 'Gestão de Projetos',
                            'OTHER': 'Outros'
                          }
                          return categories[value] || value
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução de Treinamentos</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", trainings: 12 },
                        { month: "Fev", trainings: 15 },
                        { month: "Mar", trainings: 10 },
                        { month: "Abr", trainings: 18 },
                        { month: "Mai", trainings: 14 },
                        { month: "Jun", trainings: 20 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="trainings"
                        name="Treinamentos"
                        stroke={COLORS[0]}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Funcionários em Treinamento</CardTitle>
                <CardDescription>Funcionários com mais horas de treinamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topTrainingEmployees?.map((employee, index) => (
                    <div
                      key={employee.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.department}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary">{employee.hours}</div>
                        <div className="text-sm text-muted-foreground">horas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horas de Treinamento por Departamento</CardTitle>
                <CardDescription>Departamentos com mais horas de treinamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.departmentStats
                    .sort((a, b) => b.trainingHours - a.trainingHours)
                    .map((dept, index) => (
                      <div
                        key={dept.name}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">{dept.employees} funcionários</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold text-primary">{dept.trainingHours}</div>
                          <div className="text-sm text-muted-foreground">horas</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Afastamentos */}
        <TabsContent value="medical-leaves" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Afastamentos
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.departmentStats.reduce((acc, dept) => acc + dept.leaves, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de registros
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Afastamentos Ativos
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeMedicalLeaves}</div>
                <p className="text-xs text-muted-foreground">
                  Em andamento
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Média de Duração
                </CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">
                  Dias por afastamento
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Afastamento
                </CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.activeEmployees > 0
                    ? Math.round((data.activeMedicalLeaves / data.activeEmployees) * 100)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Em relação ao total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Afastamentos por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leaves" name="Total" fill={COLORS[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Afastamentos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.leaveReasons}
                        dataKey="count"
                        nameKey="reason"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {data.leaveReasons.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução de Afastamentos</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", leaves: 5 },
                        { month: "Fev", leaves: 8 },
                        { month: "Mar", leaves: 6 },
                        { month: "Abr", leaves: 10 },
                        { month: "Mai", leaves: 7 },
                        { month: "Jun", leaves: 9 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="leaves"
                        name="Afastamentos"
                        stroke={COLORS[1]}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Departamentos</CardTitle>
                <CardDescription>Departamentos com mais afastamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.departmentStats
                    .sort((a, b) => b.leaves - a.leaves)
                    .map((dept, index) => (
                      <div
                        key={dept.name}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">{dept.employees} funcionários</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold text-primary">{dept.leaves}</div>
                          <div className="text-sm text-muted-foreground">afastamentos</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Duração</CardTitle>
                <CardDescription>Períodos de afastamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { range: "1-7 dias", count: 15 },
                        { range: "8-15 dias", count: 25 },
                        { range: "16-30 dias", count: 20 },
                        { range: "31+ dias", count: 10 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Quantidade" fill={COLORS[2]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 