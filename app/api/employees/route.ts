import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"
import { createId } from "@paralleldrive/cuid2"
import { randomUUID } from "crypto"
import { getLoggedUserId } from "@/lib/utils"

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
  const today = new Date()
  const hasActiveMedicalLeave = employee.medicalleave?.some(leave => {
    const startDate = new Date(leave.startDate)
    const endDate = leave.endDate ? new Date(leave.endDate) : null
    return startDate <= today && (!endDate || endDate >= today)
  })

  if (hasActiveMedicalLeave) {
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
        user: true,
        medicalleave: true
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
      matricula, 
      email, 
      cpf, 
      birthDate, 
      hireDate, 
      departmentId, 
      positionId, 
      positionLevelId, 
      shiftId, 
      active, 
      phone, 
      address 
    } = body

    // Validar campos obrigatórios
    if (!name || !matricula || !email || !cpf || !birthDate || !hireDate || !departmentId || !positionId || !positionLevelId || !shiftId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    // Obter o ID do usuário logado
    const userId = await getLoggedUserId()
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      )
    }

    // Verificar se já existe um funcionário com a mesma matrícula
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        matricula
      }
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Já existe um funcionário com esta matrícula" },
        { status: 400 }
      )
    }

    // Verificar se já existe um funcionário com o mesmo CPF
    const existingCPF = await prisma.employee.findFirst({
      where: {
        cpf
      }
    })

    if (existingCPF) {
      return NextResponse.json(
        { error: "Já existe um funcionário com este CPF" },
        { status: 400 }
      )
    }

    // Verificar se já existe um funcionário com o mesmo email
    const existingEmail = await prisma.employee.findFirst({
      where: {
        email
      }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Já existe um funcionário com este email" },
        { status: 400 }
      )
    }

    const employee = await prisma.employee.create({
      data: {
        id: randomUUID(),
        name,
        matricula,
        email,
        cpf,
        birthDate: new Date(birthDate),
        hireDate: new Date(hireDate),
        departmentId,
        positionId,
        positionLevelId,
        shiftId,
        active: active ?? true,
        phone,
        address,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId.toString()
      }
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Erro ao criar funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao criar funcionário" },
      { status: 500 }
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