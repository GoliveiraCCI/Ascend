import { prisma } from "@/lib/prisma"
import { EmployeesTab } from "@/components/forms/EmployeesTab"
import { Suspense } from "react"

async function getData() {
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
      positionLevel: {
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
      },
      medicalleave: {
        where: {
          status: "AFASTADO",
          endDate: {
            gte: new Date()
          }
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          status: true,
          reason: true,
          notes: true,
          days: true,
          doctor: true,
          hospital: true
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  })

  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true
    }
  })

  const positions = await prisma.position.findMany({
    select: {
      id: true,
      title: true
    }
  })

  const positionLevels = await prisma.positionLevel.findMany({
    select: {
      id: true,
      name: true
    }
  })

  const shifts = await prisma.shift.findMany({
    select: {
      id: true,
      name: true
    }
  })

  return {
    employees,
    departments,
    positions,
    positionLevels,
    shifts
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

      <Suspense fallback={<div>Carregando...</div>}>
        <EmployeesTab
          employees={data.employees}
          departments={data.departments}
          positions={data.positions}
          positionLevels={data.positionLevels}
          shifts={data.shifts}
        />
      </Suspense>
    </div>
  )
} 