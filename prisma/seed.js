const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker/locale/pt_BR')

const prisma = new PrismaClient()

function generateUniqueMatricula() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
}

async function main() {
  console.log('Iniciando seed...')

  // Deletar registros existentes
  await prisma.evaluationAnswer.deleteMany({})
  await prisma.evaluationQuestion.deleteMany({})
  await prisma.evaluationCategory.deleteMany({})
  await prisma.evaluation.deleteMany({})
  await prisma.evaluationTemplate.deleteMany({})
  await prisma.trainingEvaluation.deleteMany({})
  await prisma.trainingPhoto.deleteMany({})
  await prisma.trainingSession.deleteMany({})
  await prisma.trainingMaterial.deleteMany({})
  await prisma.trainingParticipant.deleteMany({})
  await prisma.training.deleteMany({})
  await prisma.medicalLeave.deleteMany({})
  await prisma.medicalLeaveCategory.deleteMany({})
  await prisma.employeeHistory.deleteMany({})
  await prisma.employee.deleteMany({})
  await prisma.positionLevel.deleteMany({})
  await prisma.position.deleteMany({})
  await prisma.department.deleteMany({})
  await prisma.shift.deleteMany({})
  await prisma.user.deleteMany({})

  // Criar usuário do sistema
  const systemUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@ascend.com',
      password: '$2a$10$GmVyQv5OqA/hPj5deR/Kn.kX4KbMtg3aCQRyy9oKEYoNXHX0dHdHm', // senha: admin
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  console.log("Usuário system criado:", systemUser)

  // Criar turnos
  const morningShift = await prisma.shift.create({
    data: {
      name: 'Manhã',
      startTime: '08:00',
      endTime: '12:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const afternoonShift = await prisma.shift.create({
    data: {
      name: 'Tarde',
      startTime: '13:00',
      endTime: '17:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar departamentos
  const hrDepartment = await prisma.department.create({
    data: {
      name: 'Recursos Humanos',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const itDepartment = await prisma.department.create({
    data: {
      name: 'Tecnologia da Informação',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar níveis de cargo
  const juniorLevel = await prisma.positionLevel.create({
    data: {
      name: 'Júnior',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const seniorLevel = await prisma.positionLevel.create({
    data: {
      name: 'Sênior',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar cargos
  const hrAnalyst = await prisma.position.create({
    data: {
      name: 'Analista de RH',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const developer = await prisma.position.create({
    data: {
      name: 'Desenvolvedor',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar funcionários
  const employee1 = await prisma.employee.create({
    data: {
      name: 'João Silva',
      matricula: generateUniqueMatricula(),
      email: 'joao.silva@ascend.com',
      cpf: '12345678901',
      birthDate: new Date('1990-01-01'),
      admissionDate: new Date('2023-01-01'),
      departmentId: hrDepartment.id,
      positionId: hrAnalyst.id,
      positionLevelId: juniorLevel.id,
      shiftId: morningShift.id,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const employee2 = await prisma.employee.create({
    data: {
      name: 'Maria Santos',
      matricula: generateUniqueMatricula(),
      email: 'maria.santos@ascend.com',
      cpf: '98765432101',
      birthDate: new Date('1995-05-15'),
      admissionDate: new Date('2023-02-01'),
      departmentId: itDepartment.id,
      positionId: developer.id,
      positionLevelId: seniorLevel.id,
      shiftId: afternoonShift.id,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar categorias de licença médica
  const sickLeave = await prisma.medicalLeaveCategory.create({
    data: {
      name: 'Atestado Médico',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const maternityLeave = await prisma.medicalLeaveCategory.create({
    data: {
      name: 'Licença Maternidade',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar licenças médicas
  await prisma.medicalLeave.create({
    data: {
      employeeId: employee1.id,
      categoryId: sickLeave.id,
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-03-03'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  await prisma.medicalLeave.create({
    data: {
      employeeId: employee2.id,
      categoryId: maternityLeave.id,
      startDate: new Date('2023-04-01'),
      endDate: new Date('2023-10-01'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar categorias de avaliação
  const technicalSkills = await prisma.evaluationCategory.create({
    data: {
      name: 'Habilidades Técnicas',
      weight: 40,
      departmentId: itDepartment.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const softSkills = await prisma.evaluationCategory.create({
    data: {
      name: 'Habilidades Comportamentais',
      weight: 60,
      departmentId: itDepartment.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar avaliação
  const evaluation = await prisma.evaluation.create({
    data: {
      employeeId: employee2.id,
      evaluatorId: employee1.id,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-06-30'),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar questões da avaliação
  const question1 = await prisma.evaluationQuestion.create({
    data: {
      categoryId: technicalSkills.id,
      question: 'Como você avalia o conhecimento técnico do funcionário?',
      weight: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const question2 = await prisma.evaluationQuestion.create({
    data: {
      categoryId: softSkills.id,
      question: 'Como você avalia a capacidade de trabalho em equipe?',
      weight: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Criar respostas da avaliação
  await prisma.evaluationAnswer.create({
    data: {
      evaluationId: evaluation.id,
      questionId: question1.id,
      score: 4,
      comment: 'Demonstra bom conhecimento técnico',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  await prisma.evaluationAnswer.create({
    data: {
      evaluationId: evaluation.id,
      questionId: question2.id,
      score: 5,
      comment: 'Excelente trabalho em equipe',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 