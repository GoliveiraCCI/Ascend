import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/[id] - Buscar avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: params.id },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        evaluator: {
          select: {
            name: true
          }
        },
        template: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    })

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
    
    const evaluation = await prisma.evaluation.update({
      where: { id: params.id },
      data: {
        status: data.status,
        score: data.score,
        selfEvaluationStatus: data.selfEvaluationStatus,
        managerEvaluationStatus: data.managerEvaluationStatus,
        selfStrengths: data.selfStrengths,
        selfImprovements: data.selfImprovements,
        selfGoals: data.selfGoals,
        managerStrengths: data.managerStrengths,
        managerImprovements: data.managerImprovements,
        managerGoals: data.managerGoals,
        answers: {
          updateMany: data.answers?.map((answer: any) => ({
            where: { questionId: answer.questionId },
            data: {
              selfScore: answer.selfScore,
              managerScore: answer.managerScore,
              selfComment: answer.selfComment,
              managerComment: answer.managerComment
            }
          }))
        }
      },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        evaluator: {
          select: {
            name: true
          }
        },
        template: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    })

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar avaliação' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.evaluation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Avaliação removida com sucesso' })
  } catch (error) {
    console.error('Erro ao remover avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao remover avaliação' },
      { status: 500 }
    )
  }
} 