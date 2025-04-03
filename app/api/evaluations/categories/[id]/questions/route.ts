import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/categories/[id]/questions - Listar questões por categoria
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await prisma.evaluationQuestion.findMany({
      where: {
        categoryId: params.id
      },
      orderBy: {
        text: 'asc'
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Erro ao buscar questões:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar questões' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const question = await prisma.evaluationQuestion.create({
      data: {
        categoryId: params.id,
        text: data.text
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Erro ao criar questão:', error)
    return NextResponse.json(
      { error: 'Erro ao criar questão' },
      { status: 500 }
    )
  }
} 