import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations - Listar avaliações
export async function GET() {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        employee: {
          select: {
            name: true,
            department: true,
            position: true,
          },
        },
        evaluator: {
          select: {
            name: true,
          },
        },
        template: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedEvaluations = evaluations.map(evaluation => ({
      id: evaluation.id,
      employeeName: evaluation.employee.name,
      employeeId: evaluation.employeeId,
      department: evaluation.employee.department,
      position: evaluation.employee.position,
      evaluator: evaluation.evaluator.name,
      date: evaluation.date.toISOString(),
      score: evaluation.score,
      status: evaluation.status,
      type: evaluation.type,
      selfEvaluationStatus: evaluation.selfEvaluationStatus,
      managerEvaluationStatus: evaluation.managerEvaluationStatus,
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
        selfEvaluation: data.selfEvaluation || false,
        managerEvaluation: data.managerEvaluation || false
      },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        evaluator: {
          select: {
            name: true
          }
        },
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