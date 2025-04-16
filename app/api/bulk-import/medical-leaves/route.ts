import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const medicalLeaves = data.medicalLeaves || [];

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const record of medicalLeaves) {
      try {
        console.log('Processando registro:', record);

        // Validar e converter datas
        const startDate = new Date(record['Data de Inicio'].split('/').reverse().join('-'));
        const endDate = new Date(record['Data de Termino'].split('/').reverse().join('-'));

        // Calcular dias de afastamento
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Buscar funcionário pelo CPF
        const employee = await prisma.employee.findUnique({
          where: { cpf: record['CPF do Funcionario'] }
        });

        if (!employee) {
          throw new Error(`Funcionário não encontrado: ${record['CPF do Funcionario']}`);
        }

        // Buscar ou criar categoria
        const categoryName = record['Categoria'] || 'Não Informado'; // Valor padrão se não for informado
        let category = await prisma.medicalleavecategory.findFirst({
          where: { name: categoryName }
        });

        if (!category) {
          // Se a categoria não existir, criar uma nova
          category = await prisma.medicalleavecategory.create({
            data: {
              id: randomUUID(),
              name: categoryName,
              description: `Categoria criada automaticamente para ${categoryName}`,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        }

        // Preparar dados do atestado
        const medicalLeaveData = {
          id: randomUUID(),
          employeeId: employee.id,
          startDate,
          endDate,
          days,
          reason: record['Motivo'] || 'Não informado',
          doctor: record['Medico'] || 'Não informado',
          notes: record['Observacoes'] || '',
          status: record['Status'] || 'AFASTADO',
          categoryId: category.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log('Dados do atestado:', medicalLeaveData);

        // Criar o atestado
        const createdLeave = await prisma.medicalleave.create({
          data: medicalLeaveData
        });

        console.log('Atestado criado com sucesso:', createdLeave);
        results.success++;
      } catch (error) {
        console.error('Erro ao processar registro:', error);
        results.failed++;
        results.errors.push(`Erro ao importar atestado para CPF ${record['CPF do Funcionario']}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao processar importação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar importação de atestados médicos' },
      { status: 500 }
    );
  }
} 