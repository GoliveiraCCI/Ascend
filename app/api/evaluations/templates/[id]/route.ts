import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/evaluations/templates/[id] - Buscar modelo de avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.evaluationtemplate.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: {
            category: true
          }
        },
        evaluation: {
          include: {
            employee: {
              include: {
                department: true
              }
            }
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao buscar template:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar template' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/evaluations/templates/[id] - Excluir modelo de avaliação
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.evaluationtemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Erro ao excluir modelo de avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir modelo de avaliação' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 