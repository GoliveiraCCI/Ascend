import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Tenta fazer uma consulta simples
    const count = await prisma.employee.count()
    
    return NextResponse.json({
      message: "Conexão com o banco de dados OK",
      employeeCount: count
    })
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error)
    return NextResponse.json(
      { error: "Erro ao conectar com o banco de dados" },
      { status: 500 }
    )
  }
} 