import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        history: {
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
            startDate: 'desc'
          }
        }
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(employee.history)
  } catch (error) {
    console.error("Erro ao buscar histórico:", error)
    return NextResponse.json(
      { error: "Erro ao buscar histórico do funcionário" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const {
      startDate,
      endDate,
      positionLevelId,
      departmentId,
      shiftId
    } = body

    // Verificar se o funcionário existe
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    // Buscar o último registro de histórico sem data fim
    const lastHistory = await prisma.employeeHistory.findFirst({
      where: {
        employeeId: id,
        endDate: null
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    // Se existir um registro anterior sem data fim, atualiza com a data de início do novo registro
    if (lastHistory) {
      await prisma.employeeHistory.update({
        where: { id: lastHistory.id },
        data: {
          endDate: new Date(startDate)
        }
      })
    }

    // Criar novo registro de histórico
    const history = await prisma.employeeHistory.create({
      data: {
        employeeId: id,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        positionLevelId,
        departmentId,
        shiftId,
      },
      include: {
        department: true,
        positionLevel: {
          include: {
            position: true
          }
        },
        shift: true,
      }
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error("Erro ao criar registro de histórico:", error)
    return NextResponse.json(
      { error: "Erro ao criar registro de histórico" },
      { status: 500 }
    )
  }
} 