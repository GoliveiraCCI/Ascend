import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "30"
    const department = searchParams.get("department") || "all"

    // Calcular a data de início baseado no timeRange
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(timeRange))

    // Buscar dados básicos
    const [totalEmployees, activeEmployees, pendingEvaluations, activeMedicalLeaves, completedTrainings] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { active: true } }),
      prisma.evaluation.count({ where: { status: "Pendente" } }),
      prisma.medicalleave.count({ where: { status: "AFASTADO" } }),
      prisma.training.count({ where: { status: "Concluído" } })
    ])

    // Buscar estatísticas por departamento
    const departments = await prisma.department.findMany({
      include: {
        employee: {
          include: {
            evaluation: true,
            medicalleave: true
          }
        },
        training: true
      }
    })

    const departmentStats = departments.map(dept => ({
      name: dept.name,
      employees: dept.employee?.length || 0,
      evaluations: dept.employee?.reduce((acc, emp) => acc + (emp.evaluation?.length || 0), 0) || 0,
      leaves: dept.employee?.reduce((acc, emp) => acc + (emp.medicalleave?.length || 0), 0) || 0,
      trainings: dept.training?.length || 0
    }))

    // Buscar médias de pontuação por departamento
    const evaluations = await prisma.evaluation.findMany({
      where: {
        finalScore: { not: null }
      },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    })

    const evaluationScores = departments.map(dept => {
      const deptEvaluations = evaluations.filter(evaluation => evaluation.employee?.departmentId === dept.id)
      const averageScore = deptEvaluations.length > 0
        ? deptEvaluations.reduce((acc, evaluation) => acc + (evaluation.finalScore || 0), 0) / deptEvaluations.length
        : 0
      return {
        department: dept.name,
        averageScore
      }
    })

    // Buscar estatísticas de treinamentos
    const trainings = await prisma.training.groupBy({
      by: ["category"],
      _count: true
    })

    const trainingStats = trainings.map(train => ({
      category: train.category,
      count: train._count
    }))

    // Buscar motivos de afastamento
    const leaves = await prisma.medicalleave.groupBy({
      by: ["reason"],
      _count: true
    })

    const leaveReasons = leaves.map(leave => ({
      reason: leave.reason,
      count: leave._count
    }))

    // Buscar top performers
    const topPerformers = await prisma.evaluation.findMany({
      where: {
        finalScore: { not: null }
      },
      orderBy: {
        finalScore: "desc"
      },
      take: 10,
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    })

    const formattedTopPerformers = topPerformers.map(evaluation => ({
      id: evaluation.employee?.id || "unknown",
      name: evaluation.employee?.name || "Desconhecido",
      department: evaluation.employee?.department?.name || "Sem departamento",
      score: evaluation.finalScore || 0
    }))

    // Buscar métricas de desempenho
    const performanceMetrics = [
      { category: "Habilidades Técnicas", score: 4.5 },
      { category: "Trabalho em Equipe", score: 4.2 },
      { category: "Comunicação", score: 4.0 },
      { category: "Liderança", score: 3.8 },
      { category: "Produtividade", score: 4.3 }
    ]

    return NextResponse.json({
      totalEmployees,
      activeEmployees,
      pendingEvaluations,
      activeMedicalLeaves,
      completedTrainings,
      departmentStats,
      evaluationScores,
      trainingStats,
      leaveReasons,
      topPerformers: formattedTopPerformers,
      performanceMetrics
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    )
  }
} 