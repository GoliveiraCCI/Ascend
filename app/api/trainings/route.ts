import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { join } from "path"
import { existsSync, mkdirSync, writeFileSync } from "fs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    // Validações básicas
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const source = formData.get("source") as "INTERNAL" | "EXTERNAL"
    const instructor = formData.get("instructor") as string
    const institution = formData.get("institution") as string
    const departmentId = formData.get("departmentId") as string
    const startDate = new Date(formData.get("startDate") as string)
    const endDate = new Date(formData.get("endDate") as string)
    const hours = Number(formData.get("hours"))
    const description = formData.get("description") as string
    const participants = formData.get("participants") as string

    // Validações obrigatórias
    if (!name || !category || !source || !instructor || 
        !startDate || !endDate || !hours) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      )
    }

    if (isNaN(hours) || hours <= 0) {
      return NextResponse.json(
        { error: "O número de horas deve ser maior que zero" },
        { status: 400 }
      )
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "A data de início deve ser anterior à data de término" },
        { status: 400 }
      )
    }

    // Verificar participantes
    let participantIds: string[] = []
    if (!participants) {
      return NextResponse.json(
        { error: "É necessário selecionar participantes" },
        { status: 400 }
      )
    }

    try {
      participantIds = JSON.parse(participants)
    } catch (error) {
      return NextResponse.json(
        { error: "Formato inválido de participantes" },
        { status: 400 }
      )
    }

    if (participantIds.length === 0) {
      return NextResponse.json(
        { error: "Selecione pelo menos um participante" },
        { status: 400 }
      )
    }

    // Verificar se os funcionários existem
    const employees = await prisma.employee.findMany({
      where: {
        id: { in: participantIds }
      }
    })

    if (employees.length !== participantIds.length) {
      return NextResponse.json(
        { error: "Um ou mais funcionários não foram encontrados" },
        { status: 404 }
      )
    }

    // Criar o treinamento
    const training = await prisma.training.create({
      data: {
        name,
        category,
        source,
        instructor,
        institution: institution || null,
        departmentId,
        startDate,
        endDate,
        hours,
        status: "PLANNED",
        description: description || null,
        participants: {
          create: participantIds.map(employeeId => ({
            employeeId,
            status: "ENROLLED"
          }))
        },
        materials: {
          create: files.map(file => ({
            name: file.name,
            type: file.type,
            url: `/uploads/trainings/${Date.now()}-${file.name}`,
            size: file.size
          }))
        }
      },
      include: {
        participants: {
          include: {
            employee: true
          }
        },
        materials: true,
        department: true
      }
    })

    // Se houver arquivos, fazer upload
    if (files.length > 0) {
      try {
        // Criar diretório se não existir
        const uploadDir = join(process.cwd(), "public", "uploads", "trainings")
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true })
        }

        // Fazer upload de cada arquivo
        await Promise.all(files.map(async (file) => {
          const timestamp = Date.now()
          const uniqueFileName = `${timestamp}-${file.name}`
          const filePath = join(uploadDir, uniqueFileName)

          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          writeFileSync(filePath, buffer)
        }))
      } catch (error) {
        console.error("Erro ao fazer upload dos arquivos:", error)
        // Não vamos lançar o erro aqui, pois o registro já foi criado no banco
      }
    }

    return NextResponse.json(training)
  } catch (error) {
    console.error("Erro ao criar treinamento:", error)
    return NextResponse.json(
      { 
        error: "Erro ao criar treinamento",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 