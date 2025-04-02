const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedTrainings() {
  try {
    // Primeiro, vamos buscar um departamento existente
    const department = await prisma.department.findFirst()
    if (!department) {
      console.error('Nenhum departamento encontrado. Por favor, crie departamentos primeiro.')
      return
    }

    // Categorias de treinamento
    const categories = ['TECHNICAL', 'SOFT_SKILLS', 'LEADERSHIP', 'COMPLIANCE']
    const types = ['INDIVIDUAL', 'TEAM']
    const sources = ['INTERNAL', 'EXTERNAL']
    const status = ['PLANNED', 'IN_PROGRESS', 'COMPLETED']

    // Criar 10 treinamentos de exemplo
    for (let i = 0; i < 10; i++) {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30)) // Data aleatória nos próximos 30 dias

      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1) // 1-7 dias após a data de início

      const training = await prisma.training.create({
        data: {
          name: `Treinamento ${i + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          type: types[Math.floor(Math.random() * types.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          instructor: `Instrutor ${i + 1}`,
          startDate,
          endDate,
          hours: Math.floor(Math.random() * 40) + 8, // 8-48 horas
          status: status[Math.floor(Math.random() * status.length)],
          departmentId: department.id,
          description: `Descrição do treinamento ${i + 1}`
        }
      })

      console.log(`Criado treinamento: ${training.name}`)
    }

    console.log('Seed de treinamentos concluído com sucesso!')
  } catch (error) {
    console.error('Erro ao criar treinamentos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTrainings() 