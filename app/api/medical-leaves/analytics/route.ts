import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const department = searchParams.get("department")

    let where: Prisma.MedicalLeaveWhereInput = {
      status: "AFASTADO"
    }

    if (startDate && endDate) {
      where = {
        ...where,
        startDate: {
          gte: new Date(startDate)
        },
        endDate: {
          lte: new Date(endDate)
        }
      }
    }

    if (department && department !== "all") {
      where = {
        ...where,
        employee: {
          department: {
            name: department
          }
        }
      }
    }

    // Buscar todas as licenças médicas aprovadas no período
    const medicalLeaves = await prisma.medicalLeave.findMany({
      where,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        days: true,
        reason: true,
        employeeId: true,
        employee: {
          include: {
            department: true,
            position: true
          }
        }
      },
      orderBy: {
        startDate: "desc"
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
      acc[deptName].employees.add(leave.employeeId)
      return acc
    }, {} as Record<string, { total: number; days: number; employees: Set<string> }>)

    // Agrupar por motivo
    const leavesByReason = medicalLeaves.reduce((acc, leave) => {
      const reason = leave.reason || "Não informado"
      if (!acc[reason]) {
        acc[reason] = {
          total: 0,
          days: 0
        }
      }
      acc[reason].total++
      acc[reason].days += leave.days
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
      byReason: Object.entries(leavesByReason).map(([reason, data]) => ({
        reason,
        total: data.total,
        days: data.days
      })),
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