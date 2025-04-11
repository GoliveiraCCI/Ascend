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
      include: {
        department: true,
        trainingparticipant: {
          where: {
            employeeId: params.id
          },
          include: {
            employee: true
          }
        },
        trainingevaluation: true,
        trainingmaterial: true,
        trainingsession: true,
        trainingphoto: true
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