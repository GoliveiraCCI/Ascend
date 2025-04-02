import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const positionLevels = await prisma.positionLevel.findMany({
      where: {
        positionId: id,
      },
      orderBy: {
        salary: 'asc',
      },
      include: {
        position: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(positionLevels)
  } catch (error) {
    console.error("Erro ao buscar faixas de cargo:", error)
    return NextResponse.json(
      { error: "Erro ao buscar faixas de cargo" },
      { status: 500 }
    )
  }
} 