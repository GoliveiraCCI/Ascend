import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: "Departamento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error('Erro ao buscar departamento:', error)
    return NextResponse.json(
      { error: "Erro ao buscar departamento" },
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
    const { name, code, description } = body

    // Validar campos obrigatórios
    if (!name || !code) {
      return NextResponse.json(
        { error: "Nome e código do departamento são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se já existe um departamento com o mesmo nome (exceto o atual)
    const existingName = await prisma.department.findFirst({
      where: {
        name,
        NOT: {
          id,
        },
      },
    })

    if (existingName) {
      return NextResponse.json(
        { error: "Já existe um departamento com este nome" },
        { status: 400 }
      )
    }

    // Verificar se já existe um departamento com o mesmo código (exceto o atual)
    const existingCode = await prisma.department.findFirst({
      where: {
        code,
        NOT: {
          id,
        },
      },
    })

    if (existingCode) {
      return NextResponse.json(
        { error: "Já existe um departamento com este código" },
        { status: 400 }
      )
    }

    // Atualizar o departamento
    const department = await prisma.department.update({
      where: {
        id,
      },
      data: {
        name,
        code,
        description,
      },
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error('Erro ao atualizar departamento:', error)
    return NextResponse.json(
      { error: "Erro ao atualizar departamento" },
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
    // Verificar se o departamento existe
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        positions: true,
        employees: true,
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: "Departamento não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se existem cargos ou funcionários vinculados ao departamento
    if (department.positions.length > 0 || department.employees.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir um departamento que possui cargos ou funcionários vinculados" },
        { status: 400 }
      )
    }

    // Excluir o departamento
    await prisma.department.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Departamento excluído com sucesso" })
  } catch (error) {
    console.error('Erro ao excluir departamento:', error)
    return NextResponse.json(
      { error: "Erro ao excluir departamento" },
      { status: 500 }
    )
  }
} 