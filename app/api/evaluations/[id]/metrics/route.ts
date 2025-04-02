import { NextResponse } from 'next/server'
import { EvaluationService } from '@/lib/services/evaluation.service'

const evaluationService = new EvaluationService()

// GET /api/evaluations/[id]/metrics - Calcular métricas da avaliação
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [selfAverage, managerAverage, scoreDifference] = await Promise.all([
      evaluationService.calculateAverageScore(params.id, 'self'),
      evaluationService.calculateAverageScore(params.id, 'manager'),
      evaluationService.calculateScoreDifference(params.id)
    ])

    return NextResponse.json({
      selfAverage,
      managerAverage,
      scoreDifference
    })
  } catch (error) {
    console.error('Erro ao calcular métricas:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular métricas' },
      { status: 500 }
    )
  }
} 