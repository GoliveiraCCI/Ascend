import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { join } from "path"
import { unlink } from "fs/promises"
import { mkdir } from "fs/promises"
import { NextRequest } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log("ID do atestado:", id)

    if (!id) {
      console.error("ID do atestado não fornecido")
      return NextResponse.json(
        { error: "ID do atestado não fornecido" },
        { status: 400 }
      )
    }
    
    // Verifica se o atestado médico existe
    const medicalLeave = await prisma.medicalLeave.findUnique({
      where: { id },
      include: {
        files: true
      }
    })

    if (!medicalLeave) {
      console.log("Atestado médico não encontrado:", id)
      return NextResponse.json(
        { error: "Atestado médico não encontrado" },
        { status: 404 }
      )
    }

    console.log("Atestado médico encontrado:", medicalLeave)

    // Garante que a pasta de uploads existe
    const uploadsDir = join(process.cwd(), "public/uploads/medical-leaves")
    try {
      await mkdir(uploadsDir, { recursive: true })
      console.log("Pasta de uploads criada/verificada:", uploadsDir)
    } catch (error) {
      console.error("Erro ao criar pasta de uploads:", error)
      return NextResponse.json(
        { error: "Erro ao criar pasta de uploads", details: error instanceof Error ? error.message : "Erro desconhecido" },
        { status: 500 }
      )
    }

    // Processa o upload dos arquivos
    const formData = await request.formData()
    const files = formData.getAll("files")
    console.log("Arquivos recebidos:", files.length)

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file: any) => {
        try {
          console.log("Processando arquivo:", file.name)
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          // Gera um nome único para o arquivo
          const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const path = join(uploadsDir, uniqueName)
          console.log("Caminho do arquivo:", path)

          // Salva o arquivo
          await writeFile(path, buffer)
          console.log("Arquivo salvo com sucesso")

          // Cria o registro no banco
          const fileRecord = await prisma.file.create({
            data: {
              name: file.name,
              type: file.type,
              url: `/uploads/medical-leaves/${uniqueName}`,
              medicalLeaveId: id,
            },
          })
          console.log("Registro criado no banco:", fileRecord)

          return fileRecord
        } catch (error) {
          console.error("Erro ao processar arquivo:", file.name, error)
          throw error
        }
      })
    )

    console.log("Upload concluído com sucesso")
    return NextResponse.json(uploadedFiles)
  } catch (error) {
    console.error("Erro ao fazer upload dos arquivos:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload dos arquivos", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const { fileId } = params
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 404 }
      )
    }

    // Remove o arquivo físico
    const fileName = file.url.split("/").pop()
    if (fileName) {
      const path = join(process.cwd(), "public/uploads/medical-leaves", fileName)
      await unlink(path).catch(console.error) // Ignora erro se o arquivo não existir
    }

    // Remove o registro do banco
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    })

    return NextResponse.json({ message: "Arquivo removido com sucesso" })
  } catch (error) {
    console.error("Erro ao remover arquivo:", error)
    return NextResponse.json(
      { error: "Erro ao remover arquivo", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
} 