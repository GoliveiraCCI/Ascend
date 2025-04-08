import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar todas as avaliações com seus relacionamentos
    const evaluations = await prisma.evaluation.findMany({
      include: {
        employee: {
          include: {
            department: true
          }
        },
        answers: true
      }
    })

    // Calcular estatísticas de status
    const total = evaluations.length
    const statusStats = [
      {
        name: "Concluídas",
        value: total > 0 ? Math.round((evaluations.filter(e => e.status === "Finalizado").length / total) * 100) : 0
      },
      {
        name: "Pendentes",
        value: total > 0 ? Math.round((evaluations.filter(e => e.status === "Pendente").length / total) * 100) : 0
      }
    ]

    // Calcular distribuição de pontuações
    const scoreDistribution = [
      { range: "9-10", count: evaluations.filter(e => e.finalScore && e.finalScore >= 9).length },
      { range: "8-8.9", count: evaluations.filter(e => e.finalScore && e.finalScore >= 8 && e.finalScore < 9).length },
      { range: "7-7.9", count: evaluations.filter(e => e.finalScore && e.finalScore >= 7 && e.finalScore < 8).length },
      { range: "6-6.9", count: evaluations.filter(e => e.finalScore && e.finalScore >= 6 && e.finalScore < 7).length },
      { range: "0-5.9", count: evaluations.filter(e => e.finalScore && e.finalScore < 6).length }
    ]

    // Calcular pontuação média por departamento
    const departments = await prisma.department.findMany({
      include: {
        employees: {
          include: {
            evaluations: {
              include: {
                answers: true
              }
            }
          }
        }
      }
    })

    const departmentScores = departments.map(dept => {
      const departmentEvaluations = dept.employees.flatMap(emp => emp.evaluations)
      const validEvaluations = departmentEvaluations.filter(e => e.finalScore !== null)
      
      const totalScore = validEvaluations.reduce((acc, evaluation) => {
        return acc + (evaluation.finalScore || 0)
      }, 0)
      
      const averageScore = validEvaluations.length > 0 
        ? totalScore / validEvaluations.length 
        : 0

      return {
        department: dept.name,
        score: Number(averageScore.toFixed(1))
      }
    })

    return NextResponse.json({
      statusStats,
      scoreDistribution,
      departmentScores
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
} 