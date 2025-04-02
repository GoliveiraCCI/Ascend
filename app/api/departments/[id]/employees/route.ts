import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const departmentId = params.id

    // Validar se o ID é válido
    if (!departmentId) {
      return NextResponse.json(
        { error: "ID do departamento não fornecido" },
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

    // Buscar funcionários do departamento
    const employees = await prisma.employee.findMany({
      where: {
        departmentId,
        active: true
      },
      select: {
        id: true,
        name: true,
        matricula: true,
        department: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    // Não retornar erro 404 se não houver funcionários, apenas um array vazio
    return NextResponse.json(employees || [])
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error)
    return NextResponse.json(
      { 
        error: "Erro ao buscar funcionários",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 