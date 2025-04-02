import { NextResponse } from 'next/server'
import { EvaluationService } from '@/lib/services/evaluation.service'

const evaluationService = new EvaluationService()

// GET /api/evaluations - Listar avaliações
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const evaluations = await evaluationService.listEvaluations({
      employeeId: employeeId || undefined,
      type: type || undefined,
      status: status || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    })

    return NextResponse.json(evaluations)
  } catch (error) {
    console.error('Erro ao listar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro ao listar avaliações' },
      { status: 500 }
    )
  }
}

// POST /api/evaluations - Criar nova avaliação
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const evaluation = await evaluationService.createEvaluation(data)
    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar avaliação' },
      { status: 500 }
    )
  }
} 