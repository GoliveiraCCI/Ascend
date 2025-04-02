import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    // Criar departamento padrão se não existir
    const defaultDepartment = await prisma.department.upsert({
      where: { code: 'ADM' },
      update: {},
      create: {
        code: 'ADM',
        name: 'Administração',
        description: 'Departamento Administrativo'
      },
    })

    return NextResponse.json({ 
      message: 'Sistema inicializado com sucesso',
      department: defaultDepartment 
    })
  } catch (error) {
    console.error('Erro ao inicializar o sistema:', error)
    return NextResponse.json(
      { error: "Erro ao inicializar o sistema", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
} 