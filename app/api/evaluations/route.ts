import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations - Listar avaliações
export async function GET() {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        employee: true,
        evaluator: true,
        template: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    })

    const formattedEvaluations = evaluations.map((evaluation) => ({
      id: evaluation.id,
      employee: {
        id: evaluation.employee.id,
        name: evaluation.employee.name,
        matricula: evaluation.employee.matricula,
      },
      evaluator: {
        id: evaluation.evaluator.id,
        name: evaluation.evaluator.name,
      },
      template: {
        id: evaluation.template.id,
        name: evaluation.template.name,
        description: evaluation.template.description,
      },
      date: evaluation.date,
      status: evaluation.status,
      selfEvaluation: evaluation.selfEvaluation,
      selfEvaluationStatus: evaluation.selfEvaluationStatus,
      selfStrengths: evaluation.selfStrengths,
      selfImprovements: evaluation.selfImprovements,
      selfGoals: evaluation.selfGoals,
      selfScore: evaluation.selfScore,
      selfEvaluationDate: evaluation.selfEvaluationDate,
      managerEvaluation: evaluation.managerEvaluation,
      managerEvaluationStatus: evaluation.managerEvaluationStatus,
      managerStrengths: evaluation.managerStrengths,
      managerImprovements: evaluation.managerImprovements,
      managerGoals: evaluation.managerGoals,
      managerScore: evaluation.managerScore,
      managerEvaluationDate: evaluation.managerEvaluationDate,
      finalScore: evaluation.finalScore,
      answers: evaluation.answers.map((answer) => ({
        id: answer.id,
        question: {
          id: answer.question.id,
          text: answer.question.text,
        },
        selfScore: answer.selfScore,
        managerScore: answer.managerScore,
        selfComment: answer.selfComment,
        managerComment: answer.managerComment,
      })),
    }))

    return NextResponse.json(formattedEvaluations)
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliações' },
      { status: 500 }
    )
  }
}

// POST /api/evaluations - Criar nova avaliação
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { employeeId, evaluatorId, templateId } = body

    const evaluation = await prisma.evaluation.create({
      data: {
        employeeId,
        evaluatorId,
        templateId,
      },
      include: {
        employee: true,
        evaluator: true,
        template: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })

    // Criar notificação para o funcionário
    await prisma.notification.create({
      data: {
        userId: employeeId,
        type: "evaluation_pending",
        message: `Nova avaliação pendente: ${evaluation.template.name}`,
        evaluationId: evaluation.id,
      },
    })

    // Criar notificação para o gestor
    await prisma.notification.create({
      data: {
        userId: evaluatorId,
        type: "evaluation_pending",
        message: `Nova avaliação pendente: ${evaluation.template.name} - ${evaluation.employee.name}`,
        evaluationId: evaluation.id,
      },
    })

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Erro ao criar avaliação:", error)
    return NextResponse.json({ error: "Erro ao criar avaliação" }, { status: 500 })
  }
} 