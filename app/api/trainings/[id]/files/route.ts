import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { join } from "path"
import { writeFile, mkdir, unlink } from "fs/promises"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    // Verificar se o treinamento existe
    const training = await prisma.training.findUnique({
      where: { id: params.id }
    })

    if (!training) {
      return NextResponse.json(
        { error: "Treinamento não encontrado" },
        { status: 404 }
      )
    }

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), "public", "uploads", "trainings")
    await mkdir(uploadDir, { recursive: true })

    // Processar cada arquivo
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        // Gerar nome único para o arquivo
        const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = join(uploadDir, uniqueName)

        // Converter o arquivo para buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Salvar o arquivo
        await writeFile(filePath, buffer)

        // Criar registro no banco
        return prisma.trainingMaterial.create({
          data: {
            trainingId: params.id,
            name: file.name,
            type: file.type,
            url: `/uploads/trainings/${uniqueName}`,
            size: file.size
          }
        })
      })
    )

    return NextResponse.json(uploadedFiles)
  } catch (error) {
    console.error("Erro ao fazer upload dos arquivos:", error)
    return NextResponse.json(
      { 
        error: "Erro ao fazer upload dos arquivos",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Buscar o treinamento e seus arquivos
    const training = await prisma.training.findUnique({
      where: { id: params.id },
      include: {
        materials: true
      }
    })

    if (!training) {
      return NextResponse.json(
        { error: "Treinamento não encontrado" },
        { status: 404 }
      )
    }

    // Deletar arquivos físicos
    for (const material of training.materials) {
      const filePath = join(process.cwd(), "public", material.url)
      try {
        await unlink(filePath)
      } catch (error) {
        console.error("Erro ao deletar arquivo físico:", error)
      }
    }

    // Deletar registros do banco
    await prisma.trainingMaterial.deleteMany({
      where: { trainingId: params.id }
    })

    return NextResponse.json({ message: "Arquivos deletados com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar arquivos:", error)
    return NextResponse.json(
      { 
        error: "Erro ao deletar arquivos",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 