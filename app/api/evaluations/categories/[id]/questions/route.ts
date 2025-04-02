import { NextResponse } from 'next/server'
import { EvaluationService } from '@/lib/services/evaluation.service'

const evaluationService = new EvaluationService()

// GET /api/evaluations/categories/[id]/questions - Listar questões por categoria
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await evaluationService.getQuestionsByCategory(params.id)
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Erro ao listar questões:', error)
    return NextResponse.json(
      { error: 'Erro ao listar questões' },
      { status: 500 }
    )
  }
} 