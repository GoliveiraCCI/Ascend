"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from "recharts"
import { FileText, Calendar, TrendingUp } from "lucide-react"

// Cores modernas para os gráficos
const MODERN_COLORS = [
  "#3B82F6", // Azul
  "#10B981", // Verde
  "#F59E0B", // Amarelo
  "#EF4444", // Vermelho
  "#8B5CF6", // Roxo
  "#EC4899", // Rosa
  "#14B8A6", // Turquesa
  "#F97316", // Laranja
]

// Tipos para os dados do dashboard
interface DashboardData {
  totalEmployees: number
  activeEmployees: number
  pendingEvaluations: number
  activeMedicalLeaves: number
  completedTrainings: number
  departmentStats: {
    name: string
    employees: number
    evaluations: number
    leaves: number
    trainings: number
  }[]
  evaluationScores: {
    department: string
    averageScore: number
  }[]
  trainingStats: {
    category: string
    count: number
  }[]
  leaveReasons: {
    reason: string
    count: number
  }[]
  topPerformers: {
    id: string
    name: string
    department: string
    score: number
  }[]
  performanceMetrics: {
    category: string
    score: number
  }[]
  evaluationTrend: {
    month: string
    averageScore: number
  }[]
  medicalLeaves: {
    totalLeaves: number
    totalDays: number
    averageDays: number
    byDepartment: {
      name: string
      total: number
      days: number
    }[]
    byReason: {
      reason: string
      total: number
      days: number
    }[]
    byMonth: {
      month: string
      total: number
      days: number
    }[]
  }
  trainings: {
    byCategory: {
      category: string
      total: number
    }[]
    byStatus: {
      status: string
      total: number
      participants: number
    }[]
    byDepartment: {
      department: string
      participants: number
    }[]
    byMonth: {
      month: string
      total: number
      participants: number
    }[]
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Iniciando busca de dados do dashboard...')
        
        const [dashboardResponse, trendResponse, medicalLeavesResponse, trainingsResponse] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/dashboard/evaluation-trend'),
          fetch('/api/dashboard/medical-leaves'),
          fetch('/api/dashboard/trainings')
        ])

        console.log('Status das respostas:', {
          dashboard: dashboardResponse.status,
          trend: trendResponse.status,
          medicalLeaves: medicalLeavesResponse.status,
          trainings: trainingsResponse.status
        })

        if (!dashboardResponse.ok) {
          console.error('Erro na resposta do dashboard:', await dashboardResponse.text())
          throw new Error('Erro ao buscar dados principais do dashboard')
        }
        if (!trendResponse.ok) {
          console.error('Erro na resposta do trend:', await trendResponse.text())
          throw new Error('Erro ao buscar dados de tendência')
        }
        if (!medicalLeavesResponse.ok) {
          console.error('Erro na resposta dos atestados:', await medicalLeavesResponse.text())
          throw new Error('Erro ao buscar dados de atestados')
        }
        if (!trainingsResponse.ok) {
          console.error('Erro na resposta dos treinamentos:', await trainingsResponse.text())
          throw new Error('Erro ao buscar dados de treinamentos')
        }

        const [dashboardData, trendData, medicalLeavesData, trainingsData] = await Promise.all([
          dashboardResponse.json(),
          trendResponse.json(),
          medicalLeavesResponse.json(),
          trainingsResponse.json()
        ])

        console.log('Dados recebidos com sucesso')
        setDashboardData({
          ...dashboardData,
          evaluationTrend: trendData,
          medicalLeaves: medicalLeavesData,
          trainings: trainingsData
        })
      } catch (error) {
        console.error('Erro detalhado ao buscar dados:', error)
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!dashboardData) {
    return <div>Erro ao carregar dados do dashboard</div>
  }

  const { departmentStats, evaluationScores, trainingStats, leaveReasons, topPerformers, performanceMetrics } = dashboardData

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Avaliações</TabsTrigger>
          <TabsTrigger value="training">Treinamentos</TabsTrigger>
          <TabsTrigger value="leaves">Atestados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.activeEmployees} ativos
                </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{dashboardData.pendingEvaluations}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((dashboardData.pendingEvaluations / dashboardData.totalEmployees) * 100)}% do total
                </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atestados Ativos</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{dashboardData.activeMedicalLeaves}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((dashboardData.activeMedicalLeaves / dashboardData.totalEmployees) * 100)}% do total
                </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinamentos Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{dashboardData.completedTrainings}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((dashboardData.completedTrainings / dashboardData.totalEmployees) * 100)}% do total
                </p>
          </CardContent>
        </Card>
      </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Qnt de avaliações aplicadas por departamento</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={departmentStats.map(dept => ({
                    ...dept,
                    name: dept.name.replace("Departamento ", "")
                  }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="evaluations" name="Avaliações" fill={MODERN_COLORS[0]} />
                  </BarChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Evolução Mensal das Notas</CardTitle>
                <CardDescription>Nota média das avaliações por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={dashboardData.evaluationTrend}
                    margin={{ top: 5, right: 5, left: -30, bottom: -20 }}
                  >
                    {console.log('Dados do gráfico:', dashboardData.evaluationTrend)}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 5]}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      name="Nota Média"
                      stroke={MODERN_COLORS[0]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pontuação Média por Departamento</CardTitle>
                <CardDescription>Média das avaliações por departamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {evaluationScores.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                      <div className="font-medium">{dept.department}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(dept.averageScore / 5) * 100}%`,
                              backgroundColor: MODERN_COLORS[index % MODERN_COLORS.length],
                            }}
                          />
                        </div>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            dept.averageScore >= 4.5
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : dept.averageScore >= 4
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
                <CardTitle>Top 10 Melhores Desempenhos</CardTitle>
              </CardHeader>
              <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((performer) => (
                    <TableRow key={performer.id}>
                      <TableCell>{performer.name}</TableCell>
                      <TableCell>{performer.department}</TableCell>
                      <TableCell>
                      <div className="flex items-center gap-2">
                          <Progress value={performer.score * 10} className="w-[100px]" />
                          <span>{performer.score.toFixed(1)}</span>
                </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">Ativo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="animate-fade">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Treinamentos por Categoria</CardTitle>
                  <CardDescription>Distribuição de treinamentos por categoria</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                      <Pie
                          data={dashboardData.trainings.byCategory}
                          dataKey="total"
                          nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                          label
                      >
                          {dashboardData.trainings.byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                        ))}
                      </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value} treinamentos`, name]}
                        />
                        <Legend 
                          formatter={(value) => {
                            if (value === "TECHNICAL") return "Técnico";
                            if (value === "SOFT_SKILLS") return "Habilidades Interpessoais";
                            if (value === "LEADERSHIP") return "Liderança";
                            if (value === "COMPLIANCE") return "Conformidade";
                            return value;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status dos Treinamentos</CardTitle>
                  <CardDescription>Distribuição por status</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData.trainings.byStatus}
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="status"
                          width={120}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === "total") return [`${value} treinamentos`, "Total"];
                            if (name === "participants") return [`${value} participantes`, "Participantes"];
                            return [value, name];
                          }}
                        />
                        <Legend 
                          formatter={(value) => {
                            if (value === "total") return "Total de Treinamentos";
                            if (value === "participants") return "Total de Participantes";
                            return value;
                          }}
                        />
                        <Bar dataKey="total" name="total" fill={MODERN_COLORS[0]} />
                        <Bar dataKey="participants" name="participants" fill={MODERN_COLORS[1]} />
                      </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

            <Card>
              <CardHeader>
                <CardTitle>Treinamentos por Departamento</CardTitle>
                <CardDescription>Distribuição de participantes por departamento</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.trainings.byDepartment.map(item => ({
                        ...item,
                        displayName: item.department
                          .split(' ')
                          .map(word => {
                            if (word.length <= 3) return word;
                            if (word.toLowerCase() === 'departamento') return 'Dep.';
                            if (word.toLowerCase() === 'recursos') return 'Rec.';
                            if (word.toLowerCase() === 'humanos') return 'Hum.';
                            if (word.toLowerCase() === 'financeiro') return 'Fin.';
                            if (word.toLowerCase() === 'administrativo') return 'Adm.';
                            if (word.toLowerCase() === 'comercial') return 'Com.';
                            if (word.toLowerCase() === 'operacional') return 'Op.';
                            return word.slice(0, 3) + '.';
                          })
                          .join(' '),
                        name: item.department
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="displayName" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ fontSize: 12 }}
                        formatter={(value, name, props) => {
                          const fullName = props.payload.name;
                          return [`${value} participantes`, fullName];
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="participants" name="Participantes" fill={MODERN_COLORS[2]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>Quantidade de treinamentos e participantes por mês</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData.trainings.byMonth}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "total") return [`${value} treinamentos`, "Total de Treinamentos"];
                          if (name === "participants") return [`${value} participantes`, "Total de Participantes"];
                          return [value, name];
                        }}
                      />
                      <Legend 
                        formatter={(value) => {
                          if (value === "total") return "Total de Treinamentos";
                          if (value === "participants") return "Total de Participantes";
                          return value;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="total"
                        stroke={MODERN_COLORS[3]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="participants"
                        name="participants"
                        stroke={MODERN_COLORS[4]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaves" className="animate-fade">
          <div className="grid gap-4">
          <Card>
            <CardHeader>
                <CardTitle>Dias de Atestado por Mês</CardTitle>
                <CardDescription>Distribuição de dias de atestado ao longo do tempo</CardDescription>
            </CardHeader>
              <CardContent className="px-2">
                <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                      data={dashboardData.medicalLeaves.byMonth}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                        bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                    <YAxis />
                      <Tooltip />
                    <Legend />
                      <Bar dataKey="days" name="Dias" fill={MODERN_COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Distribuição por Departamento</CardTitle>
                <CardDescription>Total de dias de atestado por departamento</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.medicalLeaves.byDepartment.map(item => ({
                        ...item,
                        displayName: item.name
                          .split(' ')
                          .map(word => {
                            if (word.length <= 3) return word;
                            if (word.toLowerCase() === 'departamento') return 'Dep.';
                            if (word.toLowerCase() === 'recursos') return 'Rec.';
                            if (word.toLowerCase() === 'humanos') return 'Hum.';
                            if (word.toLowerCase() === 'financeiro') return 'Fin.';
                            if (word.toLowerCase() === 'administrativo') return 'Adm.';
                            if (word.toLowerCase() === 'comercial') return 'Com.';
                            if (word.toLowerCase() === 'operacional') return 'Op.';
                            return word.slice(0, 3) + '.';
                          })
                          .join(' '),
                        name: item.name
                      }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 40,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="displayName" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ fontSize: 12 }}
                        formatter={(value, name, props) => {
                          const fullName = props.payload.name;
                          return [value, fullName];
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="days" name="Dias" fill={MODERN_COLORS[1]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atestados por Categoria</CardTitle>
                <CardDescription>Distribuição de atestados por categoria de licença</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.medicalLeaves.byReason}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 30,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis 
                        type="category" 
                        dataKey="reason"
                        width={120}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="total" name="Quantidade" fill={MODERN_COLORS[2]} />
                      <Bar dataKey="days" name="Dias" fill={MODERN_COLORS[3]} />
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