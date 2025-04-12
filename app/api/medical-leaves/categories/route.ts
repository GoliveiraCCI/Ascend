import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Iniciando busca de categorias...")
    console.log("Verificando cliente Prisma:", !!prisma)

    const categories = await prisma.medicalleavecategory.findMany({
      orderBy: {
        name: "asc",
      },
    })

    console.log("Categorias encontradas:", categories.length)
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
    const body = await request.json()
    const { name, description } = body

    const category = await prisma.medicalleavecategory.create({
      data: {
        name,
        description,
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