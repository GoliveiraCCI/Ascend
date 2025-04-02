import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Iniciando verificação do banco de dados...")
    
    // Verifica se o banco está acessível
    await prisma.$queryRaw`SELECT 1`
    console.log("Banco de dados está acessível")
    
    // Verifica as tabelas
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'ascend'
    `
    console.log("Tabelas encontradas:", tables)
    
    // Verifica a tabela de licenças médicas
    const medicalLeavesTable = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = 'ascend' 
      AND TABLE_NAME = 'MedicalLeave'
    `
    console.log("Estrutura da tabela MedicalLeave:", medicalLeavesTable)
    
    // Verifica a tabela de categorias
    const categoriesTable = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = 'ascend' 
      AND TABLE_NAME = 'MedicalLeaveCategory'
    `
    console.log("Estrutura da tabela MedicalLeaveCategory:", categoriesTable)
    
    // Verifica se existem registros nas tabelas
    const medicalLeavesCount = await prisma.medicalLeave.count()
    const categoriesCount = await prisma.medicalLeaveCategory.count()
    
    console.log("Contagem de registros:", {
      medicalLeaves: medicalLeavesCount,
      categories: categoriesCount
    })
    
    return NextResponse.json({
      success: true,
      message: "Banco de dados está acessível",
      tables,
      medicalLeavesTable,
      categoriesTable,
      counts: {
        medicalLeaves: medicalLeavesCount,
        categories: categoriesCount
      }
    })
  } catch (error) {
    console.error("Erro detalhado ao verificar banco de dados:", {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    
    return NextResponse.json(
      { 
        success: false,
        error: "Erro ao verificar banco de dados",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 