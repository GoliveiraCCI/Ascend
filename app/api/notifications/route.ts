import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Erro ao buscar notificações:", error)
    return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { type, message, evaluationId } = body

    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type,
        message,
        evaluationId,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Erro ao criar notificação:", error)
    return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")

    if (!notificationId) {
      return NextResponse.json({ error: "ID da notificação é obrigatório" }, { status: 400 })
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Erro ao atualizar notificação:", error)
    return NextResponse.json({ error: "Erro ao atualizar notificação" }, { status: 500 })
  }
} 