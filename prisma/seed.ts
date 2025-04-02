import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/pt_BR'

const prisma = new PrismaClient()

const departments = [
  { code: 'ADM', name: 'Administrativo', positions: ['Auxiliar Administrativo', 'Assistente Administrativo', 'Analista Administrativo'] },
  { code: 'FIN', name: 'Financeiro', positions: ['Auxiliar Financeiro', 'Analista Financeiro', 'Contador', 'Gerente Financeiro'] },
  { code: 'RH', name: 'Recursos Humanos', positions: ['Auxiliar de RH', 'Analista de RH', 'Coordenador de RH', 'Gerente de RH'] },
  { code: 'TI', name: 'TI', positions: ['Desenvolvedor Júnior', 'Desenvolvedor Pleno', 'Desenvolvedor Sênior', 'Arquiteto de Software', 'Gerente de TI'] },
  { code: 'MKT', name: 'Marketing', positions: ['Assistente de Marketing', 'Analista de Marketing', 'Coordenador de Marketing', 'Gerente de Marketing'] },
  { code: 'VND', name: 'Vendas', positions: ['Vendedor', 'Consultor de Vendas', 'Coordenador de Vendas', 'Gerente de Vendas'] },
  { code: 'OPE', name: 'Operacional', positions: ['Operador', 'Supervisor Operacional', 'Coordenador Operacional', 'Gerente Operacional'] },
  { code: 'JUR', name: 'Jurídico', positions: ['Assistente Jurídico', 'Analista Jurídico', 'Advogado', 'Gerente Jurídico'] },
  { code: 'COM', name: 'Comercial', positions: ['Assistente Comercial', 'Analista Comercial', 'Coordenador Comercial', 'Gerente Comercial'] },
  { code: 'SUP', name: 'Suporte', positions: ['Atendente de Suporte', 'Analista de Suporte', 'Coordenador de Suporte', 'Gerente de Suporte'] }
]

const shifts = [
  { name: 'Manhã', startTime: '08:00', endTime: '17:00', description: 'Turno da manhã' },
  { name: 'Tarde', startTime: '13:00', endTime: '22:00', description: 'Turno da tarde' },
  { name: 'Noite', startTime: '22:00', endTime: '07:00', description: 'Turno da noite' },
  { name: 'Integral', startTime: '08:00', endTime: '18:00', description: 'Turno integral' }
]

// Função para gerar matrícula única de 6 dígitos
let matriculaCounter = 1;
function generateMatricula(): string {
  const matricula = matriculaCounter.toString().padStart(6, '0');
  matriculaCounter++;
  return matricula;
}

