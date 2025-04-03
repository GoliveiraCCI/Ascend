import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/categories - Listar categorias
export async function GET() {
  try {
    const categories = await prisma.evaluationCategory.findMany({
      include: {
        questions: {
          orderBy: {
            text: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const category = await prisma.evaluationCategory.create({
      data: {
        name: data.name,
        description: data.description
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
} 