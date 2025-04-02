import { NextResponse } from 'next/server'
import { EvaluationService } from '@/lib/services/evaluation.service'

const evaluationService = new EvaluationService()

// GET /api/evaluations/categories - Listar categorias
export async function GET() {
  try {
    const categories = await evaluationService.getEvaluationCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erro ao listar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao listar categorias' },
      { status: 500 }
    )
  }
} 