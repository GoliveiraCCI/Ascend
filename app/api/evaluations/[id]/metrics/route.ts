import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/[id]/metrics - Calcular métricas da avaliação
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: params.id },
      include: {
        answers: true
      }
    })

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Calcular média de pontuações
    const answers = evaluation.answers
    const selfScores = answers.map(a => a.selfScore || 0)
    const managerScores = answers.map(a => a.managerScore || 0)

    const averageSelfScore = selfScores.length > 0
      ? selfScores.reduce((a, b) => a + b, 0) / selfScores.length
      : 0

    const averageManagerScore = managerScores.length > 0
      ? managerScores.reduce((a, b) => a + b, 0) / managerScores.length
      : 0

    // Calcular diferença entre pontuações
    const scoreDifference = Math.abs(averageSelfScore - averageManagerScore)

    // Calcular progresso
    const totalQuestions = answers.length
    const answeredQuestions = answers.filter(a => 
      (a.selfScore !== null && a.selfScore !== undefined) || 
      (a.managerScore !== null && a.managerScore !== undefined)
    ).length

    const progress = totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0

    return NextResponse.json({
      averageSelfScore: Number(averageSelfScore.toFixed(1)),
      averageManagerScore: Number(averageManagerScore.toFixed(1)),
      scoreDifference: Number(scoreDifference.toFixed(1)),
      progress,
      totalQuestions,
      answeredQuestions
    })
  } catch (error) {
    console.error('Erro ao calcular métricas:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular métricas' },
      { status: 500 }
    )
  }
} 