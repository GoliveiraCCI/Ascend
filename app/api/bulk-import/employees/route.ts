import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Dados recebidos:", data);
    const employees = data.employees;
    console.log("Funcionários a serem importados:", employees);

    if (!employees || !Array.isArray(employees)) {
      throw new Error("Dados inválidos: employees deve ser um array");
    }

    const results = await Promise.all(
      employees.map(async (employee: any) => {
        try {
          console.log("Processando funcionário:", employee.Nome);
          
          // Verificar se o CPF já existe
          const existingEmployee = await prisma.employee.findUnique({
            where: { cpf: employee.CPF }
          });
          if (existingEmployee) {
            throw new Error(`CPF já cadastrado: ${employee.CPF}`);
          }

          // Verificar se o email já existe
          const existingEmail = await prisma.employee.findUnique({
            where: { email: employee.Email }
          });
          if (existingEmail) {
            throw new Error(`Email já cadastrado: ${employee.Email}`);
          }
          
          // Buscar departamento pelo nome
          const department = await prisma.department.findFirst({
            where: { name: employee.Departamento }
          });
          console.log("Departamento encontrado:", department);
          if (!department) throw new Error(`Departamento não encontrado: ${employee.Departamento}`);

          // Buscar cargo pelo título
          console.log("Buscando cargo:", {
            title: employee.Cargo,
            departmentId: department.id,
            departmentName: department.name
          });
          
          const position = await prisma.position.findFirst({
            where: { 
              title: employee.Cargo,
              departmentId: department.id
            }
          });
          
          console.log("Resultado da busca de cargo:", {
            position,
            query: {
              title: employee.Cargo,
              departmentId: department.id
            }
          });
          if (!position) throw new Error(`Cargo não encontrado: ${employee.Cargo}`);

          // Buscar faixa do cargo
          const positionLevel = await prisma.positionlevel.findFirst({
            where: { 
              name: employee["Faixa do Cargo"],
              positionId: position.id
            }
          });
          console.log("Faixa do cargo encontrada:", positionLevel);
          if (!positionLevel) throw new Error(`Faixa do cargo não encontrada: ${employee["Faixa do Cargo"]}`);

          // Buscar turno
          const shift = await prisma.shift.findFirst({
            where: { name: employee.Turno }
          });
          console.log("Turno encontrado:", shift);
          if (!shift) throw new Error(`Turno não encontrado: ${employee.Turno}`);

          // Gerar matrícula única
          const timestamp = Date.now().toString();
          const random = Math.random().toString(36).substr(2, 4);
          const matricula = `MAT${timestamp.slice(-6)}${random}`;

          // Criar funcionário
          const employeeData = {
            id: `emp_${timestamp}_${random}`,
            name: employee.Nome,
            cpf: employee.CPF,
            birthDate: new Date(employee["Data de Nascimento"].split("/").reverse().join("-")),
            email: employee.Email,
            phone: employee.Telefone,
            address: employee.Endereco,
            departmentId: department.id,
            positionId: position.id,
            positionLevelId: positionLevel.id,
            shiftId: shift.id,
            hireDate: new Date(employee["Data de Admissao"].split("/").reverse().join("-")),
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            matricula
          };
          console.log("Dados do funcionário a serem criados:", employeeData);

          const createdEmployee = await prisma.employee.create({
            data: employeeData
          });
          console.log("Funcionário criado:", createdEmployee);

          // Criar histórico inicial
          const historyData = {
            id: `hist_${timestamp}_${random}`,
            employeeId: createdEmployee.id,
            departmentId: department.id,
            positionLevelId: positionLevel.id,
            shiftId: shift.id,
            startDate: createdEmployee.hireDate,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          console.log("Dados do histórico a serem criados:", historyData);

          await prisma.employeehistory.create({
            data: historyData
          });
          console.log("Histórico criado com sucesso");

          return {
            success: true,
            employee: createdEmployee.name
          };
        } catch (error) {
          console.error("Erro ao processar funcionário:", error);
          return {
            success: false,
            employee: employee.Nome,
            error: error instanceof Error ? error.message : "Erro desconhecido"
          };
        }
      })
    );

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log("Resultado final:", { successful, failed });

    return NextResponse.json({
      message: `Importação concluída. ${successful.length} funcionários importados com sucesso. ${failed.length} falhas.`,
      successful,
      failed
    });
  } catch (error) {
    console.error("Erro na importação:", error);
    return NextResponse.json(
      { 
        error: "Erro ao processar importação",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
} 