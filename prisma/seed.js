const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker/locale/pt_BR')

const prisma = new PrismaClient()

// Função para gerar matrícula única de 6 dígitos
let matriculaCounter = 1;
function generateMatricula() {
  const matricula = matriculaCounter.toString().padStart(6, '0');
  matriculaCounter++;
  return matricula;
}

async function main() {
  console.log('Iniciando seed...')

  // Limpar o banco de dados
  await prisma.medicalLeave.deleteMany()
  await prisma.employeeHistory.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.positionLevel.deleteMany()
  await prisma.position.deleteMany()
  await prisma.department.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.medicalLeaveCategory.deleteMany()

  // Criar turnos
  const shifts = [
    { name: "TURNO A", description: "Turno da manhã" },
    { name: "TURNO B", description: "Turno da tarde" },
    { name: "TURNO C", description: "Turno da noite" },
    { name: "ADM", description: "Turno administrativo" }
  ]

  const createdShifts = await Promise.all(
    shifts.map(shift => 
      prisma.shift.create({
        data: shift
      })
    )
  )
  console.log("Turnos criados:", createdShifts)

  // Criar departamentos
  const departments = [
    { name: "Departamento Administrativo", code: "ADM" },
    { name: "Departamento Jurídico", code: "JUR" },
    { name: "Departamento Comercial", code: "COM" },
    { name: "Departamento Suporte", code: "SUP" },
    { name: "Departamento TI", code: "TI" },
    { name: "Departamento RH", code: "RH" },
    { name: "Departamento Financeiro", code: "FIN" },
    { name: "Departamento Marketing", code: "MKT" },
    { name: "Departamento Operacional", code: "OPE" },
    { name: "Departamento Qualidade", code: "QUAL" }
  ]

  for (const dept of departments) {
    const existingDept = await prisma.department.findFirst({
      where: {
        OR: [
          { name: dept.name },
          { code: dept.code }
        ]
      }
    })

    if (!existingDept) {
      await prisma.department.create({
        data: {
          name: dept.name,
          code: dept.code
        }
      })
      console.log(`Departamento ${dept.name} criado`)
    } else {
      console.log(`Departamento ${dept.name} já existe`)
    }
  }

  // Criar cargos
  const positions = [
    { title: "Analista", description: "Analista de Sistemas", departmentCode: "TI" },
    { title: "Desenvolvedor", description: "Desenvolvedor Full Stack", departmentCode: "TI" },
    { title: "Gerente", description: "Gerente de Projetos", departmentCode: "TI" },
    { title: "Coordenador", description: "Coordenador de Equipe", departmentCode: "ADM" },
    { title: "Assistente", description: "Assistente Administrativo", departmentCode: "ADM" },
    { title: "Consultor", description: "Consultor de Negócios", departmentCode: "COM" },
    { title: "Especialista", description: "Especialista Técnico", departmentCode: "TI" },
    { title: "Supervisor", description: "Supervisor de Operações", departmentCode: "OPE" },
    { title: "Diretor", description: "Diretor de Departamento", departmentCode: "ADM" },
    { title: "Analista Jr", description: "Analista Júnior", departmentCode: "TI" }
  ]

  const createdPositions = []

  for (const pos of positions) {
    const existingPos = await prisma.position.findFirst({
      where: { title: pos.title }
    })

    if (!existingPos) {
      const department = await prisma.department.findFirst({
        where: { code: pos.departmentCode }
      })

      if (department) {
        const position = await prisma.position.create({
          data: {
            title: pos.title,
            description: pos.description,
            departmentId: department.id
          }
        })

        // Criar faixas de cargo
        const positionLevels = await Promise.all([
          prisma.positionLevel.create({
            data: {
              name: "Júnior",
              salary: 5000,
              positionId: position.id
            }
          }),
          prisma.positionLevel.create({
            data: {
              name: "Pleno",
              salary: 6000,
              positionId: position.id
            }
          }),
          prisma.positionLevel.create({
            data: {
              name: "Sênior",
              salary: 7000,
              positionId: position.id
            }
          })
        ])

        createdPositions.push({ ...position, levels: positionLevels })
        console.log(`Cargo ${pos.title} criado no departamento ${department.name}`)
      } else {
        console.log(`Departamento ${pos.departmentCode} não encontrado para o cargo ${pos.title}`)
      }
    } else {
      console.log(`Cargo ${pos.title} já existe`)
    }
  }

  // Criar funcionários
  const employees = []
  for (let i = 0; i < 100; i++) {
    const department = await prisma.department.findFirst({
      skip: Math.floor(Math.random() * 10)
    })
    const position = createdPositions[Math.floor(Math.random() * createdPositions.length)]
    const positionLevel = position.levels[Math.floor(Math.random() * position.levels.length)]
    const shift = createdShifts[Math.floor(Math.random() * createdShifts.length)]

    const employee = await prisma.employee.create({
      data: {
        matricula: generateMatricula(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        cpf: faker.string.numeric(11),
        birthDate: faker.date.past({ years: 40 }),
        hireDate: faker.date.past({ years: 5 }),
        terminationDate: Math.random() > 0.8 ? faker.date.recent() : null,
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        active: Math.random() > 0.8 ? false : true,
        departmentId: department.id,
        positionId: position.id,
        positionLevelId: positionLevel.id,
        shiftId: shift.id
      }
    })

    // Criar histórico inicial
    await prisma.employeeHistory.create({
      data: {
        employeeId: employee.id,
        positionLevelId: positionLevel.id,
        departmentId: department.id,
        shiftId: shift.id,
        startDate: employee.hireDate
      }
    })

    employees.push(employee)
    console.log(`Funcionário ${i + 1}/100 criado com turno ${shift.name}`)
  }

  // Criar categorias de licença médica
  const categories = [
    { name: 'Doença', description: 'Afastamento por doença' },
    { name: 'Acidente de Trabalho', description: 'Afastamento por acidente de trabalho' },
    { name: 'Cirurgia', description: 'Afastamento para realização de cirurgia' },
    { name: 'Maternidade', description: 'Licença maternidade' },
    { name: 'Paternidade', description: 'Licença paternidade' },
    { name: 'Outros', description: 'Outros tipos de afastamento' },
  ]

  console.log('Criando categorias de licença médica...')
  for (const category of categories) {
    await prisma.medicalLeaveCategory.create({
      data: category,
    })
  }

  // Criar licenças médicas
  console.log('Criando licenças médicas...')
  const medicalLeaveCategories = await prisma.medicalLeaveCategory.findMany()

  for (let i = 0; i < 50; i++) {
    const employee = employees[Math.floor(Math.random() * employees.length)]
    const category = medicalLeaveCategories[Math.floor(Math.random() * medicalLeaveCategories.length)]
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30))
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 15) + 1)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    await prisma.medicalLeave.create({
      data: {
        employee: {
          connect: {
            id: employee.id,
          },
        },
        category: {
          connect: {
            id: category.id,
          },
        },
        startDate,
        endDate,
        days,
        reason: faker.lorem.sentence(),
        status: Math.random() > 0.5 ? 'FINALIZADO' : 'AFASTADO',
        doctor: `Dr. ${faker.person.fullName()}`,
        hospital: faker.company.name() + ' Hospital',
        notes: faker.lorem.sentence(),
      },
    })
    console.log(`Licença médica ${i + 1}/50 criada`)
  }

  console.log('Seed concluído com sucesso!')

  // Criar treinamentos
  console.log('Criando treinamentos...')
  
  const trainingCategories = ['TECHNICAL', 'SOFT_SKILLS', 'LEADERSHIP', 'COMPLIANCE']
  const trainingTypes = ['INDIVIDUAL', 'TEAM']
  const trainingSources = ['INTERNAL', 'EXTERNAL']
  const trainingStatus = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  
  const trainings = []
  for (let i = 0; i < 30; i++) {
    const department = await prisma.department.findFirst({
      skip: Math.floor(Math.random() * 10)
    })

    const startDate = faker.date.future({ years: 1 })
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 1)

    const training = await prisma.training.create({
      data: {
        name: faker.company.catchPhrase(),
        category: trainingCategories[Math.floor(Math.random() * trainingCategories.length)],
        type: trainingTypes[Math.floor(Math.random() * trainingTypes.length)],
        source: trainingSources[Math.floor(Math.random() * trainingSources.length)],
        instructor: faker.person.fullName(),
        institution: faker.company.name(),
        startDate,
        endDate,
        hours: Math.floor(Math.random() * 40) + 8,
        status: trainingStatus[Math.floor(Math.random() * trainingStatus.length)],
        description: faker.lorem.paragraph(),
        departmentId: department.id
      }
    })

    // Adicionar participantes
    const numParticipants = Math.floor(Math.random() * 10) + 1
    const departmentEmployees = await prisma.employee.findMany({
      where: { departmentId: department.id }
    })

    for (let j = 0; j < numParticipants && j < departmentEmployees.length; j++) {
      await prisma.trainingParticipant.create({
        data: {
          trainingId: training.id,
          employeeId: departmentEmployees[j].id,
          status: Math.random() > 0.3 ? 'COMPLETED' : 'ENROLLED',
          score: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 60 : null,
          notes: faker.lorem.sentence()
        }
      })
    }

    // Adicionar materiais
    const numMaterials = Math.floor(Math.random() * 5) + 1
    for (let j = 0; j < numMaterials; j++) {
      await prisma.trainingMaterial.create({
        data: {
          trainingId: training.id,
          name: `Material ${j + 1} - ${faker.commerce.productName()}`,
          type: ['PDF', 'DOC', 'PPT', 'VIDEO'][Math.floor(Math.random() * 4)],
          url: faker.internet.url(),
          size: Math.floor(Math.random() * 10000000)
        }
      })
    }

    // Adicionar sessões
    const numSessions = Math.floor(Math.random() * 5) + 1
    let sessionDate = new Date(startDate)
    for (let j = 0; j < numSessions; j++) {
      await prisma.trainingSession.create({
        data: {
          trainingId: training.id,
          date: sessionDate,
          startTime: '09:00',
          endTime: '17:00',
          topic: faker.company.catchPhrase(),
          description: faker.lorem.paragraph()
        }
      })
      sessionDate.setDate(sessionDate.getDate() + 7)
    }

    // Adicionar fotos
    const numPhotos = Math.floor(Math.random() * 3)
    for (let j = 0; j < numPhotos; j++) {
      await prisma.trainingPhoto.create({
        data: {
          trainingId: training.id,
          url: faker.image.url(),
          caption: faker.lorem.sentence()
        }
      })
    }

    // Adicionar avaliações
    if (Math.random() > 0.5) {
      await prisma.trainingEvaluation.create({
        data: {
          trainingId: training.id,
          type: Math.random() > 0.5 ? 'PRACTICAL_TEST' : 'SATISFACTION_SURVEY',
          date: endDate,
          averageScore: Math.floor(Math.random() * 40) + 60,
          notes: faker.lorem.paragraph()
        }
      })
    }

    trainings.push(training)
    console.log(`Treinamento ${i + 1}/30 criado`)
  }

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