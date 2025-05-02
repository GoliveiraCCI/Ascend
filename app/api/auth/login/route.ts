import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json()

    if (!name || !password) {
      return NextResponse.json(
        { error: "Usuário e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: { 
        name,
        password
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      )
    }

    // Atualiza o timestamp de atualização
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        updatedAt: new Date()
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    )
  }
} 