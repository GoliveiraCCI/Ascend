import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import path from "path"
import fs from "fs/promises"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        department: true,
        trainingparticipant: {
          include: {
            employee: {
              include: {
                department: true
              }
            }
          }
        },
        trainingmaterial: true,
        trainingphoto: true,
        trainingevaluation: true
      }
    })

    if (!training) {
      return NextResponse.json(
        { error: "Treinamento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(training)
  } catch (error) {
    console.error("Erro ao buscar treinamento:", error)
    return NextResponse.json(
      { 
        error: "Erro ao buscar treinamento",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params
    const formData = await request.formData()
    const id = resolvedParams.id

    // Extrair dados do formulário
    const name = formData.get("name") as string
    const source = formData.get("source") as string
    const startDate = new Date(formData.get("startDate") as string)
    const endDate = new Date(formData.get("endDate") as string)
    const description = formData.get("description") as string
    const instructor = formData.get("instructor") as string
    const institution = formData.get("institution") as string
    const hours = parseInt(formData.get("hours") as string)
    const category = formData.get("category") as string
    const participants = JSON.parse(formData.get("participants") as string)
    const files = formData.getAll("files") as File[]
    const removedFiles = JSON.parse(formData.get("removedFiles") as string)

    // Validar datas
    if (startDate > endDate) {
      return NextResponse.json(
        { error: "A data de início não pode ser posterior à data de término" },
        { status: 400 }
      )
    }

    // Buscar o treinamento existente
    const existingTraining = await prisma.training.findUnique({
      where: { id },
      include: {
        materials: true,
        participants: true,
      },
    })

    if (!existingTraining) {
      return NextResponse.json(
        { error: "Treinamento não encontrado" },
        { status: 404 }
      )
    }

    // Processar arquivos removidos
    if (removedFiles && removedFiles.length > 0) {
      await prisma.trainingMaterial.deleteMany({
        where: {
          id: {
            in: removedFiles,
          },
        },
      })
    }

    // Processar novos arquivos
    const uploadedFiles = []
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${file.name}`
      const filePath = path.join(process.cwd(), "public", "uploads", fileName)

      await fs.writeFile(filePath, buffer)

      const fileUrl = `/uploads/${fileName}`
      uploadedFiles.push({
        name: file.name,
        type: file.type,
        url: fileUrl,
        size: file.size
      })
    }

    // Atualizar o treinamento
    const updatedTraining = await prisma.training.update({
      where: { id },
      data: {
        name,
        source,
        startDate,
        endDate,
        description,
        instructor,
        institution,
        hours,
        category,
        materials: {
          create: uploadedFiles.map((file) => ({
            name: file.name,
            type: file.type,
            url: file.url,
            size: file.size
          })),
        },
        participants: {
          deleteMany: {},
          create: participants.map((participantId: string) => ({
            employeeId: participantId,
            status: "IN_PROGRESS",
          })),
        },
      },
      include: {
        materials: true,
        participants: {
          include: {
            employee: {
              include: {
                department: true,
              },
            },
          },
        },
        department: true,
        photos: true,
      },
    })

    return NextResponse.json(updatedTraining)
  } catch (error) {
    console.error("Erro ao atualizar treinamento:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar treinamento" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params
    await prisma.training.delete({
      where: { id: resolvedParams.id },
    })
    return NextResponse.json({ message: "Treinamento excluído com sucesso" })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir treinamento" },
      { status: 500 }
    )
  }
} 