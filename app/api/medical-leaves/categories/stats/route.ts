import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Buscar todas as categorias com suas licenças médicas
    const categories = await prisma.medicalleavecategory.findMany({
      include: {
        medicalleave: {
          select: {
            days: true,
            startDate: true,
            endDate: true,
            status: true
          }
        }
      }
    })

    // Calcular estatísticas para cada categoria
    const stats = categories.map(category => {
      const leaves = category.medicalleave
      const totalLeaves = leaves.length
      const totalDays = leaves.reduce((sum, leave) => sum + leave.days, 0)
      const activeLeaves = leaves.filter(leave => 
        new Date(leave.endDate) >= new Date() && leave.status === "AFASTADO"
      ).length

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        total: totalLeaves,
        days: totalDays,
        active: activeLeaves
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erro ao buscar estatísticas das categorias:", error)
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas das categorias" },
      { status: 500 }
    )
  }
} 