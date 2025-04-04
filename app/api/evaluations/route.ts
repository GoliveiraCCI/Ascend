import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations - Listar avaliações
export async function GET() {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        evaluator: true,
        template: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    const formattedEvaluations = evaluations.map((evaluation) => ({
      id: evaluation.id,
      date: evaluation.date,
      status: evaluation.status === "COMPLETED" ? "Finalizado" : 
             evaluation.status === "IN_PROGRESS" ? "Em Progresso" : "Pendente",
      score: evaluation.score,
      selfEvaluationStatus: evaluation.selfEvaluationStatus === "COMPLETED" ? "Finalizado" : 
                            evaluation.selfEvaluationStatus === "IN_PROGRESS" ? "Em Progresso" : "Pendente",
      managerEvaluationStatus: evaluation.managerEvaluationStatus === "COMPLETED" ? "Finalizado" : 
                              evaluation.managerEvaluationStatus === "IN_PROGRESS" ? "Em Progresso" : "Pendente",
      employee: {
        name: evaluation.employee.name,
        matricula: evaluation.employee.matricula,
        department: evaluation.employee.department.name,
      },
      evaluator: {
        name: evaluation.evaluator.name,
      },
      template: {
        id: evaluation.template.id,
        name: evaluation.template.name,
        description: evaluation.template.description
      }
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
    const data = await request.json()
    
    const evaluation = await prisma.evaluation.create({
      data: {
        employeeId: data.employeeId,
        evaluatorId: data.evaluatorId,
        templateId: data.templateId,
        date: new Date(),
        status: 'Pendente',
        selfEvaluationStatus: 'Pendente',
        managerEvaluationStatus: 'Pendente'
      },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        evaluator: true,
        template: true
      }
    })

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar avaliação' },
      { status: 500 }
    )
  }
} 