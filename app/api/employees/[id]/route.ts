import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
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

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error)
    return NextResponse.json(
      { 
        error: "Erro ao buscar funcionário",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    
    // Validações básicas
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const cpf = formData.get("cpf") as string
    const birthDate = new Date(formData.get("birthDate") as string)
    const hireDate = new Date(formData.get("hireDate") as string)
    const departmentId = formData.get("department") as string
    const positionId = formData.get("position") as string
    const positionLevelId = formData.get("positionLevel") as string
    const shiftId = formData.get("shift") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    // Validações obrigatórias
    if (!name || !email || !cpf || !birthDate || !hireDate || 
        !departmentId || !positionId) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
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
        name,
        email,
        cpf,
        birthDate,
        hireDate,
        departmentId,
        positionId,
        positionLevelId: positionLevelId || null,
        shiftId: shiftId || null,
        phone: phone || null,
        address: address || null
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
    console.error("Erro ao atualizar funcionário:", error)
    return NextResponse.json(
      { 
        error: "Erro ao atualizar funcionário",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o funcionário existe
    const employee = await prisma.employee.findUnique({
      where: { id: params.id }
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Funcionário não encontrado" },
        { status: 404 }
      )
    }

    // Deletar o funcionário
    await prisma.employee.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Funcionário deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar funcionário:", error)
    return NextResponse.json(
      { 
        error: "Erro ao deletar funcionário",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 