import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const position = await prisma.position.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
        positionLevels: true,
      },
    })

    if (!position) {
      return NextResponse.json(
        { error: "Cargo não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(position)
  } catch (error) {
    console.error("Erro ao buscar cargo:", error)
    return NextResponse.json(
      { error: "Erro ao buscar cargo" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { title, description, departmentId, positionLevels } = body

    // Validar campos obrigatórios
    if (!title || !departmentId) {
      return NextResponse.json(
        { error: "Título e departamento são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se já existe um cargo com o mesmo título no mesmo departamento
    const existingPosition = await prisma.position.findFirst({
      where: {
        title,
        departmentId,
        id: {
          not: id,
        },
      },
    })

    if (existingPosition) {
      return NextResponse.json(
        { error: "Já existe um cargo com este título neste departamento" },
        { status: 400 }
      )
    }

    // Atualizar o cargo e suas faixas
    const position = await prisma.position.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        departmentId,
        positionLevels: {
          deleteMany: {},
          create: positionLevels.map((level: any) => ({
            name: level.name,
            salary: level.salary,
          })),
        },
      },
      include: {
        department: true,
        positionLevels: true,
      },
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar cargo" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Verificar se existem funcionários vinculados ao cargo
    const employees = await prisma.employee.findFirst({
      where: {
        positionId: id,
      },
    })

    if (employees) {
      return NextResponse.json(
        { error: "Não é possível excluir um cargo que possui funcionários vinculados" },
        { status: 400 }
      )
    }

    await prisma.position.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Cargo excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir cargo:", error)
    return NextResponse.json(
      { error: "Erro ao excluir cargo" },
      { status: 500 }
    )
  }
} 