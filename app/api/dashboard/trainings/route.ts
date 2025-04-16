import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Traduções
const categoryTranslations: Record<string, string> = {
  TECHNICAL: "Técnico",
  SOFT_SKILLS: "Habilidades Interpessoais",
  LEADERSHIP: "Liderança",
  COMPLIANCE: "Conformidade"
}

const statusTranslations: Record<string, string> = {
  PLANNED: "Planejado",
  IN_PROGRESS: "Em Andamento",
  COMPLETED: "Concluído"
}

export async function GET() {
  try {
    // Buscar todos os treinamentos com seus participantes e departamentos
    const trainings = await prisma.training.findMany({
      include: {
        trainingparticipant: {
          include: {
            employee: {
              include: {
                department: true
              }
            }
          }
        },
        department: true
      }
    })

    // Calcular estatísticas
    const stats = {
      byCategory: {} as Record<string, { total: number, participants: number }>,
      byDepartment: {} as Record<string, { total: number, participants: number }>,
      byMonth: {} as Record<string, { total: number, participants: number }>,
      byStatus: {} as Record<string, { total: number, participants: number }>
    }

    // Processar os dados
    trainings.forEach(training => {
      // Por categoria
      const category = categoryTranslations[training.category] || training.category
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = { total: 0, participants: 0 }
      }
      stats.byCategory[category].total++
      stats.byCategory[category].participants += training.trainingparticipant.length

      // Por departamento (baseado nos participantes)
      training.trainingparticipant.forEach(participant => {
        const deptName = participant.employee.department.name
        if (!stats.byDepartment[deptName]) {
          stats.byDepartment[deptName] = { total: 0, participants: 0 }
        }
        stats.byDepartment[deptName].participants++
      })

      // Por mês
      const monthKey = `${training.startDate.getFullYear()}-${String(training.startDate.getMonth() + 1).padStart(2, '0')}`
      if (!stats.byMonth[monthKey]) {
        stats.byMonth[monthKey] = { total: 0, participants: 0 }
      }
      stats.byMonth[monthKey].total++
      stats.byMonth[monthKey].participants += training.trainingparticipant.length

      // Por status
      const status = statusTranslations[training.status] || training.status
      if (!stats.byStatus[status]) {
        stats.byStatus[status] = { total: 0, participants: 0 }
      }
      stats.byStatus[status].total++
      stats.byStatus[status].participants += training.trainingparticipant.length
    })

    // Formatar os dados para o frontend
    const formattedData = {
      byCategory: Object.entries(stats.byCategory).map(([category, data]) => ({
        category,
        total: data.total,
        participants: data.participants
      })),
      byDepartment: Object.entries(stats.byDepartment).map(([department, data]) => ({
        department,
        total: data.total,
        participants: data.participants
      })),
      byMonth: Object.entries(stats.byMonth).map(([month, data]) => ({
        month,
        total: data.total,
        participants: data.participants
      })),
      byStatus: Object.entries(stats.byStatus).map(([status, data]) => ({
        status,
        total: data.total,
        participants: data.participants
      }))
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Erro ao buscar dados de treinamentos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados de treinamentos" },
      { status: 500 }
    )
  }
} 