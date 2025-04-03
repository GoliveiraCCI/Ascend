import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/evaluations/templates/[id]/duplicate - Duplicar modelo de avaliação
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const originalTemplate = await prisma.evaluationTemplate.findUnique({
      where: {
        id: params.id
      }
    })

    if (!originalTemplate) {
      return NextResponse.json(
        { error: 'Modelo de avaliação não encontrado' },
        { status: 404 }
      )
    }

    const duplicatedTemplate = await prisma.evaluationTemplate.create({
      data: {
        name: data.name || `${originalTemplate.name} (Cópia)`,
        description: data.description || originalTemplate.description
      }
    })

    return NextResponse.json(duplicatedTemplate)
  } catch (error) {
    console.error('Erro ao duplicar modelo de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao duplicar modelo de avaliação' },
      { status: 500 }
    )
  }
} 