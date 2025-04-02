import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Tenta fazer uma consulta simples
    const count = await prisma.medicalLeave.count()
    return NextResponse.json({ 
      success: true, 
      message: "Conexão com o banco de dados estabelecida",
      count 
    })
  } catch (error) {
    console.error("Erro ao testar conexão:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro ao conectar com o banco de dados",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 