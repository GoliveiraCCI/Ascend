import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const medicalLeaves = await prisma.medicalLeave.findMany({
      where: {
        employeeId: id,
      },
      orderBy: {
        startDate: "desc",
      },
    })

    return NextResponse.json(medicalLeaves)
  } catch (error) {
    console.error("Erro ao buscar afastamentos médicos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar afastamentos médicos" },
      { status: 500 }
    )
  }
} 