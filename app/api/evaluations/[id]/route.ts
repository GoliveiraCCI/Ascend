import { NextResponse } from 'next/server'
import { EvaluationService } from '@/lib/services/evaluation.service'

const evaluationService = new EvaluationService()

// GET /api/evaluations/[id] - Buscar avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await evaluationService.getEvaluationById(params.id)
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliação' },
      { status: 500 }
    )
  }
}

// PUT /api/evaluations/[id] - Atualizar avaliação
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const evaluation = await evaluationService.updateEvaluation(params.id, data)
    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar avaliação' },
      { status: 500 }
    )
  }
} 