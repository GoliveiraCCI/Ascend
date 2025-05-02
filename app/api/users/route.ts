import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    const users = await prisma.user.findMany({
      where: name ? {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json(
      { 
        error: "Erro ao buscar usuários",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role, department } = body

    // Validações básicas
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Nome, email, senha e função são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Já existe um usuário com este email' },
        { status: 400 }
      )
    }

    // Cria o novo usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Em produção, a senha deve ser criptografada
        role,
        department,
        isActive: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
} 