import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"
import { createId } from "@paralleldrive/cuid2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Função auxiliar para verificar o status do funcionário
async function getEmployeeStatus(employee: any) {
  // Se tiver data de demissão e a data for menor ou igual a hoje, está inativo
  if (employee.terminationDate && new Date(employee.terminationDate) <= new Date()) {
    return "INATIVO"
  }

  // Se tiver atestado médico ativo, está afastado
  if (employee.medicalleave && employee.medicalleave.length > 0) {
    return "AFASTADO"
  }

  // Se não tiver data de demissão nem atestado ativo, está ativo
  return "ATIVO"
}

// OPTIONS - Configuração CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET - Listar todos os funcionários
export async function GET(request: Request) {
  try {
    console.log("Iniciando busca de funcionários...")
    
    const employees = await prisma.employee.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        name: true,
        matricula: true,
        email: true,
        cpf: true,
        birthDate: true,
        hireDate: true,
        terminationDate: true,
        active: true,
        department: {
          select: {
            id: true,
            name: true
          }
        },
        position: {
          select: {
            id: true,
            title: true
          }
        },
        positionlevel: {
          select: {
            id: true,
            name: true
          }
        },
        shift: {
          select: {
            id: true,
            name: true
          }
        },
        medicalleave: {
          where: {
            status: "AFASTADO",
            endDate: {
              gte: new Date()
            }
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            reason: true,
            notes: true,
            days: true,
            doctor: true,
            hospital: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    console.log("Funcionários encontrados:", employees.length)

    // Processar o status de cada funcionário
    const employeesWithStatus = await Promise.all(
      employees.map(async (employee) => {
        try {
          const status = await getEmployeeStatus(employee)
          return {
            ...employee,
            status
          }
        } catch (error) {
          console.error("Erro ao processar status do funcionário:", employee.id, error)
          return {
            ...employee,
            status: "ATIVO" // Status padrão em caso de erro
          }
        }
      })
    )

    console.log("Funcionários processados com sucesso")
    return NextResponse.json(employeesWithStatus)
  } catch (error) {
    console.error("Erro detalhado ao buscar funcionários:", error)
    return NextResponse.json(
      { error: "Erro ao buscar funcionários", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}

// POST - Criar novo funcionário
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      positionId,
      departmentId,
      matricula,
      cpf,
      birthDate,
      hireDate,
      terminationDate,
      positionLevelId,
      shiftId,
      phone,
      address,
      active = true
    } = body

    // Verificar se a matrícula já existe para um funcionário ativo
    const existingMatricula = await prisma.employee.findFirst({
      where: {
        matricula,
        active: true
      }
    })

    if (existingMatricula) {
      return NextResponse.json(
        { error: "Já existe um funcionário ativo com esta matrícula" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Verificar se o email já existe para um funcionário ativo
    const existingEmail = await prisma.employee.findFirst({
      where: {
        email,
        active: true
      }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Este email já está cadastrado para outro funcionário" },
        { status: 400, headers: corsHeaders }
      )
    }

    const employee = await prisma.employee.create({
      data: {
        id: createId(),
        name,
        email,
        positionId,
        departmentId,
        matricula,
        cpf,
        birthDate: new Date(birthDate),
        hireDate: new Date(hireDate),
        terminationDate: terminationDate ? new Date(terminationDate) : null,
        positionLevelId: positionLevelId || null,
        shiftId: shiftId || null,
        phone: phone || null,
        address: address || null,
        active,
        userId: "system",
        updatedAt: new Date(),
        createdAt: new Date()
      },
    })

    // Criar histórico inicial
    await prisma.employeehistory.create({
      data: {
        id: createId(),
        employeeId: employee.id,
        departmentId,
        positionLevelId: positionLevelId || null,
        shiftId: shiftId || null,
        startDate: new Date(hireDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "system"
      }
    })

    return NextResponse.json(employee, { headers: corsHeaders })
  } catch (error) {
    console.error("Erro ao criar funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao criar funcionário" },
      { status: 500, headers: corsHeaders }
    )
  }
}

// PUT - Atualizar funcionário
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      email,
      positionId,
      departmentId,
      matricula,
      cpf,
      birthDate,
      hireDate,
      terminationDate,
      positionLevelId,
      shiftId,
      phone,
      address,
      active
    } = body

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        email,
        positionId,
        departmentId,
        matricula,
        cpf,
        birthDate: new Date(birthDate),
        hireDate: new Date(hireDate),
        terminationDate: terminationDate ? new Date(terminationDate) : null,
        positionLevelId: positionLevelId || null,
        shiftId: shiftId || null,
        phone: phone || null,
        address: address || null,
        active,
        userId: "system",
        updatedAt: new Date()
      },
    })

    return NextResponse.json(employee, { headers: corsHeaders })
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar funcionário" },
      { status: 500, headers: corsHeaders }
    )
  }
}

// DELETE - Excluir funcionário
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "ID do funcionário não fornecido" },
        { status: 400, headers: corsHeaders }
      )
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        active: false,
        userId: "system",
      },
    })

    return NextResponse.json(employee, { headers: corsHeaders })
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao excluir funcionário" },
      { status: 500, headers: corsHeaders }
    )
  }
} 