import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Verificar departamentos
  const departments = await prisma.department.findMany()
  console.log('Departamentos:', departments)

  // Verificar cargos
  const positions = await prisma.position.findMany({
    include: {
      department: true
    }
  })
  console.log('Cargos:', positions)

  // Verificar níveis de cargo
  const positionLevels = await prisma.positionlevel.findMany({
    include: {
      position: {
        include: {
          department: true
        }
      }
    }
  })
  console.log('Níveis de cargo:', positionLevels)

  // Verificar turnos
  const shifts = await prisma.shift.findMany()
  console.log('Turnos:', shifts)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  }) 