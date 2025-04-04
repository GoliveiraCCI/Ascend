import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import prisma from '@/lib/prisma'

const prismaClient = new PrismaClient()

// GET /api/evaluations/[id] - Buscar avaliação por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await prismaClient.evaluation.findUnique({
      where: { id: params.id },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        evaluator: {
          select: {
            name: true
          }
        },
        template: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    })

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliação' },
      { status: 500 }
    )
  }
}

// PUT /api/evaluations/[id] - Atualizar avaliação
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Verificar se a avaliação existe
    const evaluation = await prismaClient.evaluation.findUnique({
      where: { id },
      include: {
        answers: true,
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar a avaliação
    const updatedEvaluation = await prismaClient.evaluation.update({
      where: { id },
      data: {
        selfEvaluationStatus: data.selfEvaluationStatus,
        selfScore: data.selfScore,
        selfEvaluationDate: data.selfEvaluationStatus === "Finalizado" ? new Date() : null,
        managerEvaluationStatus: data.managerEvaluationStatus,
        managerScore: data.managerScore,
        managerEvaluationDate: data.managerEvaluationStatus === "Finalizado" ? new Date() : null,
        finalScore: data.finalScore,
        status: data.status,
      },
      include: {
        employee: true,
        evaluator: true,
        template: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    // Atualizar as respostas se fornecidas
    if (data.answers) {
      for (const answer of data.answers) {
        await prismaClient.evaluationAnswer.update({
          where: { id: answer.id },
          data: {
            selfScore: answer.selfScore,
            managerScore: answer.managerScore,
            selfComment: answer.selfComment,
            managerComment: answer.managerComment,
          },
        });
      }
    }

    const formattedEvaluation = {
      id: updatedEvaluation.id,
      employee: {
        id: updatedEvaluation.employee.id,
        name: updatedEvaluation.employee.name,
        matricula: updatedEvaluation.employee.matricula,
      },
      evaluator: {
        id: updatedEvaluation.evaluator.id,
        name: updatedEvaluation.evaluator.name,
      },
      template: {
        id: updatedEvaluation.template.id,
        name: updatedEvaluation.template.name,
        description: updatedEvaluation.template.description,
      },
      date: updatedEvaluation.date,
      status: updatedEvaluation.status,
      selfEvaluation: updatedEvaluation.selfEvaluation,
      selfEvaluationStatus: updatedEvaluation.selfEvaluationStatus,
      selfStrengths: updatedEvaluation.selfStrengths,
      selfImprovements: updatedEvaluation.selfImprovements,
      selfGoals: updatedEvaluation.selfGoals,
      selfScore: updatedEvaluation.selfScore,
      selfEvaluationDate: updatedEvaluation.selfEvaluationDate,
      managerEvaluation: updatedEvaluation.managerEvaluation,
      managerEvaluationStatus: updatedEvaluation.managerEvaluationStatus,
      managerStrengths: updatedEvaluation.managerStrengths,
      managerImprovements: updatedEvaluation.managerImprovements,
      managerGoals: updatedEvaluation.managerGoals,
      managerScore: updatedEvaluation.managerScore,
      managerEvaluationDate: updatedEvaluation.managerEvaluationDate,
      finalScore: updatedEvaluation.finalScore,
      answers: updatedEvaluation.answers.map((answer) => ({
        id: answer.id,
        question: {
          id: answer.question.id,
          text: answer.question.text,
        },
        selfScore: answer.selfScore,
        managerScore: answer.managerScore,
        selfComment: answer.selfComment,
        managerComment: answer.managerComment,
      })),
    };

    return NextResponse.json(formattedEvaluation);
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar avaliação' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prismaClient.evaluation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Avaliação removida com sucesso' })
  } catch (error) {
    console.error('Erro ao remover avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao remover avaliação' },
      { status: 500 }
    )
  }
} 