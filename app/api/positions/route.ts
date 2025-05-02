import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"
import { getLoggedUserId } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")

    const positions = await prisma.position.findMany({
      where: departmentId ? {
        departmentId
      } : undefined,
      include: {
        department: true,
        positionlevel: {
          select: {
            id: true,
            name: true,
            salary: true,
            positionId: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    })
    
    return NextResponse.json(positions)
  } catch (error) {
    console.error("Erro ao buscar cargos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar cargos" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, departmentId, positionLevels } = body

    // Validar campos obrigatórios
    if (!title || !departmentId) {
      return NextResponse.json(
        { error: "Nome e departamento são obrigatórios" },
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

    // Verificar se o departamento existe
    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: "Departamento não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se já existe um cargo com o mesmo título no mesmo departamento
    const existingPosition = await prisma.position.findFirst({
      where: {
        title,
        departmentId
      },
    })

    if (existingPosition) {
      return NextResponse.json(
        { error: "Já existe um cargo com este título neste departamento" },
        { status: 400 }
      )
    }

    // Criar o cargo com suas faixas
    const position = await prisma.position.create({
      data: {
        id: randomUUID(),
        title,
        description,
        departmentId,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
        positionlevel: {
          create: positionLevels.map((level: { name: string; salary: number }) => ({
            id: randomUUID(),
            name: level.name,
            salary: level.salary,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId
          }))
        }
      },
      include: {
        positionlevel: true
      }
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error("Erro ao criar cargo:", error)
    return NextResponse.json(
      { error: "Erro ao criar cargo" },
      { status: 500 }
    )
  }
} 