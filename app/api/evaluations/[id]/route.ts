import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/evaluations/[id] - Buscar avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: params.id,
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
    const data = await request.json()
    const evaluationId = params.id

    // Atualizar a avaliação
    const evaluation = await prisma.evaluation.update({
      where: {
        id: evaluationId,
      },
      data: {
        employeeId: data.employeeId,
        evaluatorId: data.evaluatorId,
        templateId: data.templateId,
        status: data.status,
        // Atualizar os status baseado nas respostas
        selfEvaluationStatus: data.evaluationanswer.some(a => a.selfScore !== null) ? "Concluída" : "Pendente",
        managerEvaluationStatus: data.evaluationanswer.some(a => a.managerScore !== null) ? "Concluída" : "Pendente",
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
            expectedScore: answer.expectedScore || 0,
          },
        })
      }
    }

    // Buscar a avaliação atualizada com todos os relacionamentos
    const updatedEvaluation = await prisma.evaluation.findUnique({
      where: {
        id: evaluationId,
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