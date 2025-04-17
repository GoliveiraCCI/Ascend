import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    console.log("Iniciando busca de categorias...")
    const categories = await prisma.medicalleavecategory.findMany({
      orderBy: {
        name: "asc",
      },
    })

    console.log(`Total de categorias encontradas: ${categories.length}`)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "O nome da categoria é obrigatório" },
        { status: 400 }
      )
    }

    const now = new Date()

    const category = await prisma.medicalleavecategory.create({
      data: {
        id: randomUUID(),
        name,
        description: description || "",
        createdAt: now,
        updatedAt: now,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    )
  }
} 