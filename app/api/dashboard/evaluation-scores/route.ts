import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar todas as avaliações com suas respostas e departamentos
    const evaluations = await prisma.evaluation.findMany({
      where: {
        status: "CONCLUIDO", // Apenas avaliações concluídas
        finalScore: {
          not: null // Apenas avaliações com pontuação final
        }
      },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    })

    // Agrupar avaliações por departamento e calcular média
    const scoresByDepartment = evaluations.reduce((acc, evaluation) => {
      const departmentName = evaluation.employee.department.name
      if (!acc[departmentName]) {
        acc[departmentName] = {
          total: 0,
          count: 0
        }
      }
      acc[departmentName].total += evaluation.finalScore || 0
      acc[departmentName].count += 1
      return acc
    }, {} as Record<string, { total: number; count: number }>)

    // Calcular média e formatar dados para o gráfico
    const data = Object.entries(scoresByDepartment).map(([department, { total, count }]) => ({
      department,
      averageScore: total / count
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar pontuações das avaliações:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pontuações das avaliações" },
      { status: 500 }
    )
  }
} 