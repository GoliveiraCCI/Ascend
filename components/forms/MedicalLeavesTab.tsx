import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileText, Calendar, TrendingUp } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, PieChart, Pie, LineChart, Tooltip, Line } from "recharts"
import { toast } from "@/components/ui/use-toast"

interface MedicalLeavesTabProps {
  employeeId: string
}

const MedicalLeavesTab = ({ employeeId }: MedicalLeavesTabProps) => {
  const [analytics, setAnalytics] = useState<{
    totalLeaves: number;
    totalDays: number;
    averageDays: number;
    byDepartment: Array<{
      name: string;
      total: number;
      days: number;
      employees: number;
    }>;
    byCID: Array<{
      cid: string;
      total: number;
      days: number;
    }>;
    byMonth: Array<{
      month: string;
      total: number;
      days: number;
    }>;
  }>({
    totalLeaves: 0,
    totalDays: 0,
    averageDays: 0,
    byDepartment: [],
    byCID: [],
    byMonth: []
  })

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: ''
  })

  useEffect(() => {
    fetchAnalytics()
  }, [filters, employeeId])

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)
      if (filters.department) params.append("department", filters.department)
      params.append("employeeId", employeeId)

      const response = await fetch(`/api/medical-leaves/analytics?${params.toString()}`)
      if (!response.ok) throw new Error("Erro ao buscar análises")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Erro ao buscar análises:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar análises de licenças médicas",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <TabsContent value="analytics" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Licenças</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalLeaves}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Dias</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalDays}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Dias</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageDays.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Licenças por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analytics.byDepartment}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top 5 CIDs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={analytics.byCID.slice(0, 5)}
                    dataKey="total"
                    nameKey="cid"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Licenças por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analytics.byMonth}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}

export default MedicalLeavesTab 