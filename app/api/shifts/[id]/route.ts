import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const shift = await prisma.shift.findUnique({
      where: {
        id,
      },
    })

    if (!shift) {
      return NextResponse.json(
        { error: "Turno não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(shift)
  } catch (error) {
    console.error("Erro ao buscar turno:", error)
    return NextResponse.json(
      { error: "Erro ao buscar turno" },
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
    const data = await request.json()
    const shift = await prisma.shift.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        updatedAt: new Date()
      },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await prisma.shift.delete({
      where: {
        id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Erro ao excluir turno:", error)
    return NextResponse.json(
      { error: "Erro ao excluir turno" },
      { status: 500 }
    )
  }
} 