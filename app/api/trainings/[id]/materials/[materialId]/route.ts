import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import path from "path"
import fs from "fs/promises"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; materialId: string } }
) {
  try {
    const resolvedParams = await params

    // Buscar o material para obter o nome do arquivo
    const material = await prisma.trainingMaterial.findUnique({
      where: {
        id: resolvedParams.materialId,
      },
    })

    if (!material) {
      return NextResponse.json(
        { error: "Material não encontrado" },
        { status: 404 }
      )
    }

    // Extrair o nome do arquivo da URL
    const fileName = material.url.split("/").pop()
    if (fileName) {
      // Remover o arquivo físico
      const filePath = path.join(process.cwd(), "public", "uploads", fileName)
      try {
        await fs.unlink(filePath)
      } catch (error) {
        console.error("Erro ao remover arquivo físico:", error)
      }
    }

    // Remover o registro do banco de dados
    await prisma.trainingMaterial.delete({
      where: {
        id: resolvedParams.materialId,
      },
    })

    return NextResponse.json({ message: "Material removido com sucesso" })
  } catch (error) {
    console.error("Erro ao remover material:", error)
    return NextResponse.json(
      { error: "Erro ao remover material" },
      { status: 500 }
    )
  }
} 