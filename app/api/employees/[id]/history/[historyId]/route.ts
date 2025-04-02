import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; historyId: string }> }
) {
  const { id, historyId } = await params
  try {
    const body = await request.json()

    // Verifica se o funcionário existe
    const employee = await prisma.employee.findUnique({
      where: { id },
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    // Verifica se o registro de histórico existe
    const history = await prisma.employeeHistory.findUnique({
      where: { id: historyId },
    })

    if (!history) {
      return NextResponse.json(
        { error: "Registro de histórico não encontrado" },
        { status: 404 }
      )
    }

    // Verifica se o registro pertence ao funcionário
    if (history.employeeId !== id) {
      return NextResponse.json(
        { error: "Registro de histórico não pertence a este funcionário" },
        { status: 400 }
      )
    }

    // Atualiza o registro de histórico
    const updatedHistory = await prisma.employeeHistory.update({
      where: { id: historyId },
      data: {
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        positionLevelId: body.positionLevelId,
        departmentId: body.departmentId,
        shiftId: body.shiftId,
      },
    })

    return NextResponse.json(updatedHistory)
  } catch (error) {
    console.error("Erro ao atualizar registro de histórico:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar registro de histórico" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; historyId: string }> }
) {
  const { id, historyId } = await params
  try {
    // Verifica se o funcionário existe
    const employee = await prisma.employee.findUnique({
      where: { id },
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    // Verifica se o registro de histórico existe
    const history = await prisma.employeeHistory.findUnique({
      where: { id: historyId },
    })

    if (!history) {
      return NextResponse.json(
        { error: "Registro de histórico não encontrado" },
        { status: 404 }
      )
    }

    // Verifica se o registro pertence ao funcionário
    if (history.employeeId !== id) {
      return NextResponse.json(
        { error: "Registro de histórico não pertence a este funcionário" },
        { status: 400 }
      )
    }

    // Exclui o registro de histórico
    await prisma.employeeHistory.delete({
      where: { id: historyId },
    })

    return NextResponse.json({ message: "Registro de histórico excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir registro de histórico:", error)
    return NextResponse.json(
      { error: "Erro ao excluir registro de histórico" },
      { status: 500 }
    )
  }
} 