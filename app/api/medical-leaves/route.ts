import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { join } from "path"
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs"
import { v4 as uuidv4 } from 'uuid'

// GET - Listar todas as licenças médicas
export async function GET(request: Request) {
  try {
    console.log("Iniciando busca de licenças médicas...")
    console.log("Verificando cliente Prisma:", !!prisma)
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    console.log("Parâmetros recebidos:", { department, status, search })

    const where: any = {}

    if (department && department !== "all") {
      where.employee = {
        department: {
          name: department
        }
      }
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (search) {
      where.OR = [
        {
          employee: {
            name: {
              contains: search
            }
          }
        },
        {
          employee: {
            matricula: {
              contains: search
            }
          }
        },
        {
          reason: {
            contains: search
          }
        }
      ]
    }

    console.log("Construindo query com where:", where)

    const medicalLeaves = await prisma.medicalleave.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true,
            position: true,
            shift: true
          }
        },
        medicalleavecategory: true,
        file: true
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    console.log(`Encontradas ${medicalLeaves.length} licenças médicas`)
    return NextResponse.json(medicalLeaves)
  } catch (error) {
    console.error("Erro ao buscar licenças médicas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar licenças médicas", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}

// POST - Criar nova licença médica
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      employeeId,
      startDate,
      endDate,
      days,
      reason,
      doctor,
      hospital,
      status,
      notes,
      categoryId,
    } = body

    // Validar datas
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start > end) {
      return NextResponse.json(
        { error: "A data de início deve ser anterior à data de término" },
        { status: 400 }
      )
    }

    // Criar a licença médica
    const medicalLeave = await prisma.medicalleave.create({
      data: {
        id: uuidv4(),
        employeeId,
        categoryId,
        startDate: start,
        endDate: end,
        days,
        reason,
        doctor,
        hospital,
        status,
        notes,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(medicalLeave)
  } catch (error) {
    console.error("Erro ao criar licença médica:", error)
    return NextResponse.json(
      { error: "Erro ao criar licença médica", details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Atualizar licença médica
export async function PUT(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const id = formData.get('id') as string
    const startDate = new Date(formData.get('startDate') as string)
    const endDate = new Date(formData.get('endDate') as string)
    const days = parseInt(formData.get('days') as string)
    const reason = formData.get('reason') as string
    const doctor = formData.get('doctor') as string
    const hospital = formData.get('hospital') as string
    const status = formData.get('status') as string

    // Buscar a licença médica atual
    const currentLeave = await prisma.medicalleave.findUnique({
      where: { id },
      include: { 
        employee: true,
        files: true
      }
    })

    if (!currentLeave) {
      return NextResponse.json(
        { error: "Licença médica não encontrada" },
        { status: 404 }
      )
    }

    // Atualizar a licença médica
    const medicalLeave = await prisma.medicalleave.update({
      where: { id },
      data: {
        startDate,
        endDate,
        days,
        reason,
        doctor,
        hospital,
        status,
        files: {
          upsert: {
            create: {
              name: file.name,
              type: file.type,
              url: `/uploads/medical-leaves/${Date.now()}-${file.name}`,
            },
            update: {
              name: file.name,
              type: file.type,
              url: `/uploads/medical-leaves/${Date.now()}-${file.name}`,
            },
            where: { id: currentLeave.files[0].id }
          }
        }
      },
      include: {
        employee: {
          include: {
            department: true,
            position: true
          }
        },
        files: true
      }
    })

    // Se houver arquivo, fazer upload
    if (file) {
      try {
        console.log("Iniciando upload do arquivo:", file.name, file.type)
        
        // Criar diretório se não existir
        const uploadDir = join(process.cwd(), "public", "uploads", "medical-leaves")
        console.log("Diretório de upload:", uploadDir)
        
        if (!existsSync(uploadDir)) {
          console.log("Criando diretório de upload")
          mkdirSync(uploadDir, { recursive: true })
        }

        // Gerar nome único para o arquivo
        const timestamp = Date.now()
        const uniqueFileName = `${timestamp}-${file.name}`
        const filePath = join(uploadDir, uniqueFileName)
        console.log("Caminho completo do arquivo:", filePath)

        // Converter o arquivo para buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        console.log("Tamanho do buffer:", buffer.length)

        // Salvar o arquivo
        writeFileSync(filePath, buffer)
        console.log("Arquivo salvo com sucesso")

        // Se houver arquivo antigo, excluir
        if (currentLeave.files.length > 0) {
          const oldFilePath = join(process.cwd(), "public", currentLeave.files[0].url)
          if (existsSync(oldFilePath)) {
            unlinkSync(oldFilePath)
            console.log("Arquivo antigo excluído:", oldFilePath)
          }
        }
      } catch (error) {
        console.error("Erro detalhado ao fazer upload do arquivo:", {
          message: error instanceof Error ? error.message : "Erro desconhecido",
          stack: error instanceof Error ? error.stack : undefined,
          error
        })
        // Não vamos lançar erro aqui, apenas logar
      }
    }

    // Atualizar o status do funcionário
    const today = new Date()
    const isCurrentlyOnLeave = 
      status === "APPROVED" && 
      startDate <= today && 
      endDate >= today

    await prisma.employee.update({
      where: { id: currentLeave.employeeId },
      data: {
        onMedicalLeave: isCurrentlyOnLeave
      }
    })

    return NextResponse.json(medicalLeave)
  } catch (error) {
    console.error("Erro ao atualizar licença médica:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar licença médica" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir licença médica
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      )
    }

    await prisma.medicalleave.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Licença médica excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir licença médica:", error)
    return NextResponse.json(
      { error: "Erro ao excluir licença médica" },
      { status: 500 }
    )
  }
} 