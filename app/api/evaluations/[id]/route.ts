import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/evaluations/[id] - Buscar avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: id,
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        user: true,
        evaluationtemplate: true,
        evaluationanswer: {
          include: {
            evaluationquestion: true,
          },
        },
      },
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
    const id = await params.id
    const data = await request.json()

    const evaluation = await prisma.evaluation.update({
      where: {
        id: id,
      },
      data: {
        employeeId: data.employeeId,
        evaluatorId: data.evaluatorId,
        templateId: data.templateId,
        status: data.status,
        selfEvaluationStatus: data.selfEvaluationStatus,
        managerEvaluationStatus: data.managerEvaluationStatus,
        selfStrengths: data.selfStrengths,
        selfImprovements: data.selfImprovements,
        selfGoals: data.selfGoals,
        selfScore: data.selfScore,
        managerStrengths: data.managerStrengths,
        managerImprovements: data.managerImprovements,
        managerGoals: data.managerGoals,
        managerScore: data.managerScore,
        finalScore: data.finalScore,
        evaluationanswer: {
          updateMany: data.answers.map((answer: any) => ({
            where: {
              id: answer.id,
            },
            data: {
              selfScore: answer.selfScore,
              managerScore: answer.managerScore,
              selfComment: answer.selfComment,
              managerComment: answer.managerComment,
              expectedScore: answer.expectedScore,
            },
          })),
        },
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        evaluator: true,
        template: true,
        evaluationanswer: {
          include: {
            question: true,
          },
        },
      },
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
    const id = params.id

    // Primeiro excluir todas as respostas da avaliação
    await prisma.evaluationanswer.deleteMany({
      where: {
        evaluationId: id,
      },
    })

    // Depois excluir a avaliação
    await prisma.evaluation.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: 'Avaliação excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir avaliação' },
      { status: 500 }
    )
  }
} 