import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const positionLevels = await prisma.positionLevel.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(positionLevels)
  } catch (error) {
    console.error("Erro ao buscar níveis de cargo:", error)
    return NextResponse.json(
      { error: "Erro ao buscar níveis de cargo" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, salary, positionId } = body

    const positionLevel = await prisma.positionLevel.create({
      data: {
        name,
        salary,
        positionId
      },
      include: {
        position: true
      }
    })

    return NextResponse.json(positionLevel)
  } catch (error) {
    console.error("Erro ao criar faixa de cargo:", error)
    return NextResponse.json(
      { error: "Erro ao criar faixa de cargo" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, salary } = body

    const positionLevel = await prisma.positionLevel.update({
      where: { id },
      data: {
        name,
        salary
      },
      include: {
        position: true
      }
    })

    return NextResponse.json(positionLevel)
  } catch (error) {
    console.error("Erro ao atualizar faixa de cargo:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar faixa de cargo" },
      { status: 500 }
    )
  }
}

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

    await prisma.positionLevel.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Faixa de cargo excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir faixa de cargo:", error)
    return NextResponse.json(
      { error: "Erro ao excluir faixa de cargo" },
      { status: 500 }
    )
  }
} 