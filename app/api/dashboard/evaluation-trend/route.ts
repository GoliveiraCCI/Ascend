import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Calcula a data de 12 meses atrás
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    // Busca todas as avaliações dos últimos 12 meses com suas respostas
    const evaluations = await prisma.evaluation.findMany({
      where: {
        date: {
          gte: twelveMonthsAgo
        }
      },
      include: {
        evaluationanswer: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    console.log('Total de avaliações encontradas:', evaluations.length)

    // Agrupa as avaliações por mês e calcula a média ponderada
    const monthlyData = evaluations.reduce((acc: { [key: string]: { sum: number, count: number } }, evaluation) => {
      const month = new Date(evaluation.date).toLocaleString('pt-BR', { month: '2-digit', year: '2-digit' })
      if (!acc[month]) {
        acc[month] = { sum: 0, count: 0 }
      }
      
      // Calcula a média ponderada para cada avaliação
      const validAnswers = evaluation.evaluationanswer.filter(answer => 
        answer.selfScore !== null && answer.managerScore !== null
      )

      if (validAnswers.length > 0) {
        const selfAverage = validAnswers.reduce((sum, answer) => sum + (answer.selfScore || 0), 0) / validAnswers.length
        const managerAverage = validAnswers.reduce((sum, answer) => sum + (answer.managerScore || 0), 0) / validAnswers.length
        
        // Calcula a média ponderada: 40% autoavaliação + 60% avaliação do gestor
        const weightedScore = (selfAverage * 0.4) + (managerAverage * 0.6)
        acc[month].sum += weightedScore
        acc[month].count += 1
      }

      return acc
    }, {})

    console.log('Dados mensais:', monthlyData)

    // Converte para o formato esperado pelo gráfico
    const trendData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        averageScore: data.count > 0 ? Number((data.sum / data.count).toFixed(1)) : 0
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split('/')
        const [monthB, yearB] = b.month.split('/')
        return new Date(parseInt(yearA), parseInt(monthA) - 1) - new Date(parseInt(yearB), parseInt(monthB) - 1)
      })

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