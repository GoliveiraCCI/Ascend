import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Buscar todas as avaliações com seus relacionamentos
    const evaluations = await prisma.evaluation.findMany({
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    })

    // Calcular estatísticas de status
    const total = evaluations.length
    const statusStats = [
      {
        name: "Concluídas",
        value: Math.round((evaluations.filter(e => e.status === "Concluída").length / total) * 100) || 0
      },
      {
        name: "Pendentes",
        value: Math.round((evaluations.filter(e => e.status === "Pendente").length / total) * 100) || 0
      },
      {
        name: "Em Progresso",
        value: Math.round((evaluations.filter(e => e.status === "Em Progresso").length / total) * 100) || 0
      }
    ]

    // Calcular distribuição de pontuações
    const scoreDistribution = [
      { range: "9-10", count: evaluations.filter(e => e.score && e.score >= 9).length },
      { range: "8-8.9", count: evaluations.filter(e => e.score && e.score >= 8 && e.score < 9).length },
      { range: "7-7.9", count: evaluations.filter(e => e.score && e.score >= 7 && e.score < 8).length },
      { range: "6-6.9", count: evaluations.filter(e => e.score && e.score >= 6 && e.score < 7).length },
      { range: "0-5.9", count: evaluations.filter(e => e.score && e.score < 6).length }
    ]

    // Calcular pontuação média por departamento
    const departments = await prisma.department.findMany({
      include: {
        employees: {
          include: {
            evaluations: true
          }
        }
      }
    })

    const departmentScores = departments.map(dept => {
      const departmentEvaluations = dept.employees.flatMap(emp => emp.evaluations)
      const totalScore = departmentEvaluations.reduce((acc, evaluation) => {
        const score = evaluation.score || 0
        return acc + score
      }, 0)
      const averageScore = departmentEvaluations.length > 0 
        ? totalScore / departmentEvaluations.length 
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