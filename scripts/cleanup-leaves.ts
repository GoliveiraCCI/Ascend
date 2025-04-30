import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function cleanupLeaves() {
  try {
    // Primeiro, contar quantos atestados existem
    const totalLeaves = await prisma.medicalleave.count()
    console.log(`Afastamentos: ${totalLeaves}`)

    if (totalLeaves <= 5) {
      console.log("Já existem 5 ou menos atestados. Nenhuma ação necessária.")
      return
    }

    // Buscar os 5 atestados mais recentes
    const recentLeaves = await prisma.medicalleave.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5,
      select: {
        id: true
      }
    })

    // Excluir todos os atestados exceto os 5 mais recentes
    const leavesToDelete = await prisma.medicalleave.deleteMany({
      where: {
        id: {
          notIn: recentLeaves.map(leave => leave.id)
        }
      }
    })

    console.log(`Foram excluídos ${leavesToDelete.count} atestados.`)
    console.log("Agora existem apenas 5 atestados no banco de dados.")

  } catch (error) {
    console.error("Erro ao limpar atestados:", error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupLeaves() 