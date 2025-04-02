import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    if (!employeeId) {
      return NextResponse.json(
        { error: "ID do funcionário não fornecido" },
        { status: 400 }
      )
    }

    const history = await prisma.employeeHistory.findMany({
      where: {
        employeeId
      },
      include: {
        positionLevel: {
          include: {
            position: true
          }
        },
        department: true,
        shift: true
      },
      orderBy: {
        startDate: "desc"
      }
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error("Erro ao buscar histórico do funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao buscar histórico do funcionário" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      positionLevelId,
      departmentId,
      shiftId,
      startDate
    } = body

    // Encerra o histórico atual se existir
    const currentHistory = await prisma.employeeHistory.findFirst({
      where: {
        employeeId,
        endDate: null
      }
    })

    if (currentHistory) {
      await prisma.employeeHistory.update({
        where: { id: currentHistory.id },
        data: {
          endDate: new Date(startDate)
        }
      })
    }

    // Cria novo registro de histórico
    const history = await prisma.employeeHistory.create({
      data: {
        employeeId,
        positionLevelId,
        departmentId,
        shiftId,
        startDate: new Date(startDate)
      },
      include: {
        positionLevel: {
          include: {
            position: true
          }
        },
        department: true,
        shift: true
      }
    })

    // Atualiza os dados atuais do funcionário
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        departmentId,
        positionId: positionLevelId && history.positionLevel ? history.positionLevel.positionId : undefined,
        positionLevelId,
        shiftId
      }
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error("Erro ao criar histórico do funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao criar histórico do funcionário" },
      { status: 500 }
    )
  }
} 