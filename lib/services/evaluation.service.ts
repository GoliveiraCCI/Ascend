import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface EvaluationData {
  employeeId: string
  type: string
  template: string
  deadline: Date
  status: string
  notes?: string
  answers: {
    questionId: string
    selfScore?: number
    managerScore?: number
    selfComment?: string
    managerComment?: string
  }[]
  comments?: {
    selfStrengths?: string
    selfImprovements?: string
    selfGoals?: string
    managerStrengths?: string
    managerImprovements?: string
    managerGoals?: string
  }
}

export class EvaluationService {
  // Criar nova avaliação
  async createEvaluation(data: EvaluationData) {
    const evaluation = await prisma.evaluation.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        template: data.template,
        deadline: data.deadline,
        status: data.status,
        notes: data.notes,
        answers: {
          create: data.answers.map(answer => ({
            questionId: answer.questionId,
            selfScore: answer.selfScore,
            managerScore: answer.managerScore,
            selfComment: answer.selfComment,
            managerComment: answer.managerComment
          }))
        },
        comments: data.comments ? {
          create: {
            selfStrengths: data.comments.selfStrengths,
            selfImprovements: data.comments.selfImprovements,
            selfGoals: data.comments.selfGoals,
            managerStrengths: data.comments.managerStrengths,
            managerImprovements: data.comments.managerImprovements,
            managerGoals: data.comments.managerGoals
          }
        } : undefined
      },
      include: {
        answers: true,
        comments: true
      }
    })

    return evaluation
  }

  // Buscar avaliação por ID
  async getEvaluationById(id: string) {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      include: {
        employee: true,
        answers: {
          include: {
            question: {
              include: {
                category: true
              }
            }
          }
        },
        comments: true
      }
    })

    return evaluation
  }

  // Atualizar avaliação
  async updateEvaluation(id: string, data: Partial<EvaluationData>) {
    const evaluation = await prisma.evaluation.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        answers: {
          updateMany: data.answers?.map(answer => ({
            where: { questionId: answer.questionId },
            data: {
              selfScore: answer.selfScore,
              managerScore: answer.managerScore,
              selfComment: answer.selfComment,
              managerComment: answer.managerComment
            }
          }))
        },
        comments: data.comments ? {
          upsert: {
            create: {
              selfStrengths: data.comments.selfStrengths,
              selfImprovements: data.comments.selfImprovements,
              selfGoals: data.comments.selfGoals,
              managerStrengths: data.comments.managerStrengths,
              managerImprovements: data.comments.managerImprovements,
              managerGoals: data.comments.managerGoals
            },
            update: {
              selfStrengths: data.comments.selfStrengths,
              selfImprovements: data.comments.selfImprovements,
              selfGoals: data.comments.selfGoals,
              managerStrengths: data.comments.managerStrengths,
              managerImprovements: data.comments.managerImprovements,
              managerGoals: data.comments.managerGoals
            }
          }
        } : undefined
      },
      include: {
        answers: true,
        comments: true
      }
    })

    return evaluation
  }

  // Listar avaliações com filtros
  async listEvaluations(filters?: {
    employeeId?: string
    type?: string
    status?: string
    startDate?: Date
    endDate?: Date
  }) {
    const evaluations = await prisma.evaluation.findMany({
      where: {
        employeeId: filters?.employeeId,
        type: filters?.type,
        status: filters?.status,
        createdAt: {
          gte: filters?.startDate,
          lte: filters?.endDate
        }
      },
      include: {
        employee: true,
        answers: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return evaluations
  }

  // Calcular média de pontuação
  async calculateAverageScore(evaluationId: string, type: 'self' | 'manager') {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        answers: true
      }
    })

    if (!evaluation) return 0

    const scores = evaluation.answers
      .map(answer => type === 'self' ? answer.selfScore : answer.managerScore)
      .filter((score): score is number => score !== null)

    if (scores.length === 0) return 0

    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  // Calcular diferença média entre autoavaliação e avaliação do gestor
  async calculateScoreDifference(evaluationId: string) {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        answers: true
      }
    })

    if (!evaluation) return 0

    const differences = evaluation.answers
      .map(answer => {
        if (answer.selfScore === null || answer.managerScore === null) return null
        return Math.abs(answer.managerScore - answer.selfScore)
      })
      .filter((diff): diff is number => diff !== null)

    if (differences.length === 0) return 0

    return differences.reduce((sum, diff) => sum + diff, 0) / differences.length
  }

  // Buscar categorias de avaliação
  async getEvaluationCategories() {
    const categories = await prisma.evaluationCategory.findMany({
      include: {
        questions: true
      }
    })

    return categories
  }

  // Buscar questões por categoria
  async getQuestionsByCategory(categoryId: string) {
    const questions = await prisma.evaluationQuestion.findMany({
      where: { categoryId },
      include: {
        category: true
      }
    })

    return questions
  }
} 