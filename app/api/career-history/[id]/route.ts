import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const careerHistory = await prisma.employeehistory.findMany({
      where: {
        employeeId: id,
      },
      include: {
        positionlevel: true,
        department: true,
        shift: true
      },
      orderBy: {
        startDate: "desc",
      },
    })

    // Transforma o objeto para usar positionLevel em vez de positionlevel
    const transformedHistory = careerHistory.map(history => ({
      ...history,
      positionLevel: history.positionlevel,
      date: history.startDate,
      position: history.positionlevel?.name || "Sem nível definido",
      salary: history.positionlevel?.salary || 0,
      reason: "Mudança de cargo/departamento/turno"
    }))

    return NextResponse.json(transformedHistory)
  } catch (error) {
    console.error("Erro ao buscar histórico de carreira:", error)
    return NextResponse.json(
      { 
        error: "Erro ao buscar histórico de carreira",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 