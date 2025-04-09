import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

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
    
    // Se não houver categorias, criar algumas categorias padrão
    if (categories.length === 0) {
      console.log('Nenhuma categoria encontrada. Criando categorias padrão...')
      
      const defaultCategories = [
        { name: 'Desempenho Técnico', description: 'Avaliação das habilidades técnicas do funcionário' },
        { name: 'Comunicação', description: 'Avaliação das habilidades de comunicação' },
        { name: 'Trabalho em Equipe', description: 'Avaliação da capacidade de trabalhar em equipe' },
        { name: 'Liderança', description: 'Avaliação das habilidades de liderança' },
        { name: 'Iniciativa', description: 'Avaliação da proatividade e iniciativa do funcionário' }
      ]
      
      for (const category of defaultCategories) {
        await prisma.evaluationcategory.create({
          data: category
        })
      }
      
      console.log('Categorias padrão criadas com sucesso')
      
      // Buscar as categorias novamente
      const newCategories = await prisma.evaluationcategory.findMany({
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
      
      return NextResponse.json(newCategories)
    }

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
    
    const category = await prisma.evaluationcategory.create({
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