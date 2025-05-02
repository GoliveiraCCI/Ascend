import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLoggedUserId } from '@/lib/utils'

// GET /api/evaluations/[id] - Buscar avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id,
      },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
        user: true,
        evaluationtemplate: {
          include: {
            questions: {
              include: {
                category: true,
              },
            },
          },
        },
        evaluationanswer: {
          include: {
            evaluationquestion: {
              select: {
                id: true,
                text: true,
                category: true,
                expectedScore: true,
              },
            },
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
    const userId = await getLoggedUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id } = await params

    // Atualizar a avaliação
    const evaluation = await prisma.evaluation.update({
      where: {
        id,
      },
      data: {
        employee: {
          connect: { id: data.employeeId }
        },
        user: {
          connect: { id: userId }
        },
        evaluationtemplate: {
          connect: { id: data.templateId }
        },
        status: data.evaluationanswer.some(a => a.selfScore !== null || a.managerScore !== null) ? "CONCLUIDA" : "Pendente",
        selfEvaluationStatus: data.evaluationanswer.some(a => a.selfScore !== null) ? "CONCLUIDA" : "Pendente",
        managerEvaluationStatus: data.evaluationanswer.some(a => a.managerScore !== null) ? "CONCLUIDA" : "Pendente",
        selfStrengths: data.selfStrengths || "",
        selfImprovements: data.selfImprovements || "",
        selfGoals: data.selfGoals || "",
        selfScore: data.selfScore || 0,
        managerStrengths: data.managerStrengths || "",
        managerImprovements: data.managerImprovements || "",
        managerGoals: data.managerGoals || "",
        managerScore: data.managerScore || 0,
        finalScore: data.finalScore || 0,
      },
    })

    // Atualizar as respostas
    if (data.evaluationanswer && Array.isArray(data.evaluationanswer)) {
      for (const answer of data.evaluationanswer) {
        await prisma.evaluationanswer.update({
          where: {
            id: answer.id,
          },
          data: {
            selfScore: answer.selfScore || 0,
            managerScore: answer.managerScore || 0,
            selfComment: answer.selfComment || "",
            managerComment: answer.managerComment || "",
          },
        })
      }
    }

    // Buscar a avaliação atualizada com todos os relacionamentos
    const updatedEvaluation = await prisma.evaluation.findUnique({
      where: {
        id,
      },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
        user: true,
        evaluationtemplate: {
          include: {
            questions: {
              include: {
                category: true,
              },
            },
          },
        },
        evaluationanswer: {
          include: {
            evaluationquestion: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedEvaluation)
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