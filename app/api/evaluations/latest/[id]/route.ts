import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        employeeId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        evaluationanswer: {
          include: {
            evaluationquestion: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!evaluation) {
      return NextResponse.json(null)
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Erro ao buscar última avaliação:", error)
    return NextResponse.json(
      { error: "Erro ao buscar última avaliação" },
      { status: 500 }
    )
  }
} 