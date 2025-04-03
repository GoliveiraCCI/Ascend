import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/templates - Listar modelos de avaliação
export async function GET() {
  try {
    const templates = await prisma.evaluationTemplate.findMany({
      include: {
        _count: {
          select: {
            evaluations: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Erro ao listar modelos de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao listar modelos de avaliação' },
      { status: 500 }
    )
  }
}

// POST /api/evaluations/templates - Criar novo modelo de avaliação
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const template = await prisma.evaluationTemplate.create({
      data: {
        name: data.name,
        description: data.description
      }
    })
    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao criar modelo de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar modelo de avaliação' },
      { status: 500 }
    )
  }
} 