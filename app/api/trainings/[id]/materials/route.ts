import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import path from "path"
import fs from "fs/promises"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo fornecido" },
        { status: 400 }
      )
    }

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

    const materials = await prisma.trainingMaterial.createMany({
      data: uploadedFiles.map((file) => ({
        trainingId: resolvedParams.id,
        name: file.name,
        type: file.type,
        url: file.url,
        size: file.size
      })),
    })

    return NextResponse.json(uploadedFiles)
  } catch (error) {
    console.error("Erro ao fazer upload dos arquivos:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload dos arquivos" },
      { status: 500 }
    )
  }
} 