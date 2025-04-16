import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Calcula a data de 12 meses atrás
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    // Busca todas as avaliações concluídas dos últimos 12 meses
    const evaluations = await prisma.evaluation.findMany({
      where: {
        status: "CONCLUIDA",
        date: {
          gte: twelveMonthsAgo
        }
      },
      select: {
        date: true,
        finalScore: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    console.log('Total de avaliações encontradas:', evaluations.length)

    // Agrupa as avaliações por mês e calcula a média
    const monthlyData = evaluations.reduce((acc: { [key: string]: { sum: number, count: number } }, evaluation) => {
      const month = new Date(evaluation.date).toLocaleString('pt-BR', { month: '2-digit', year: '2-digit' })
      if (!acc[month]) {
        acc[month] = { sum: 0, count: 0 }
      }
      acc[month].sum += evaluation.finalScore
      acc[month].count += 1
      return acc
    }, {})

    console.log('Dados mensais:', monthlyData)

    // Converte para o formato esperado pelo gráfico
    const trendData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      averageScore: data.sum / data.count
    }))

    console.log('Dados finais:', trendData)

    return NextResponse.json(trendData)
  } catch (error) {
    console.error('Erro ao buscar dados de tendência:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados de tendência' },
      { status: 500 }
    )
  }
} 