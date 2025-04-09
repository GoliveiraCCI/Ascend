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
    const body = await request.json()
    const { answers, type, strengths, improvements, goals } = body

    // Buscar a avaliação atual
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: params.id },
      include: { evaluationanswer: true }
    })

    if (!evaluation) {
      return NextResponse.json(
        { error: "Avaliação não encontrada" },
        { status: 404 }
      )
    }

    // Atualizar as respostas
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
      updateData.finalScore = (updateData.managerScore + evaluation.selfScore!) / 2
      updateData.status = "Concluída"
    }

    await prisma.evaluation.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ success: true })
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
    .filter(score => score !== null && score !== undefined)
  
  if (validScores.length === 0) return null
  
  const sum = validScores.reduce((a, b) => a + b, 0)
  return sum / validScores.length
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