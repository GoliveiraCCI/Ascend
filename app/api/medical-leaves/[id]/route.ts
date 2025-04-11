import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { join } from "path"
import { unlink } from "fs/promises"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const medicalLeave = await prisma.medicalleave.findUnique({
      where: {
        id,
      },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
            shift: true,
          },
        },
        medicalleavecategory: true,
        file: true,
      },
    })

    if (!medicalLeave) {
      return NextResponse.json(
        { error: "Atestado médico não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(medicalLeave)
  } catch (error) {
    console.error("Erro ao buscar atestado médico:", error)
    return NextResponse.json(
      { error: "Erro ao buscar atestado médico", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const {
      categoryId,
      startDate,
      endDate,
      days,
      reason,
      doctor,
      hospital,
      notes,
      status,
    } = body

    const medicalLeave = await prisma.medicalLeave.update({
      where: {
        id,
      },
      data: {
        categoryId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days,
        reason,
        doctor,
        hospital,
        notes,
        status,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            matricula: true,
            department: {
              select: {
                name: true,
              },
            },
            position: {
              select: {
                title: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    console.log("Excluindo atestado médico:", id)

    // Verifica se o atestado existe
    const medicalLeave = await prisma.medicalleave.findUnique({
      where: { id },
      include: {
        file: true
      }
    })

    if (!medicalLeave) {
      return NextResponse.json(
        { error: "Atestado médico não encontrado" },
        { status: 404 }
      )
    }

    // Remove os arquivos físicos
    for (const file of medicalLeave.file) {
      const fileName = file.url.split("/").pop()
      if (fileName) {
        const path = join(process.cwd(), "public/uploads/medical-leaves", fileName)
        await unlink(path).catch(console.error) // Ignora erro se o arquivo não existir
      }
    }

    // Primeiro remove os arquivos do banco
    await prisma.file.deleteMany({
      where: {
        medicalLeaveId: id
      }
    })

    // Depois remove o atestado
    await prisma.medicalleave.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Atestado médico excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir atestado médico:", error)
    return NextResponse.json(
      { error: "Erro ao excluir atestado médico", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
} 