async function main() {
  console.log('Iniciando seed...')

  // Limpar o banco de dados
  await prisma.medicalLeave.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.position.deleteMany()
  await prisma.department.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.medicalLeaveCategory.deleteMany()

  // Criar categorias de licença médica
  const medicalLeaveCategories = await Promise.all([
    prisma.medicalLeaveCategory.create({
      data: {
        name: "Doença",
        description: "Licença por motivo de doença"
      }
    }),
    prisma.medicalLeaveCategory.create({
      data: {
        name: "Acidente",
        description: "Licença por motivo de acidente"
      }
    }),
    prisma.medicalLeaveCategory.create({
      data: {
        name: "Cirurgia",
        description: "Licença por motivo de cirurgia"
      }
    }),
    prisma.medicalLeaveCategory.create({
      data: {
        name: "Maternidade",
        description: "Licença maternidade"
      }
    }),
    prisma.medicalLeaveCategory.create({
      data: {
        name: "Paternidade",
        description: "Licença paternidade"
      }
    })
  ])

  console.log("Categorias de licença médica criadas:", medicalLeaveCategories)

  // Criar turnos
  const createdShifts = await Promise.all([
    prisma.shift.create({
      data: {
        name: "TURNO A",
        startTime: "07:00",
        endTime: "15:00",
        description: "Turno da manhã"
      }
    }),
    prisma.shift.create({
      data: {
        name: "TURNO B",
        startTime: "15:00",
        endTime: "23:00",
        description: "Turno da tarde"
      }
    }),
    prisma.shift.create({
      data: {
        name: "TURNO C",
        startTime: "23:00",
        endTime: "07:00",
        description: "Turno da noite"
      }
    }),
    prisma.shift.create({
      data: {
        name: "ADM",
        startTime: "08:00",
        endTime: "18:00",
        description: "Turno administrativo"
      }
    })
  ])

  console.log("Turnos criados:", createdShifts)

  // Criar departamentos
  const createdDepartments = await Promise.all([
    prisma.department.create({
      data: {
        name: "Departamento Administrativo",
        code: "ADM"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento Jurídico",
        code: "JUR"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento Financeiro",
        code: "FIN"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento de Recursos Humanos",
        code: "RH"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento de Tecnologia",
        code: "TEC"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento de Marketing",
        code: "MKT"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento de Vendas",
        code: "VND"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento de Operações",
        code: "OPE"
      }
    }),
    prisma.department.create({
      data: {
        name: "Departamento de Qualidade",
        code: "QAL"
      }
    })
  ])

  console.log('Departamentos criados com sucesso')

  // Criar cargos
  const positions = await Promise.all(
    createdDepartments.map(async (department) => {
      const position = await prisma.position.create({
        data: {
          title: `Cargo ${department.name}`,
          description: `Cargo do departamento ${department.name}`,
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

      return position
    })
  )
  console.log('Cargos criados com sucesso')

  // Buscar todos os departamentos e cargos
  const allDepartments = await prisma.department.findMany({
    include: {
      positions: true
    }
  })

  // Criar 100 funcionários
  const employees = await Promise.all(
    Array.from({ length: 100 }, async (_, index) => {
      const department = allDepartments[Math.floor(Math.random() * allDepartments.length)]
      const position = positions.find(p => p.departmentId === department.id)!
      const positionLevels = await prisma.positionLevel.findMany({
        where: { positionId: position.id }
      })
      const positionLevel = positionLevels[Math.floor(Math.random() * positionLevels.length)]
      const shift = createdShifts[Math.floor(Math.random() * createdShifts.length)]
      
      const birthDate = faker.date.past({ years: 40 })
      const hireDate = faker.date.past({ years: 5 })
      const isActive = Math.random() > 0.2 // 80% de chance de estar ativo
      const hasTermination = !isActive && Math.random() > 0.5 // 50% de chance de ter data de demissão se inativo
      const terminationDate = hasTermination ? faker.date.between({ from: hireDate, to: new Date() }) : null

      const employee = await prisma.employee.create({
        data: {
          matricula: generateMatricula(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          cpf: faker.string.numeric(11),
          birthDate: birthDate.toISOString(),
          hireDate: hireDate.toISOString(),
          terminationDate: terminationDate?.toISOString() || null,
          departmentId: department.id,
          positionId: position.id,
          positionLevelId: positionLevel.id,
          shiftId: shift.id,
          phone: faker.phone.number('(##) #####-####'),
          address: faker.location.streetAddress(),
          active: isActive
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

      return employee
    })
  )

  // Criar licenças médicas
  const medicalLeaves = await Promise.all(
    Array.from({ length: 50 }, async (_, index) => {
      const employee = employees[Math.floor(Math.random() * employees.length)]
      const startDate = faker.date.past({ years: 1 })
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1)
      const status = Math.random() < 0.7 ? "APROVADA" : "PENDENTE"
      const category = medicalLeaveCategories[Math.floor(Math.random() * medicalLeaveCategories.length)]

      return prisma.medicalLeave.create({
        data: {
          employeeId: employee.id,
          categoryId: category.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          days: Math.floor(Math.random() * 30) + 1,
          reason: `Motivo da licença ${index + 1}`,
          status,
          doctor: `Dr. ${faker.person.fullName()}`,
          hospital: `Hospital ${faker.company.name()}`
        }
      })
    })
  )

  console.log('Seed concluído com sucesso!')
  console.log(`${createdDepartments.length} departamentos criados`)
  console.log(`${positions.length} cargos criados`)
  console.log(`${employees.length} funcionários criados`)
  console.log(`${medicalLeaves.length} licenças médicas criadas`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 