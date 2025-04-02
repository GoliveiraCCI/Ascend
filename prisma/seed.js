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
  await prisma.evaluationAnswer.deleteMany()
  await prisma.evaluationQuestion.deleteMany()
  await prisma.evaluationCategory.deleteMany()
  await prisma.evaluation.deleteMany()
  await prisma.evaluationTemplate.deleteMany()
  await prisma.trainingEvaluation.deleteMany()
  await prisma.trainingPhoto.deleteMany()
  await prisma.trainingSession.deleteMany()
  await prisma.trainingMaterial.deleteMany()
  await prisma.trainingParticipant.deleteMany()
  await prisma.training.deleteMany()
  await prisma.medicalLeave.deleteMany()
  await prisma.medicalLeaveCategory.deleteMany()
  await prisma.employeeHistory.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.positionLevel.deleteMany()
  await prisma.position.deleteMany()
  await prisma.department.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.user.deleteMany()

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

  // Criar categorias de avaliação
  console.log('Criando categorias de avaliação...')
  const evaluationCategories = [
    { id: 'technical', name: 'Habilidades Técnicas', description: 'Avaliação das competências técnicas do funcionário' },
    { id: 'communication', name: 'Comunicação', description: 'Avaliação das habilidades de comunicação' },
    { id: 'teamwork', name: 'Trabalho em Equipe', description: 'Avaliação da capacidade de trabalho em equipe' },
    { id: 'leadership', name: 'Liderança', description: 'Avaliação das habilidades de liderança' },
    { id: 'problem_solving', name: 'Resolução de Problemas', description: 'Avaliação da capacidade de resolver problemas' },
    { id: 'adaptability', name: 'Adaptabilidade', description: 'Avaliação da capacidade de adaptação' }
  ]

  for (const category of evaluationCategories) {
    await prisma.evaluationCategory.create({
      data: category
    })
  }

  // Criar questões de avaliação
  console.log('Criando questões de avaliação...')
  const evaluationQuestions = {
    technical: [
      { text: 'Domínio das tecnologias utilizadas', category: 'technical' },
      { text: 'Qualidade do código produzido', category: 'technical' },
      { text: 'Capacidade de resolver problemas técnicos', category: 'technical' },
      { text: 'Conhecimento das melhores práticas', category: 'technical' }
    ],
    communication: [
      { text: 'Clareza na comunicação', category: 'communication' },
      { text: 'Capacidade de apresentar ideias', category: 'communication' },
      { text: 'Escuta ativa', category: 'communication' },
      { text: 'Comunicação escrita', category: 'communication' }
    ],
    teamwork: [
      { text: 'Colaboração com colegas', category: 'teamwork' },
      { text: 'Participação em reuniões', category: 'teamwork' },
      { text: 'Compartilhamento de conhecimento', category: 'teamwork' },
      { text: 'Respeito às diferenças', category: 'teamwork' }
    ],
    leadership: [
      { text: 'Capacidade de tomar decisões', category: 'leadership' },
      { text: 'Gestão de conflitos', category: 'leadership' },
      { text: 'Mentoria de colegas', category: 'leadership' },
      { text: 'Visão estratégica', category: 'leadership' }
    ],
    problem_solving: [
      { text: 'Identificação de problemas', category: 'problem_solving' },
      { text: 'Análise de situações', category: 'problem_solving' },
      { text: 'Proposta de soluções', category: 'problem_solving' },
      { text: 'Implementação de soluções', category: 'problem_solving' }
    ],
    adaptability: [
      { text: 'Flexibilidade para mudanças', category: 'adaptability' },
      { text: 'Aprendizado contínuo', category: 'adaptability' },
      { text: 'Resiliência', category: 'adaptability' },
      { text: 'Iniciativa', category: 'adaptability' }
    ]
  }

  for (const [category, questions] of Object.entries(evaluationQuestions)) {
    for (const question of questions) {
      await prisma.evaluationQuestion.create({
        data: {
          text: question.text,
          category: {
            connect: {
              id: category
            }
          }
        }
      })
    }
  }

  // Criar templates de avaliação
  console.log('Criando templates de avaliação...')
  const templates = [
    { name: 'Avaliação Trimestral', description: 'Avaliação de desempenho trimestral' },
    { name: 'Avaliação Semestral', description: 'Avaliação de desempenho semestral' },
    { name: 'Avaliação Anual', description: 'Avaliação de desempenho anual' }
  ]

  for (const template of templates) {
    await prisma.evaluationTemplate.create({
      data: template
    })
  }

  // Criar usuários avaliadores
  console.log('Criando usuários avaliadores...')
  const evaluators = []
  for (let i = 0; i < 10; i++) {
    const evaluator = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'EVALUATOR'
      }
    })
    evaluators.push(evaluator)
    console.log(`Usuário avaliador ${i + 1}/10 criado`)
  }

  // Criar avaliações
  console.log('Criando avaliações...')
  const templatesList = await prisma.evaluationTemplate.findMany()
  const questionsList = await prisma.evaluationQuestion.findMany()

  for (let i = 0; i < 30; i++) {
    const employee = employees[Math.floor(Math.random() * employees.length)]
    const template = templatesList[Math.floor(Math.random() * templatesList.length)]
    const evaluator = evaluators[Math.floor(Math.random() * evaluators.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    const evaluation = await prisma.evaluation.create({
      data: {
        employee: {
          connect: {
            id: employee.id
          }
        },
        evaluator: {
          connect: {
            id: evaluator.id
          }
        },
        template: {
          connect: {
            id: template.id
          }
        },
        date,
        status: Math.random() > 0.5 ? 'COMPLETED' : 'IN_PROGRESS',
        score: Math.floor(Math.random() * 5) + 5,
        selfEvaluation: Math.random() > 0.5,
        selfEvaluationStatus: Math.random() > 0.5 ? 'COMPLETED' : 'IN_PROGRESS',
        selfStrengths: faker.lorem.paragraph(),
        selfImprovements: faker.lorem.paragraph(),
        selfGoals: faker.lorem.paragraph(),
        managerEvaluation: Math.random() > 0.5,
        managerEvaluationStatus: Math.random() > 0.5 ? 'COMPLETED' : 'IN_PROGRESS',
        managerStrengths: faker.lorem.paragraph(),
        managerImprovements: faker.lorem.paragraph(),
        managerGoals: faker.lorem.paragraph()
      }
    })

    // Criar respostas para cada questão
    for (const question of questionsList) {
      await prisma.evaluationAnswer.create({
        data: {
          evaluation: {
            connect: {
              id: evaluation.id
            }
          },
          question: {
            connect: {
              id: question.id
            }
          },
          selfScore: Math.floor(Math.random() * 5) + 5,
          managerScore: Math.floor(Math.random() * 5) + 5,
          selfComment: faker.lorem.sentence(),
          managerComment: faker.lorem.sentence()
        }
      })
    }

    console.log(`Avaliação ${i + 1}/30 criada`)
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