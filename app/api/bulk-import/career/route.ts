import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Dados recebidos:", data);

    // Pega apenas o primeiro registro
    const records = Array.isArray(data.career) ? [data.career[0]] : Array.isArray(data) ? [data[0]] : [data];
    console.log("Processando apenas o primeiro registro:", records[0]);

    const results = {
      success: 0,
      errors: [] as string[],
    };

    for (const record of records) {
      try {
        // Validar campos obrigatórios
        if (!record['CPF do Funcionario']) {
          throw new Error('CPF do funcionário é obrigatório');
        }

        if (!record['Departamento']) {
          throw new Error('Departamento é obrigatório');
        }

        if (!record['Cargo']) {
          throw new Error('Cargo é obrigatório');
        }

        if (!record['Faixa do Cargo']) {
          throw new Error('Faixa do cargo é obrigatória');
        }

        if (!record['Turno']) {
          throw new Error('Turno é obrigatório');
        }

        if (!record['Data da Alteracao']) {
          throw new Error('Data da alteração é obrigatória');
        }

        // Buscar funcionário pelo CPF
        const employee = await prisma.employee.findFirst({
          where: {
            cpf: record['CPF do Funcionario'].replace(/\D/g, ''), // Remove caracteres não numéricos
          },
        });

        if (!employee) {
          throw new Error(`Funcionário não encontrado com CPF: ${record['CPF do Funcionario']}`);
        }

        // Buscar departamento
        const department = await prisma.department.findFirst({
          where: {
            name: record['Departamento'],
          },
        });

        if (!department) {
          throw new Error(`Departamento não encontrado: ${record['Departamento']}`);
        }

        // Buscar cargo
        const position = await prisma.position.findFirst({
          where: {
            title: record['Cargo'],
            departmentId: department.id,
          },
        });

        if (!position) {
          throw new Error(`Cargo não encontrado: ${record['Cargo']} no departamento ${department.name}`);
        }

        // Buscar nível do cargo
        const positionLevel = await prisma.positionlevel.findFirst({
          where: {
            name: record['Faixa do Cargo'],
            positionId: position.id,
          },
        });

        if (!positionLevel) {
          throw new Error(`Faixa de cargo não encontrada: ${record['Faixa do Cargo']} para o cargo ${position.title}`);
        }

        // Buscar turno
        const shift = await prisma.shift.findFirst({
          where: {
            name: record['Turno'],
          },
        });

        if (!shift) {
          throw new Error(`Turno não encontrado: ${record['Turno']}`);
        }

        // Criar registro de carreira
        await prisma.employeehistory.create({
          data: {
            id: randomUUID(),
            employeeId: employee.id,
            positionLevelId: positionLevel.id,
            departmentId: department.id,
            shiftId: shift.id,
            startDate: new Date(record['Data da Alteracao']),
            updatedAt: new Date(),
          },
        });

        // Atualizar funcionário
        await prisma.employee.update({
          where: {
            id: employee.id,
          },
          data: {
            departmentId: department.id,
            positionLevelId: positionLevel.id,
            shiftId: shift.id,
          },
        });

        results.success++;
      } catch (error: any) {
        console.error("Erro ao processar registro:", error);
        results.errors.push(error.message);
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Erro ao processar importação:", error);
    return NextResponse.json(
      { error: "Erro ao processar importação", details: error.message },
      { status: 500 }
    );
  }
} 