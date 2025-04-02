"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Training } from "@prisma/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface TrainingChartsProps {
  trainings: Training[]
}

interface ChartData {
  name: string
  value: number
}

// Cores modernas em tons de roxo e azul
const COLORS = [
  '#6366F1', // Indigo
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#2563EB', // Blue
  '#7C3AED', // Purple
  '#60A5FA', // Light Blue
  '#A78BFA', // Light Purple
  '#4F46E5', // Indigo
  '#818CF8', // Light Indigo
  '#C4B5FD', // Very Light Purple
  '#1D4ED8', // Dark Blue
  '#6D28D9', // Dark Purple
  '#3B82F6', // Blue
  '#7C3AED', // Purple
  '#6366F1'  // Indigo
]

// Função para traduzir as categorias
const translateCategory = (category: string): string => {
  const translations: { [key: string]: string } = {
    'SAFETY': 'Segurança',
    'TECHNICAL': 'Técnico',
    'MANAGEMENT': 'Gestão',
    'COMPLIANCE': 'Conformidade',
    'SOFT_SKILLS': 'Habilidades Interpessoais',
    'PROFESSIONAL_DEVELOPMENT': 'Desenvolvimento Profissional',
    'ONBOARDING': 'Integração',
    'CERTIFICATION': 'Certificação',
    'QUALITY': 'Qualidade',
    'PROCESS': 'Processos',
    'LEADERSHIP': 'Liderança',
    'OTHER': 'Outros'
  }
  return translations[category] || category
}

export function MonthlyTrainingsChart({ trainings }: TrainingChartsProps) {
  // Preparar dados para o gráfico mensal
  const monthlyData = trainings.reduce((acc: { [key: string]: number }, training) => {
    const date = new Date(training.startDate)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    acc[monthYear] = (acc[monthYear] || 0) + 1
    return acc
  }, {})

  const monthlyChartData: ChartData[] = Object.entries(monthlyData)
    .sort((a, b) => {
      const [monthA, yearA] = a[0].split('/')
      const [monthB, yearB] = b[0].split('/')
      return yearA === yearB ? Number(monthA) - Number(monthB) : Number(yearA) - Number(yearB)
    })
    .map(([name, value]) => ({
      name,
      value
    }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Treinamentos por Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tickFormatter={(value) => {
                  const [month, year] = value.split('/')
                  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                  return `${monthNames[Number(month) - 1]}/${year}`
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => {
                  const [month, year] = value.split('/')
                  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                  return `${monthNames[Number(month) - 1]} de ${year}`
                }}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryTrainingsChart({ trainings }: TrainingChartsProps) {
  // Preparar dados para o gráfico de categorias
  const categoryData = trainings.reduce((acc: { [key: string]: number }, training) => {
    acc[training.category] = (acc[training.category] || 0) + 1
    return acc
  }, {})

  const categoryChartData: ChartData[] = Object.entries(categoryData).map(([name, value]) => ({
    name: translateCategory(name),
    value
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treinamentos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 