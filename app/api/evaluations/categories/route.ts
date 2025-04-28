import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

// GET /api/evaluations/categories - Listar categorias
export async function GET() {
  try {
    console.log('Iniciando busca de categorias...')
    
    // Verificar conexão com o banco de dados
    await prisma.$connect()
    console.log('Conexão com o banco de dados estabelecida')
    
    const categories = await prisma.evaluationcategory.findMany({
      include: {
        evaluationquestion: {
          orderBy: {
            text: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log(`Categorias encontradas: ${categories.length}`)
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
    console.log('Conexão com o banco de dados encerrada')
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const now = new Date()
    
    // Validar campos obrigatórios
    if (!data.name) {
      return NextResponse.json(
        { error: 'O nome da categoria é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.department?.name || !data.position?.title) {
      return NextResponse.json(
        { error: 'Departamento e cargo são obrigatórios' },
        { status: 400 }
      )
    }

    if (!data.description) {
      return NextResponse.json(
        { error: 'A descrição é obrigatória' },
        { status: 400 }
      )
    }

    // Criar a categoria
    const category = await prisma.evaluationcategory.create({
      data: {
        id: randomUUID(),
        name: data.name,
        description: data.description,
        department: data.department.name,
        position: data.position.title,
        createdAt: now,
        updatedAt: now
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao criar categoria', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
} 