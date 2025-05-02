import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"
import { getLoggedUserId } from "@/lib/utils"

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
    const { name, description, code } = body

    // Validar campos obrigatórios
    if (!name || !code) {
      return NextResponse.json(
        { error: "Nome e código são obrigatórios" },
        { status: 400 }
      )
    }

    // Obter o ID do usuário logado
    const userId = getLoggedUserId()
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      )
    }

    // Verificar se o código já existe
    const existingCode = await prisma.department.findUnique({
      where: { code }
    })

    if (existingCode) {
      return NextResponse.json(
        { error: "Já existe um departamento com este código" },
        { status: 400 }
      )
    }

    const department = await prisma.department.create({
      data: {
        id: randomUUID(),
        name,
        description,
        code,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId
      }
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error("Erro ao criar departamento:", error)
    return NextResponse.json(
      { error: "Erro ao criar departamento" },
      { status: 500 }
    )
  }
} 