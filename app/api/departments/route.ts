import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(departments)
  } catch (error) {
    console.error("Erro ao buscar departamentos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar departamentos" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, description } = body

    // Validar campos obrigatórios
    if (!name || !code) {
      return NextResponse.json(
        { error: "Nome e código do departamento são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se já existe um departamento com o mesmo nome
    const existingDepartment = await prisma.department.findFirst({
      where: {
        name,
      },
    })

    if (existingDepartment) {
      return NextResponse.json(
        { error: "Já existe um departamento com este nome" },
        { status: 400 }
      )
    }

    // Verificar se já existe um departamento com o mesmo código
    const existingCode = await prisma.department.findUnique({
      where: {
        code,
      },
    })

    if (existingCode) {
      return NextResponse.json(
        { error: "Já existe um departamento com este código" },
        { status: 400 }
      )
    }

    // Criar o departamento
    const department = await prisma.department.create({
      data: {
        id: randomUUID(),
        name,
        code,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "system" // Usando o valor padrão definido no schema
      },
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error('Erro ao criar departamento:', error)
    return NextResponse.json(
      { error: "Erro ao criar departamento" },
      { status: 500 }
    )
  }
} 