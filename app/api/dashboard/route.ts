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
    const totalEmployees = await prisma.employee.count()
    const activeEmployees = await prisma.employee.count({
      where: { active: true }
    })
    const pendingEvaluations = await prisma.evaluation.count({
      where: { status: "PENDENTE" }
    })
    const activeMedicalLeaves = await prisma.medicalleave.count({
      where: { status: "ATIVO" }
    })
    const completedTrainings = await prisma.training.count({
      where: { status: "CONCLUIDO" }
    })

    // Buscar departamentos
    const departments = await prisma.department.findMany({
      include: {
        employee: {
          include: {
            evaluation: {
              include: {
                evaluationanswer: true
              }
            },
            medicalleave: true,
            trainingparticipant: true
          }
        }
      }
    })

    // Calcular estatísticas por departamento
    const departmentStats = departments.map(dept => ({
      name: dept.name,
      employees: dept.employee.length,
      evaluations: dept.employee.reduce((acc, emp) => acc + emp.evaluation.length, 0),
      leaves: dept.employee.reduce((acc, emp) => acc + emp.medicalleave.length, 0),
      trainings: dept.employee.reduce((acc, emp) => acc + emp.trainingparticipant.length, 0)
    }))

    // Calcular pontuação média por departamento
    const evaluationScores = departments.map(dept => {
      const deptEvaluations = dept.employee.flatMap(emp => emp.evaluation)
      const validEvaluations = deptEvaluations.filter(evaluation => {
        const validAnswers = evaluation.evaluationanswer.filter(answer => 
          answer.selfScore !== null && answer.managerScore !== null
        )
        return validAnswers.length > 0
      })

      const averageScore = validEvaluations.length > 0
        ? validEvaluations.reduce((acc, evaluation) => {
            const validAnswers = evaluation.evaluationanswer.filter(answer => 
              answer.selfScore !== null && answer.managerScore !== null
            )
            const selfAverage = validAnswers.reduce((sum, answer) => sum + (answer.selfScore || 0), 0) / validAnswers.length
            const managerAverage = validAnswers.reduce((sum, answer) => sum + (answer.managerScore || 0), 0) / validAnswers.length
            const weightedScore = (selfAverage * 0.4) + (managerAverage * 0.6)
            return acc + weightedScore
          }, 0) / validEvaluations.length
        : 0

      return {
        department: dept.name,
        averageScore: Number(averageScore.toFixed(1))
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
    const evaluations = await prisma.evaluation.findMany({
      include: {
        evaluationanswer: true,
        employee: {
          include: {
            department: true
          }
        }
      }
    })

    const topPerformers = evaluations
      .map(evaluation => {
        const validAnswers = evaluation.evaluationanswer.filter(answer => 
          answer.selfScore !== null && answer.managerScore !== null
        )
        
        if (validAnswers.length === 0) return null

        const selfAverage = validAnswers.reduce((sum, answer) => sum + (answer.selfScore || 0), 0) / validAnswers.length
        const managerAverage = validAnswers.reduce((sum, answer) => sum + (answer.managerScore || 0), 0) / validAnswers.length
        const weightedScore = (selfAverage * 0.4) + (managerAverage * 0.6)

        return {
          id: evaluation.employee?.id || "unknown",
          name: evaluation.employee?.name || "Desconhecido",
          department: evaluation.employee?.department?.name || "Sem departamento",
          score: Number(weightedScore.toFixed(1))
        }
      })
      .filter((evaluation): evaluation is NonNullable<typeof evaluation> => evaluation !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

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
      topPerformers,
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