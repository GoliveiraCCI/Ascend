import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    
    // Validações básicas
    const departmentId = formData.get("department") as string
    const positionId = formData.get("position") as string
    const positionLevelId = formData.get("positionLevel") as string
    const shiftId = formData.get("shift") as string

    // Validações obrigatórias
    if (!departmentId || !positionId) {
      return NextResponse.json(
        { error: "Departamento e cargo são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se o departamento existe
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })

    if (!department) {
      return NextResponse.json(
        { error: "Departamento não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o cargo existe
    const position = await prisma.position.findUnique({
      where: { id: positionId }
    })

    if (!position) {
      return NextResponse.json(
        { error: "Cargo não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o nível do cargo existe (se fornecido)
    if (positionLevelId) {
      const positionLevel = await prisma.positionLevel.findUnique({
        where: { id: positionLevelId }
      })

      if (!positionLevel) {
        return NextResponse.json(
          { error: "Nível do cargo não encontrado" },
          { status: 404 }
        )
      }
    }

    // Verificar se o turno existe (se fornecido)
    if (shiftId) {
      const shift = await prisma.shift.findUnique({
        where: { id: shiftId }
      })

      if (!shift) {
        return NextResponse.json(
          { error: "Turno não encontrado" },
          { status: 404 }
        )
      }
    }

    // Buscar o funcionário atual
    const currentEmployee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        history: {
          orderBy: {
            startDate: "desc"
          }
        }
      }
    })

    if (!currentEmployee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se houve mudança de departamento, cargo ou turno
    const lastHistory = currentEmployee.history[0]
    const hasDepartmentChange = lastHistory?.departmentId !== departmentId
    const hasPositionChange = lastHistory?.positionLevelId !== positionLevelId
    const hasShiftChange = lastHistory?.shiftId !== shiftId

    // Atualizar o funcionário
    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        departmentId,
        positionId,
        positionLevelId: positionLevelId || null,
        shiftId: shiftId || null
      },
      include: {
        department: true,
        position: true,
        positionLevel: true,
        shift: true,
        history: {
          include: {
            positionLevel: true,
            department: true,
            shift: true
          },
          orderBy: {
            startDate: "desc"
          }
        }
      }
    })

    // Se houver mudanças, criar novo histórico
    if (hasDepartmentChange || hasPositionChange || hasShiftChange) {
      await prisma.employeeHistory.create({
        data: {
          employeeId: params.id,
          departmentId,
          positionLevelId: positionLevelId || null,
          shiftId: shiftId || null,
          startDate: new Date()
        }
      })
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Erro ao atualizar cargo do funcionário:", error)
    return NextResponse.json(
      { 
        error: "Erro ao atualizar cargo do funcionário",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 