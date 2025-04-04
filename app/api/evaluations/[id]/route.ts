import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/evaluations/[id] - Buscar avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: params.id },
      include: {
        employee: true,
        evaluator: true,
        template: {
          include: {
            questions: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    })

    if (!evaluation) {
      return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 })
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
    const body = await request.json()
    const { answers, selfStrengths, selfImprovements, selfGoals, managerStrengths, managerImprovements, managerGoals } = body

    // Busca a avaliação atual
    const currentEvaluation = await prisma.evaluation.findUnique({
      where: { id: params.id },
      include: {
        answers: true,
        employee: true,
        evaluator: true,
      },
    })

    if (!currentEvaluation) {
      return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 })
    }

    // Atualiza as respostas
    const updatedAnswers = await Promise.all(
      answers.map(async (answer: any) => {
        return prisma.evaluationAnswer.upsert({
          where: {
            id: answer.id || "",
          },
          update: {
            selfScore: answer.selfScore,
            selfComment: answer.selfComment,
            managerScore: answer.managerScore,
            managerComment: answer.managerComment,
          },
          create: {
            evaluationId: params.id,
            questionId: answer.questionId,
            selfScore: answer.selfScore,
            selfComment: answer.selfComment,
            managerScore: answer.managerScore,
            managerComment: answer.managerComment,
          },
        })
      })
    )

    // Calcula as pontuações médias
    const selfScores = updatedAnswers
      .filter((answer) => answer.selfScore !== null)
      .map((answer) => answer.selfScore)
    const managerScores = updatedAnswers
      .filter((answer) => answer.managerScore !== null)
      .map((answer) => answer.managerScore)

    const selfScore = selfScores.length > 0
      ? selfScores.reduce((a, b) => a + b, 0) / selfScores.length
      : null
    const managerScore = managerScores.length > 0
      ? managerScores.reduce((a, b) => a + b, 0) / managerScores.length
      : null

    // Calcula a pontuação final (média ponderada: 30% autoavaliação, 70% avaliação do gestor)
    const finalScore = selfScore !== null && managerScore !== null
      ? (selfScore * 0.3) + (managerScore * 0.7)
      : null

    // Verifica se houve mudança de status
    const wasSelfPending = currentEvaluation.selfEvaluationStatus === "Pendente"
    const wasManagerPending = currentEvaluation.managerEvaluationStatus === "Pendente"
    const isSelfCompleted = selfScore !== null
    const isManagerCompleted = managerScore !== null

    // Atualiza a avaliação
    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: params.id },
      data: {
        selfStrengths,
        selfImprovements,
        selfGoals,
        managerStrengths,
        managerImprovements,
        managerGoals,
        selfScore,
        managerScore,
        finalScore,
        selfEvaluationDate: isSelfCompleted ? new Date() : null,
        managerEvaluationDate: isManagerCompleted ? new Date() : null,
        selfEvaluationStatus: isSelfCompleted ? "Finalizado" : "Pendente",
        managerEvaluationStatus: isManagerCompleted ? "Finalizado" : "Pendente",
      },
      include: {
        employee: true,
        evaluator: true,
        template: {
          include: {
            questions: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    })

    // Criar notificações se houver mudança de status
    if (wasSelfPending && isSelfCompleted) {
      await prisma.notification.create({
        data: {
          userId: currentEvaluation.evaluatorId,
          type: "evaluation_completed",
          message: `Autoavaliação finalizada: ${currentEvaluation.employee.name}`,
          evaluationId: params.id,
        },
      })
    }

    if (wasManagerPending && isManagerCompleted) {
      await prisma.notification.create({
        data: {
          userId: currentEvaluation.employeeId,
          type: "evaluation_completed",
          message: `Avaliação do gestor finalizada`,
          evaluationId: params.id,
        },
      })
    }

    return NextResponse.json(updatedEvaluation)
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error)
    return NextResponse.json({ error: "Erro ao atualizar avaliação" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.evaluation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Avaliação excluída com sucesso" })
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir avaliação' },
      { status: 500 }
    )
  }
} 