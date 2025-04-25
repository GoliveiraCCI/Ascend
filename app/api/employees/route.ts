import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"
import { createId } from "@paralleldrive/cuid2"
import { randomUUID } from "crypto"

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
      include: {
        department: true,
        position: true,
        positionlevel: true,
        shift: true,
        user: true
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
        name: body.name,
        matricula: body.matricula,
        email: body.email,
        cpf: body.cpf,
        birthDate: new Date(body.birthDate).toISOString(),
        hireDate: new Date(body.hireDate).toISOString(),
        departmentId: body.departmentId,
        positionId: body.positionId,
        positionLevelId: body.positionLevelId,
        shiftId: body.shiftId,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Criar histórico inicial
    await prisma.employeehistory.create({
      data: {
        id: createId(),
        employeeId: employee.id,
        departmentId,
        positionLevelId: positionLevelId || null,
        shiftId: shiftId || null,
        startDate: new Date(body.hireDate).toISOString(),
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

    const updatedEmployee = await prisma.employee.update({
      where: {
        id: id
      },
      data: {
        name: name,
        matricula: matricula,
        email: email,
        cpf: cpf,
        birthDate: birthDate,
        hireDate: hireDate,
        terminationDate: terminationDate,
        departmentId: departmentId,
        positionId: positionId,
        positionLevelId: positionLevelId,
        shiftId: shiftId,
        phone: phone,
        address: address,
        active: active,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedEmployee, { headers: corsHeaders })
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

    const employee = await prisma.employee.delete({
      where: {
        id: id
      }
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