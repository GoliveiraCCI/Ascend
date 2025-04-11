import { prisma } from "@/lib/prisma"
import TrainingsPage from "./components/trainings-page"

export default async function Page() {
  // Buscar treinamentos com participantes e departamento
  const trainings = await prisma.training.findMany({
    include: {
      trainingparticipant: {
        include: {
          employee: true
        }
      },
      department: true,
      trainingevaluation: true,
      trainingmaterial: true,
      trainingsession: true,
      trainingphoto: true
    },
    orderBy: {
      startDate: "desc"
    }
  })

  console.log("Page - Treinamentos carregados do banco:", trainings)
  console.log("Page - Número de treinamentos:", trainings.length)
  console.log("Page - Exemplo de treinamento:", trainings[0])

  // Buscar departamentos para os filtros
  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc"
    }
  })

  if (!departments) {
    throw new Error("Erro ao carregar departamentos")
  }

  return <TrainingsPage initialTrainings={trainings} departments={departments} />
}

