import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar todas as licenças médicas
    const medicalLeaves = await prisma.medicalleave.findMany({
      where: {
        status: "AFASTADO"
      },
      select: {
        startDate: true,
        endDate: true,
        days: true,
        reason: true,
        medicalleavecategory: {
          select: {
            name: true,
            description: true
          }
        },
        employee: {
          select: {
            department: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    // Calcular estatísticas
    const totalLeaves = medicalLeaves.length
    const totalDays = medicalLeaves.reduce((acc, leave) => acc + leave.days, 0)
    const averageDays = totalLeaves > 0 ? totalDays / totalLeaves : 0

    // Agrupar por departamento
    const leavesByDepartment = medicalLeaves.reduce((acc, leave) => {
      const deptName = leave.employee.department.name
      if (!acc[deptName]) {
        acc[deptName] = {
          total: 0,
          days: 0,
          employees: new Set()
        }
      }
      acc[deptName].total++
      acc[deptName].days += leave.days
      acc[deptName].employees.add(leave.employee.id)
      return acc
    }, {} as Record<string, { total: number; days: number; employees: Set<string> }>)

    // Agrupar por categoria
    const leavesByReason = medicalLeaves.reduce((acc, leave) => {
      const categoryName = leave.medicalleavecategory?.name || leave.reason
      if (!acc[categoryName]) {
        acc[categoryName] = {
          total: 0,
          days: 0
        }
      }
      acc[categoryName].total++
      acc[categoryName].days += leave.days
      return acc
    }, {} as Record<string, { total: number; days: number }>)

    // Agrupar por mês
    const leavesByMonth = medicalLeaves.reduce((acc, leave) => {
      const month = new Date(leave.startDate).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
      if (!acc[month]) {
        acc[month] = {
          total: 0,
          days: 0
        }
      }
      acc[month].total++
      acc[month].days += leave.days
      return acc
    }, {} as Record<string, { total: number; days: number }>)

    // Converter para array e ordenar
    const byReason = Object.entries(leavesByReason)
      .map(([reason, stats]) => ({
        reason,
        total: stats.total,
        days: stats.days
      }))
      .sort((a, b) => b.total - a.total)

    // Formatar dados para o frontend
    const analytics = {
      totalLeaves,
      totalDays,
      averageDays,
      byDepartment: Object.entries(leavesByDepartment).map(([name, data]) => ({
        name,
        total: data.total,
        days: data.days,
        employees: data.employees.size
      })),
      byReason,
      byMonth: Object.entries(leavesByMonth).map(([month, data]) => ({
        month,
        total: data.total,
        days: data.days
      }))
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Erro ao buscar análises de licenças médicas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar análises de licenças médicas" },
      { status: 500 }
    )
  }
} 