import { prisma } from "../lib/prisma";

async function main() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        department: {
          select: {
            name: true
          }
        },
        position: {
          select: {
            title: true
          }
        },
        positionlevel: {
          select: {
            name: true
          }
        },
        shift: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log("Funcionários encontrados:", employees);
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
  }
}

main(); 