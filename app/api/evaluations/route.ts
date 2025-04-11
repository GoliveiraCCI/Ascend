import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// GET /api/evaluations - Listar avaliações
export async function GET(request: Request) {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            matricula: true,
            department: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        },
        evaluationtemplate: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        evaluationanswer: {
          include: {
            evaluationquestion: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
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
      answers: evaluation.evaluationanswer?.map((answer) => ({
        id: answer.id,
        question: {
          id: answer.evaluationquestion.id,
          text: answer.evaluationquestion.text,
        },
        selfScore: answer.selfScore,
        selfComment: answer.selfComment,
        managerScore: answer.managerScore,
        managerComment: answer.managerComment,
      })) || []
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
    const template = await prisma.evaluationtemplate.findUnique({
      where: { id: templateId },
      include: {
        questions: {
          include: {
            category: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: "Template não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o funcionário existe
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o avaliador existe
    const evaluator = await prisma.user.findUnique({
      where: { id: evaluatorId }
    })

    if (!evaluator) {
      return NextResponse.json(
        { error: "Avaliador não encontrado" },
        { status: 404 }
      )
    }

    // Criar a avaliação
    const evaluation = await prisma.evaluation.create({
      data: {
        id: crypto.randomUUID(),
        employeeId,
        evaluatorId,
        templateId,
        date: new Date(),
        status: "Pendente",
        selfEvaluation: false,
        selfEvaluationStatus: "Pendente",
        managerEvaluation: false,
        managerEvaluationStatus: "Pendente",
        updatedAt: new Date()
      }
    })

    // Criar as respostas para cada questão do template
    const answers = await Promise.all(
      template.questions.map(async (question) => {
        return prisma.evaluationanswer.create({
          data: {
            id: crypto.randomUUID(),
            evaluationId: evaluation.id,
            questionId: question.id,
            selfScore: null,
            managerScore: null,
            selfComment: null,
            managerComment: null,
            updatedAt: new Date()
          }
        })
      })
    )

    return NextResponse.json({
      ...evaluation,
      answers
    })
  } catch (error) {
    console.error("Erro ao criar avaliação:", error)
    return NextResponse.json({ error: "Erro ao criar avaliação" }, { status: 500 })
  }
} 