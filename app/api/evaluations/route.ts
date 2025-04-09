import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/evaluations - Listar avaliações
export async function GET() {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        employee: {
          include: {
            department: true
          }
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

    const formattedEvaluations = evaluations.map((evaluation) => ({
      id: evaluation.id,
      employee: {
        id: evaluation.employee.id,
        name: evaluation.employee.name,
        matricula: evaluation.employee.matricula,
        department: {
          id: evaluation.employee.department.id,
          name: evaluation.employee.department.name
        }
      },
      evaluator: {
        id: evaluation.user.id,
        name: evaluation.user.name,
      },
      template: {
        id: evaluation.evaluationtemplate.id,
        name: evaluation.evaluationtemplate.name,
        description: evaluation.evaluationtemplate.description,
      },
      date: evaluation.date.toISOString(),
      status: evaluation.status,
      selfEvaluation: evaluation.selfEvaluation,
      selfEvaluationStatus: evaluation.selfEvaluationStatus,
      selfStrengths: evaluation.selfStrengths,
      selfImprovements: evaluation.selfImprovements,
      selfGoals: evaluation.selfGoals,
      selfScore: evaluation.selfScore,
      managerEvaluation: evaluation.managerEvaluation,
      managerEvaluationStatus: evaluation.managerEvaluationStatus,
      managerStrengths: evaluation.managerStrengths,
      managerImprovements: evaluation.managerImprovements,
      managerGoals: evaluation.managerGoals,
      managerScore: evaluation.managerScore,
      finalScore: evaluation.finalScore,
      answers: evaluation.evaluationanswer.map((answer) => ({
        id: answer.id,
        question: {
          id: answer.evaluationquestion.id,
          text: answer.evaluationquestion.text,
        },
        selfScore: answer.selfScore,
        selfComment: answer.selfComment,
        managerScore: answer.managerScore,
        managerComment: answer.managerComment,
      })),
    }))

    return NextResponse.json(formattedEvaluations)
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return NextResponse.json(
      { error: "Erro ao buscar avaliações" },
      { status: 500 }
    )
  }
}

// POST /api/evaluations - Criar nova avaliação
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { employeeId, evaluatorId, templateId, date, selfEvaluation, managerEvaluation } = body

    // Verificar se o template existe
    const template = await prisma.evaluationTemplate.findUnique({
      where: { id: templateId }
    })

    if (!template) {
      return NextResponse.json(
        { error: "Modelo de avaliação não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o funcionário e o avaliador existem
    const [employee, evaluator] = await Promise.all([
      prisma.employee.findUnique({ where: { id: employeeId } }),
      prisma.user.findUnique({ where: { id: evaluatorId } })
    ])

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    if (!evaluator) {
      return NextResponse.json(
        { error: "Avaliador não encontrado" },
        { status: 404 }
      )
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        employeeId,
        evaluatorId,
        templateId,
        date: new Date(date),
        status: "Pendente",
        selfEvaluation,
        selfEvaluationStatus: "Pendente",
        managerEvaluation,
        managerEvaluationStatus: "Pendente",
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

    // Criar notificações
    await prisma.notification.create({
      data: {
        userId: evaluatorId,
        type: "evaluation_pending",
        message: `Nova avaliação pendente: ${evaluation.template.name}`,
        evaluationId: evaluation.id,
      },
    })

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