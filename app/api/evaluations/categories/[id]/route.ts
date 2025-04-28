import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/categories/[id] - Buscar categoria específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Verificar se a categoria existe
    const category = await prisma.evaluationcategory.findUnique({
      where: { id },
      include: {
        evaluationquestion: {
          orderBy: {
            text: 'asc'
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categoria', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/evaluations/categories/[id] - Atualizar categoria
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await request.json()
    const now = new Date()

    // Verificar se a categoria existe
    const existingCategory = await prisma.evaluationcategory.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    // Validar campos obrigatórios
    if (!data.name) {
      return NextResponse.json(
        { error: 'O nome da categoria é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.department || !data.position) {
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

    // Atualizar a categoria
    const updatedCategory = await prisma.evaluationcategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        department: data.department,
        position: data.position,
        updatedAt: now
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/evaluations/categories/[id] - Excluir categoria
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Verificar se a categoria existe
    const existingCategory = await prisma.evaluationcategory.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    // Excluir a categoria
    await prisma.evaluationcategory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Categoria excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir categoria', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 