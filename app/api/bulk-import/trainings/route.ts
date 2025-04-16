import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { TrainingCategory, TrainingSource, TrainingStatus } from "@prisma/client";

// Mapeamento de valores em português para os valores do enum
const statusMap: Record<string, TrainingStatus> = {
  "PLANEJADO": "PLANNED",
  "EM ANDAMENTO": "IN_PROGRESS",
  "CONCLUÍDO": "COMPLETED"
};

const categoryMap: Record<string, TrainingCategory> = {
  "TÉCNICO": "TECHNICAL",
  "HABILIDADES INTERPESSOAIS": "SOFT_SKILLS",
  "LIDERANÇA": "LEADERSHIP",
  "CONFORMIDADE": "COMPLIANCE"
};

const sourceMap: Record<string, TrainingSource> = {
  "INTERNO": "INTERNAL",
  "EXTERNO": "EXTERNAL"
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const trainings = data.trainings || [];

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const record of trainings) {
      try {
        console.log('Processando registro:', record);

        // Validar e converter datas
        const startDate = new Date(record['Data de Inicio'].split('/').reverse().join('-'));
        const endDate = new Date(record['Data de Termino'].split('/').reverse().join('-'));

        // Validar e converter status
        const statusPt = record['Status'] as string;
        const status = statusMap[statusPt];
        if (!status) {
          throw new Error(`Status inválido: ${statusPt}. Valores válidos: PLANEJADO, EM ANDAMENTO, CONCLUÍDO`);
        }

        // Validar e converter categoria
        const categoryName = record['Categoria'];
        const category = categoryMap[categoryName];
        if (!category) {
          throw new Error(`Categoria inválida: ${categoryName}. Valores válidos: TÉCNICO, HABILIDADES INTERPESSOAIS, LIDERANÇA, CONFORMIDADE`);
        }

        // Validar e converter fonte
        const sourcePt = record['Fonte'] as string;
        const source = sourceMap[sourcePt];
        if (!source) {
          throw new Error(`Fonte inválida: ${sourcePt}. Valores válidos: INTERNO, EXTERNO`);
        }

        // Validar carga horária
        const workload = parseInt(record['Carga Horaria']);
        if (isNaN(workload) || workload <= 0) {
          throw new Error('Carga horária inválida');
        }

        // Criar o treinamento
        const createdTraining = await prisma.training.create({
          data: {
            id: randomUUID(),
            name: record['Titulo'],
            description: record['Descricao'] || null,
            startDate,
            endDate,
            status,
            category,
            source,
            hours: workload,
            instructor: record['Instrutor'] || null,
            institution: record['Local'] || null,
            type: record['Observacoes'] || null,
            updatedAt: new Date()
          }
        });

        // Adicionar participantes
        const participants = record['Participantes'].split(',').map((cpf: string) => cpf.trim());
        for (const cpf of participants) {
          const employee = await prisma.employee.findUnique({
            where: { cpf }
          });

          if (employee) {
            await prisma.trainingparticipant.create({
              data: {
                id: randomUUID(),
                trainingId: createdTraining.id,
                employeeId: employee.id,
                status: 'PENDING',
                updatedAt: new Date()
              }
            });
          }
        }

        results.success++;
      } catch (error) {
        console.error('Erro ao processar registro:', error);
        results.failed++;
        results.errors.push(`Erro ao importar treinamento ${record['Titulo']}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao processar importação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar importação de treinamentos' },
      { status: 500 }
    );
  }
} 