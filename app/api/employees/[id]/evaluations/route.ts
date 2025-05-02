import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluations = await prisma.evaluation.findMany({
      where: {
        employeeId: params.id
      },
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

    const formattedEvaluations = evaluations.map((evaluation) => {
      // Calcular a média ponderada se tiver ambas as notas
      let finalScore = null
      if (evaluation.selfScore !== null && evaluation.managerScore !== null) {
        // Calcular a média ponderada usando 40% da autoavaliação e 60% da avaliação do gestor
        const weightedScore = (evaluation.selfScore * 0.4) + (evaluation.managerScore * 0.6)
        finalScore = Number(weightedScore.toFixed(1))
      }

      return {
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
        finalScore: finalScore,
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
      }
    })

    return NextResponse.json(formattedEvaluations)
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return NextResponse.json(
      { error: "Erro ao buscar avaliações" },
      { status: 500 }
    )
  }
} 