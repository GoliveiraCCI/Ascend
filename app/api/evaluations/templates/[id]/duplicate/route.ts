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
    const originalTemplate = await prisma.evaluationtemplate.findUnique({
      where: {
        id: params.id
      },
      include: {
        questions: true
      }
    })

    if (!originalTemplate) {
      return NextResponse.json(
        { error: 'Modelo de avaliação não encontrado' },
        { status: 404 }
      )
    }

    const duplicatedTemplate = await prisma.evaluationtemplate.create({
      data: {
        name: data.name || `${originalTemplate.name} (Cópia)`,
        description: data.description || originalTemplate.description,
        questions: {
          create: originalTemplate.questions.map(question => ({
            text: question.text,
            categoryId: question.categoryId
          }))
        }
      },
      include: {
        questions: true
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