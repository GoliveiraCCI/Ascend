"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Template {
  name: string;
  headers: string[];
  description: string;
  exampleData?: any[];
}

export const templates: Record<string, Template> = {
  employees: {
    name: "Funcionários",
    headers: [
      "Nome",
      "CPF",
      "RG",
      "Data de Nascimento",
      "Email",
      "Telefone",
      "Endereco",
      "Departamento",
      "Cargo",
      "Faixa do Cargo",
      "Turno",
      "Data de Admissao",
      "Status",
    ],
    description: "Modelo para importação de funcionários",
    exampleData: [
      {
        Nome: "João Silva",
        CPF: "123.456.789-01",
        RG: "12.345.678-9",
        "Data de Nascimento": "15/05/1990",
        Email: "joao.silva.ti@empresa.com",
        Telefone: "(11) 99999-9999",
        Endereco: "Rua das Flores, 123, Centro, São Paulo - SP",
        Departamento: "Departamento TI",
        Cargo: "Analista",
        "Faixa do Cargo": "Pleno",
        Turno: "Turno A",
        "Data de Admissao": "01/01/2023",
        Status: "ATIVO"
      },
      {
        Nome: "Maria Santos",
        CPF: "987.654.321-01",
        RG: "98.765.432-1",
        "Data de Nascimento": "20/08/1985",
        Email: "maria.santos.ti@empresa.com",
        Telefone: "(11) 98888-8888",
        Endereco: "Av. Paulista, 1000, Bela Vista, São Paulo - SP",
        Departamento: "Departamento TI",
        Cargo: "Analista",
        "Faixa do Cargo": "Pleno",
        Turno: "Turno B",
        "Data de Admissao": "01/02/2023",
        Status: "ATIVO"
      }
    ]
  },
  medicalLeaves: {
    name: "Atestados",
    headers: [
      "CPF do Funcionario",
      "Data de Inicio",
      "Data de Termino",
      "Motivo",
      "Medico",
      "Observacoes",
      "Status",
      "Categoria"
    ],
    description: "Modelo para importação de Afastamentos",
    exampleData: [
      {
        "CPF do Funcionario": "123.456.789-01",
        "Data de Inicio": "01/03/2024",
        "Data de Termino": "15/03/2024",
        Motivo: "Gripe",
        Medico: "Dr. Carlos Mendes",
        Observacoes: "Repouso recomendado",
        Status: "AFASTADO",
        Categoria: "Doença"
      },
      {
        "CPF do Funcionario": "987.654.321-01",
        "Data de Inicio": "10/03/2024",
        "Data de Termino": "20/03/2024",
        Motivo: "Dor nas costas",
        Medico: "Dra. Ana Oliveira",
        Observacoes: "Repouso e fisioterapia",
        Status: "AFASTADO",
        Categoria: "Doença"
      }
    ]
  },
  trainings: {
    name: "Treinamentos",
    headers: [
      "Titulo",
      "Descricao",
      "Categoria",
      "Fonte",
      "Data de Inicio",
      "Data de Termino",
      "Instrutor",
      "Local",
      "Carga Horaria",
      "Status",
      "Participantes"
    ],
    description: "Modelo para importação de treinamentos",
    exampleData: [
      {
        Titulo: "Desenvolvimento Web Moderno",
        Descricao: "Curso de desenvolvimento web com React e Next.js",
        Categoria: "TÉCNICO",
        Fonte: "INTERNO",
        "Data de Inicio": "01/04/2024",
        "Data de Termino": "15/04/2024",
        Instrutor: "Prof. Lucas Almeida",
        Local: "Sala de Treinamento 1",
        "Carga Horaria": "40",
        Status: "PLANEJADO",
        Participantes: "123.456.789-01, 987.654.321-01"
      },
      {
        Titulo: "Gestão de Pessoas",
        Descricao: "Curso de liderança e gestão de equipes",
        Categoria: "LIDERANÇA",
        Fonte: "INTERNO",
        "Data de Inicio": "20/04/2024",
        "Data de Termino": "30/04/2024",
        Instrutor: "Prof. Mariana Costa",
        Local: "Sala de Treinamento 2",
        "Carga Horaria": "30",
        Status: "PLANEJADO",
        Participantes: "123.456.789-01, 987.654.321-01"
      }
    ]
  },
  career: {
    name: "Cargos e Salários",
    headers: [
      "CPF do Funcionario",
      "Departamento",
      "Cargo",
      "Faixa do Cargo",
      "Turno",
      "Data da Alteracao",
      "Motivo da Alteracao"
    ],
    description: "Modelo para importação de alterações de cargos e salários",
    exampleData: [
      {
        "CPF do Funcionario": "76173862342",
        "Departamento": "Departamento TI",
        "Cargo": "Analista",
        "Faixa do Cargo": "Júnior",
        "Turno": "TURNO A",
        "Data da Alteracao": "01/01/2024",
        "Motivo da Alteracao": "Promoção"
      },
      {
        "CPF do Funcionario": "62199790065",
        "Departamento": "Departamento RH",
        "Cargo": "Analista de RH",
        "Faixa do Cargo": "Pleno",
        "Turno": "TURNO B",
        "Data da Alteracao": "15/01/2024",
        "Motivo da Alteracao": "Mudança de área"
      }
    ]
  },
};

export function TemplateDownload({ type }: { type: string }) {
  const template = templates[type];

  const handleDownload = () => {
    // Adiciona o BOM para garantir que o Excel reconheça a codificação UTF-8
    const BOM = "\uFEFF";
    
    // Criar o conteúdo do CSV com ponto e vírgula como separador
    const headers = template.headers.join(";");
    const exampleData = template.exampleData?.map(row => 
      template.headers.map(header => `"${row[header]}"`).join(";")
    ).join("\n") || "";

    const csvContent = BOM + headers + "\n" + exampleData;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${template.name.toLowerCase().replace(/\s+/g, "-")}-template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{template.description}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="w-full"
      >
        <Download className="mr-2 h-4 w-4" />
        Baixar Modelo com Dados de Exemplo
      </Button>
    </div>
  );
} 