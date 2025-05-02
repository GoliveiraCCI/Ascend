import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"
import { getLoggedUserId } from "@/lib/utils"

// GET - Listar todos os turnos
export async function GET() {
  try {
    const shifts = await prisma.shift.findMany({
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(shifts)
  } catch (error) {
    console.error("Erro ao buscar turnos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar turnos" },
      { status: 500 }
    )
  }
}

// POST - Criar novo turno
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    // Validar campos obrigatórios
    if (!name) {
      return NextResponse.json(
        { error: "O nome do turno é obrigatório" },
        { status: 400 }
      )
    }

    // Obter o ID do usuário logado
    const userId = await getLoggedUserId()
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      )
    }

    const shift = await prisma.shift.create({
      data: {
        id: randomUUID(),
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId
      }
    })

    return NextResponse.json(shift)
  } catch (error) {
    console.error("Erro ao criar turno:", error)
    return NextResponse.json(
      { error: "Erro ao criar turno" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar turno
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, description } = body

    const shift = await prisma.shift.update({
      where: { id },
      data: {
        name,
        description,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(shift)
  } catch (error) {
    console.error("Erro ao atualizar turno:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar turno" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir turno
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      )
    }

    await prisma.shift.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Turno excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir turno:", error)
    return NextResponse.json(
      { error: "Erro ao excluir turno" },
      { status: 500 }
    )
  }
} 