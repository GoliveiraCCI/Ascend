import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    const medicalLeaves = await prisma.medicalleave.findMany({
      where: {
        employeeId: id,
      },
      orderBy: {
        startDate: "desc",
      },
      take: limit,
      include: {
        medicalleavecategory: true,
        file: true,
      },
    })

    return NextResponse.json(medicalLeaves)
  } catch (error) {
    console.error("Erro ao buscar atestados:", error)
    return NextResponse.json(
      { error: "Erro ao buscar atestados", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
} 