import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trainings = await prisma.training.findMany({
      where: {
        trainingparticipant: {
          some: {
            employeeId: params.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        source: true,
        startDate: true,
        endDate: true,
        hours: true,
        status: true,
        category: true,
        instructor: true,
        institution: true
      },
      orderBy: {
        startDate: "desc"
      }
    })

    if (!trainings) {
      return NextResponse.json(
        { error: "Nenhum treinamento encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(trainings)
  } catch (error) {
    console.error("Erro ao buscar treinamentos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar treinamentos do funcionário" },
      { status: 500 }
    )
  }
} 