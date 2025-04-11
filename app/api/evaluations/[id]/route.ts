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
      where: {
        id: params.id,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            matricula: true,
            department: true,
          },
        },
        user: true,
        evaluationtemplate: {
          include: {
            questions: {
              include: {
                category: true,
              },
              orderBy: {
                category: {
                  name: 'asc'
                }
              }
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

    if (!evaluation) {
      return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 })
    }

    // Garantir que todas as questões do template tenham uma resposta
    const templateQuestions = evaluation.evaluationtemplate.questions
    const existingAnswers = evaluation.evaluationanswer.map(answer => answer.evaluationquestion.id)
    
    // Criar respostas vazias para questões que ainda não têm resposta
    const missingQuestions = templateQuestions.filter(
      question => !existingAnswers.includes(question.id)
    )

    if (missingQuestions.length > 0) {
      const newAnswers = await Promise.all(
        missingQuestions.map(question =>
          prisma.evaluationanswer.create({
            data: {
              evaluationId: evaluation.id,
              questionId: question.id,
              selfScore: null,
              managerScore: null,
              selfComment: null,
              managerComment: null
            },
            include: {
              evaluationquestion: {
                include: {
                  category: true,
                },
              },
            },
          })
        )
      )

      evaluation.evaluationanswer = [...evaluation.evaluationanswer, ...newAnswers]
    }

    // Ordenar as respostas pela categoria da questão
    evaluation.evaluationanswer.sort((a, b) => 
      a.evaluationquestion.category.name.localeCompare(b.evaluationquestion.category.name)
    )

    // Garantir que as questões do template estejam ordenadas por categoria
    evaluation.evaluationtemplate.questions.sort((a, b) => 
      a.category.name.localeCompare(b.category.name)
    )

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error)
    return NextResponse.json(
      { error: "Erro ao buscar avaliação" },
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
    const evaluationId = params.id
    const body = await request.json()
    const { answers, type, strengths, improvements, goals } = body

    // Validar os dados recebidos
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Dados de respostas inválidos" },
        { status: 400 }
      )
    }

    if (!type || (type !== "self" && type !== "manager")) {
      return NextResponse.json(
        { error: "Tipo de avaliação inválido" },
        { status: 400 }
      )
    }

    // Buscar a avaliação atual
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: { 
        evaluationanswer: true,
        employee: true,
        user: true
      }
    })

    if (!evaluation) {
      return NextResponse.json(
        { error: "Avaliação não encontrada" },
        { status: 404 }
      )
    }

    // Atualizar cada resposta individualmente
    for (const answer of answers) {
      await prisma.evaluationanswer.update({
        where: { id: answer.id },
        data: {
          ...(type === "self" ? {
            selfScore: answer.score,
            selfComment: answer.comment
          } : {
            managerScore: answer.score,
            managerComment: answer.comment
          })
        }
      })
    }

    // Atualizar o status e os campos gerais
    const updateData: any = {
      ...(type === "self" ? {
        selfEvaluationStatus: "Concluída",
        selfStrengths: strengths,
        selfImprovements: improvements,
        selfGoals: goals,
        selfScore: calculateAverageScore(answers),
        selfEvaluationDate: new Date()
      } : {
        managerEvaluationStatus: "Concluída",
        managerStrengths: strengths,
        managerImprovements: improvements,
        managerGoals: goals,
        managerScore: calculateAverageScore(answers),
        managerEvaluationDate: new Date()
      })
    }

    // Se ambas as avaliações estiverem concluídas, calcular a pontuação final
    if (type === "manager" && evaluation.selfEvaluationStatus === "Concluída") {
      const selfScore = evaluation.selfScore || 0
      const managerScore = updateData.managerScore || 0
      // Peso maior para a avaliação do gestor (60% gestor, 40% autoavaliação)
      updateData.finalScore = Number(((managerScore * 0.6) + (selfScore * 0.4)).toFixed(1))
      updateData.status = "Concluída"
    }

    // Atualizar a avaliação
    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: updateData,
      include: {
        employee: {
          include: {
            department: true,
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
    console.error("Erro ao atualizar avaliação:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar avaliação" },
      { status: 500 }
    )
  }
}

function calculateAverageScore(answers: any[]) {
  const validScores = answers
    .map(a => a.score)
    .filter(score => score !== null && score !== undefined && !isNaN(score))
  
  if (validScores.length === 0) return null
  
  const sum = validScores.reduce((a, b) => a + b, 0)
  return Number((sum / validScores.length).toFixed(1))
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Primeiro, excluir todas as respostas da avaliação
    await prisma.evaluationanswer.deleteMany({
      where: { evaluationId: params.id }
    })

    // Depois, excluir a avaliação
    await prisma.evaluation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Avaliação excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error)
    return NextResponse.json(
      { error: "Erro ao excluir avaliação" },
      { status: 500 }
    )
  }
} 