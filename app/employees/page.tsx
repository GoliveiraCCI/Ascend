import { prisma } from "@/lib/prisma"
import { EmployeesTab } from "@/components/forms/EmployeesTab"

async function getData() {
  try {
    console.log("=== Iniciando busca de dados no servidor ===")
    
    // Buscar funcionários
    console.log("Buscando funcionários...")
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        matricula: true,
        name: true,
        email: true,
        cpf: true,
        birthDate: true,
        hireDate: true,
        terminationDate: true,
        active: true,
        phone: true,
        address: true,
        department: {
          select: {
            id: true,
            name: true
          }
        },
        position: {
          select: {
            id: true,
            title: true
          }
        },
        positionlevel: {
          select: {
            id: true,
            name: true
          }
        },
        shift: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    console.log("Total de funcionários encontrados:", employees.length)

    // Buscar departamentos
    console.log("Buscando departamentos...")
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: "asc"
      }
    })

    console.log("Total de departamentos encontrados:", departments.length)

    // Buscar cargos
    console.log("Buscando cargos...")
    const positions = await prisma.position.findMany({
      select: {
        id: true,
        title: true
      },
      orderBy: {
        title: "asc"
      }
    })

    console.log("Total de cargos encontrados:", positions.length)

    // Buscar níveis de cargo
    console.log("Buscando níveis de cargo...")
    const positionLevels = await prisma.positionLevel.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: "asc"
      }
    })

    console.log("Total de níveis de cargo encontrados:", positionLevels.length)

    // Buscar turnos
    console.log("Buscando turnos...")
    const shifts = await prisma.shift.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: "asc"
      }
    })

    console.log("Total de turnos encontrados:", shifts.length)

    return {
      employees,
      departments,
      positions,
      positionLevels,
      shifts
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    throw error
  }
}

export default async function EmployeesPage() {
  const data = await getData()

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
        <p className="text-muted-foreground">Gerencie os funcionários da empresa.</p>
      </div>

      <EmployeesTab
        employees={data.employees}
        departments={data.departments}
        positions={data.positions}
        positionLevels={data.positionLevels}
        shifts={data.shifts}
      />
    </div>
  )
}

