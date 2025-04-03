import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/templates/[id] - Buscar modelo de avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.evaluationTemplate.findUnique({
      where: {
        id: params.id
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Modelo de avaliação não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao buscar modelo de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar modelo de avaliação' },
      { status: 500 }
    )
  }
}

// PUT /api/evaluations/templates/[id] - Atualizar modelo de avaliação
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const template = await prisma.evaluationTemplate.update({
      where: {
        id: params.id
      },
      data: {
        name: data.name,
        description: data.description
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao atualizar modelo de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar modelo de avaliação' },
      { status: 500 }
    )
  }
}

// DELETE /api/evaluations/templates/[id] - Excluir modelo de avaliação
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se existem avaliações usando este modelo
    const evaluationsCount = await prisma.evaluation.count({
      where: {
        templateId: params.id
      }
    })

    if (evaluationsCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um modelo que possui avaliações associadas' },
        { status: 400 }
      )
    }

    await prisma.evaluationTemplate.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Modelo de avaliação excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir modelo de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir modelo de avaliação' },
      { status: 500 }
    )
  }
} 