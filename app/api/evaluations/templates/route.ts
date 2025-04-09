import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

// GET /api/evaluations/templates - Listar modelos de avaliação
export async function GET() {
  try {
    console.log('Iniciando busca de templates...')
    const templates = await prisma.evaluationtemplate.findMany({
      include: {
        questions: {
          include: {
            category: true
          }
        }
      }
    })
    console.log('Templates encontrados:', templates)
    
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
    console.log('Dados recebidos:', data)

    // Validar se há questões selecionadas
    if (!data.questions || data.questions.length === 0) {
      return NextResponse.json(
        { error: 'É necessário selecionar pelo menos uma questão' },
        { status: 400 }
      )
    }

    // Validar se todas as questões têm texto e categoria
    const validQuestions = data.questions.filter(
      (q: any) => q.text && q.text.trim() && q.categoryId
    )

    if (validQuestions.length === 0) {
      return NextResponse.json(
        { error: 'Todas as questões devem ter texto e categoria' },
        { status: 400 }
      )
    }

    console.log('Questões válidas:', validQuestions)

    const now = new Date()

    const template = await prisma.evaluationtemplate.create({
      data: {
        id: uuidv4(),
        name: data.name.trim(),
        description: data.description?.trim() || '',
        createdAt: now,
        updatedAt: now,
        questions: {
          create: validQuestions.map((q: any) => ({
            id: uuidv4(),
            text: q.text.trim(),
            categoryId: q.categoryId,
            createdAt: now,
            updatedAt: now
          }))
        }
      },
      include: {
        questions: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao criar modelo de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar modelo de avaliação' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 