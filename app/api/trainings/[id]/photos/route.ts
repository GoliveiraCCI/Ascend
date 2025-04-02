import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const photos = formData.getAll("photos") as File[]

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma foto fornecida" },
        { status: 400 }
      )
    }

    const training = await prisma.training.findUnique({
      where: { id: params.id },
    })

    if (!training) {
      return NextResponse.json(
        { error: "Treinamento não encontrado" },
        { status: 404 }
      )
    }

    const uploadedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const bytes = await photo.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Criar nome único para o arquivo
        const fileName = `${Date.now()}-${photo.name}`
        const path = join(process.cwd(), "public", "uploads", "trainings", fileName)

        // Salvar arquivo
        await writeFile(path, buffer)

        // Criar registro no banco
        return prisma.trainingPhoto.create({
          data: {
            trainingId: params.id,
            url: `/uploads/trainings/${fileName}`,
            caption: photo.name,
          },
        })
      })
    )

    return NextResponse.json(uploadedPhotos)
  } catch (error) {
    console.error("Erro ao fazer upload das fotos:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload das fotos" },
      { status: 500 }
    )
  }
} 