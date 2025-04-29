"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Download, FileText, Printer, Send, User, Building2, UserCog, Calendar } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { ResponsiveContainer } from "recharts"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip } from "recharts"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { BarChart, Bar } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface Employee {
  id: string
  matricula: string
  name: string
  email: string
  cpf: string
  birthDate: string
  hireDate: string
  terminationDate: string | null
  active: boolean
  phone: string
  address: string
  department: {
    id: string
    name: string
  }
  position: {
    id: string
    title: string
  }
  positionLevel: {
    id: string
    name: string
    salary: number
  }
  shift: {
    id: string
    name: string
  }
  employeeHistory: {
    id: string
    startDate: string
    endDate: string | null
    positionLevel: {
      id: string
      name: string
      salary: number
    }
    department: {
      id: string
      name: string
    }
    shift: {
      id: string
      name: string
    }
  }[]
}

interface Evaluation {
  id: string
  selfScore: number
  managerScore: number
  finalScore: number
  selfStrengths: string
  managerStrengths: string
  selfImprovements: string
  managerImprovements: string
  selfGoals: string
  managerGoals: string
  evaluationanswer: {
    id: string
    evaluationquestion: {
      id: string
      text: string
      expectedScore: number
      category: {
        name: string
        description: string
      }
    }
    selfScore: number | null
    selfComment: string | null
    managerScore: number | null
    managerComment: string | null
  }[]
}

interface MedicalLeave {
  id: string
  startDate: string
  endDate: string
  reason: string
  days: number
  medicalleavecategory?: {
    id: string
    name: string
  }
}

interface Training {
  id: string
  name: string
  type: "internal" | "external"
  startDate: string
  endDate: string
  hours: number
}

interface CareerHistory {
  id: string
  date: string
  position: string
  salary: number
  reason: string
}

const MODERN_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#8b5cf6", // violet-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
]

export default function EmployeeProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [medicalLeaves, setMedicalLeaves] = useState<MedicalLeave[]>([])
  const [trainings, setTrainings] = useState<Training[]>([])
  const [careerHistory, setCareerHistory] = useState<CareerHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar dados do funcionário
        const employeeResponse = await fetch(`/api/employees/${params.id}`)
        if (!employeeResponse.ok) throw new Error("Erro ao buscar dados do funcionário")
        const employeeData = await employeeResponse.json()
        setEmployee(employeeData)

        // Buscar última avaliação
        const evaluationResponse = await fetch(`/api/evaluations/latest/${params.id}`)
        if (evaluationResponse.ok) {
          const evaluationData = await evaluationResponse.json()
          setEvaluation(evaluationData)
        }

        // Buscar atestados
        const response = await fetch(`/api/medical-leaves/employee/${params.id}?limit=5`)
        if (!response.ok) {
          throw new Error("Erro ao buscar licenças médicas")
        }
        const data = await response.json()
        setMedicalLeaves(data)

        // Buscar treinamentos
        const trainingsResponse = await fetch(`/api/trainings/${params.id}?limit=5`)
        if (trainingsResponse.ok) {
          const trainingsData = await trainingsResponse.json()
          setTrainings(trainingsData)
        }

        // Buscar histórico de carreira
        const careerHistoryResponse = await fetch(`/api/career-history/${params.id}`)
        if (careerHistoryResponse.ok) {
          const careerHistoryData = await careerHistoryResponse.json()
          setCareerHistory(careerHistoryData)
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do funcionário",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleExportPDF = async () => {
    try {
      // Criar container temporário
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '100%';
      container.style.height = 'auto';
      container.style.background = 'white';

      // Clonar o conteúdo da página
      const content = document.getElementById('employee-profile')?.cloneNode(true) as HTMLElement;
      if (!content) return;

      // Remover botões
      content.querySelectorAll('button').forEach(button => button.remove());

      // Ajustar estilos para impressão
      content.style.width = '100%';
      content.style.height = 'auto';
      content.style.padding = '0';
      content.style.margin = '0';
      content.style.background = 'white';

      // Ajustar cards
      content.querySelectorAll('.card').forEach(card => {
        (card as HTMLElement).style.marginBottom = '24px';
        (card as HTMLElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      });

      // Ajustar textos
      content.querySelectorAll('h1').forEach(heading => {
        (heading as HTMLElement).style.fontSize = '32px';
        (heading as HTMLElement).style.marginBottom = '24px';
      });

      content.querySelectorAll('h2, h3, h4, h5, h6').forEach(heading => {
        (heading as HTMLElement).style.fontSize = '24px';
        (heading as HTMLElement).style.marginBottom = '16px';
      });

      content.querySelectorAll('p, span').forEach(text => {
        (text as HTMLElement).style.fontSize = '18px';
        (text as HTMLElement).style.marginBottom = '12px';
      });

      // Ajustar badges
      content.querySelectorAll('.badge').forEach(badge => {
        (badge as HTMLElement).style.fontSize = '16px';
        (badge as HTMLElement).style.padding = '6px 12px';
      });

      // Ajustar tabelas
      content.querySelectorAll('table').forEach(table => {
        (table as HTMLElement).style.fontSize = '18px';
        (table as HTMLElement).style.marginBottom = '24px';
        (table as HTMLElement).style.width = '100%';
      });

      content.querySelectorAll('td, th').forEach(cell => {
        (cell as HTMLElement).style.padding = '12px';
        (cell as HTMLElement).style.fontSize = '18px';
      });

      // Ajustar gráficos
      content.querySelectorAll('.recharts-wrapper').forEach(chart => {
        const wrapper = chart as HTMLElement;
        const card = wrapper.closest('.card');
        if (!card) return;

        wrapper.style.width = '100%';
        
        // Verificar se é o card de avaliação
        const cardTitle = card.querySelector('h2')?.textContent;
        if (cardTitle?.includes('Última Avaliação')) {
          // Ajustar tamanho do container do gráfico
          const chartContainer = card.querySelector('.h-[400px]');
          if (chartContainer) {
            (chartContainer as HTMLElement).style.height = '800px';
          }

          // Ajustar tamanho do gráfico
          wrapper.style.height = '800px';
          wrapper.style.minHeight = '800px';
          wrapper.style.maxHeight = '800px';

          // Ajustar fonte dos textos do gráfico
          wrapper.querySelectorAll('text').forEach(text => {
            (text as SVGTextElement).style.fontSize = '18px';
            (text as SVGTextElement).style.fontFamily = 'inherit';
          });

          // Ajustar posição da legenda
          const legend = wrapper.querySelector('.recharts-legend-wrapper');
          if (legend) {
            (legend as HTMLElement).style.position = 'absolute';
            (legend as HTMLElement).style.bottom = '0';
            (legend as HTMLElement).style.left = '50%';
            (legend as HTMLElement).style.transform = 'translateX(-50%)';
            (legend as HTMLElement).style.width = '100%';
            (legend as HTMLElement).style.textAlign = 'center';
          }
        } else {
          wrapper.style.height = '400px';
        }
      });

      // Adicionar conteúdo ao container
      container.appendChild(content);
      document.body.appendChild(container);

      // Capturar a página
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: container.scrollWidth,
        height: container.scrollHeight
      });

      // Criar PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      // Adicionar imagem ao PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Limpar
      document.body.removeChild(container);

      // Salvar o PDF
      pdf.save(`perfil_${employee?.name.toLowerCase().replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF",
        variant: "destructive",
      });
    }
  };

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica',
    },
    section: {
      margin: 10,
      padding: 10,
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
    },
    infoSection: {
      marginBottom: 20,
    },
    label: {
      fontSize: 12,
      marginBottom: 5,
      color: '#666',
    },
    value: {
      fontSize: 14,
      marginBottom: 15,
    },
    statsSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statCard: {
      width: '30%',
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    statLabel: {
      fontSize: 12,
      color: '#666',
    },
    evaluationsSection: {
      marginTop: 20,
    },
    evaluationCard: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
    },
    evaluationDate: {
      fontSize: 12,
      color: '#666',
      marginBottom: 5,
    },
    evaluationScore: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    evaluationComment: {
      fontSize: 12,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>Funcionário não encontrado</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8" id="employee-profile">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Perfil do Funcionário</h1>
            <p className="text-muted-foreground">Informações sobre o funcionário</p>
          </div>
        </div>
        <Button onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações do Funcionário */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground">{employee.matricula}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Departamento:
                  </span>
                  <span className="text-sm">{employee.employeeHistory[0]?.department.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    Cargo:
                  </span>
                  <span className="text-sm">
                    {employee.position.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Nível:
                  </span>
                  <span className="text-sm">{employee.employeeHistory[0]?.positionLevel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Turno:
                  </span>
                  <span className="text-sm">{employee.employeeHistory[0]?.shift.name}</span>
                </div>
              </div>

              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Card className="p-2">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Afastamentos</span>
                    <span className="text-lg font-bold">{medicalLeaves.length}</span>
                  </div>
                </Card>
                <Card className="p-2">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Dias Perdidos</span>
                    <span className="text-lg font-bold">
                      {medicalLeaves.reduce((sum, leave) => sum + leave.days, 0)}
                    </span>
                  </div>
                </Card>
                <Card className="p-2">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Treinamentos</span>
                    <span className="text-lg font-bold">{trainings.length}</span>
                  </div>
                </Card>
                <Card className="p-2">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Horas de Treino</span>
                    <span className="text-lg font-bold">
                      {trainings.reduce((sum, training) => sum + training.hours, 0)}
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Radar - Última Avaliação */}
        {evaluation && (
          <Card className="md:col-span-2">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Última Avaliação</CardTitle>
                  <CardDescription>Autoavaliação vs Avaliação do Gestor vs Esperada</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    Auto: {(evaluation.evaluationanswer.reduce((sum, a) => sum + (a.selfScore || 0), 0) / evaluation.evaluationanswer.length).toFixed(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                    Gestor: {(evaluation.evaluationanswer.reduce((sum, a) => sum + (a.managerScore || 0), 0) / evaluation.evaluationanswer.length).toFixed(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                    Esperada: {(evaluation.evaluationanswer.reduce((sum, a) => sum + a.evaluationquestion.expectedScore, 0) / evaluation.evaluationanswer.length).toFixed(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                    Média: {((evaluation.evaluationanswer.reduce((sum, a) => sum + (a.selfScore || 0), 0) / evaluation.evaluationanswer.length * 0.4) + 
                            (evaluation.evaluationanswer.reduce((sum, a) => sum + (a.managerScore || 0), 0) / evaluation.evaluationanswer.length * 0.6)).toFixed(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-[400px] w-full flex items-center justify-center col-span-2">
                  <div className="w-full h-full max-w-[800px] mx-auto relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.description)))
                          .map(description => {
                            const categoryAnswers = evaluation.evaluationanswer.filter(
                              a => a.evaluationquestion.category.description === description
                            );
                            const selfAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.selfScore || 0), 0) / categoryAnswers.length).toFixed(1));
                            const managerAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.managerScore || 0), 0) / categoryAnswers.length).toFixed(1));
                            const expectedAverage = Number((categoryAnswers.reduce((sum, a) => sum + a.evaluationquestion.expectedScore, 0) / categoryAnswers.length).toFixed(1));
                            return {
                              category: description,
                              self: selfAverage,
                              manager: managerAverage,
                              expected: expectedAverage
                            };
                          })}
                      >
                        <PolarGrid />
                        <PolarAngleAxis 
                          dataKey="category" 
                          tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                          tickFormatter={(value, index) => {
                            const data = Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.description)))
                              .map(description => {
                                const categoryAnswers = evaluation.evaluationanswer.filter(a => a.evaluationquestion.category.description === description);
                                const selfAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.selfScore || 0), 0) / categoryAnswers.length).toFixed(1));
                                const managerAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.managerScore || 0), 0) / categoryAnswers.length).toFixed(1));
                                const expectedAverage = Number((categoryAnswers.reduce((sum, a) => sum + a.evaluationquestion.expectedScore, 0) / categoryAnswers.length).toFixed(1));
                                return { description, selfAverage, managerAverage, expectedAverage };
                              });
                            const item = data[index];
                            return `${value}\n${item.selfAverage}/${item.managerAverage}/${item.expectedAverage}`;
                          }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar
                          name="Autoavaliação"
                          dataKey="self"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Gestor"
                          dataKey="manager"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Esperada"
                          dataKey="expected"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.6}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{ 
                            paddingTop: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            position: 'absolute',
                            bottom: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%'
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === "Autoavaliação") return [`${value}`, "Autoavaliação"];
                            if (name === "Gestor") return [`${value}`, "Gestor"];
                            if (name === "Esperada") return [`${value}`, "Esperada"];
                            return [value, name];
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfico de Barras - Comparação Gestor vs Esperado */}
                <div className="h-[400px] w-full flex items-center justify-center">
                  <div className="w-full h-full max-w-[800px] mx-auto relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.name)))
                          .map(category => {
                            const categoryAnswers = evaluation.evaluationanswer.filter(a => a.evaluationquestion.category.name === category);
                            const managerAverage = Number((categoryAnswers.reduce((sum, a) => sum + (a.managerScore || 0), 0) / categoryAnswers.length).toFixed(1));
                            const expectedAverage = Number((categoryAnswers.reduce((sum, a) => sum + a.evaluationquestion.expectedScore, 0) / categoryAnswers.length).toFixed(1));
                            
                            return {
                              category: category.split(' ').map(word => word[0]).join(''),
                              manager: managerAverage,
                              expected: expectedAverage
                            };
                          })}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="category" 
                          tick={{ fontSize: 10 }}
                          interval={0}
                        />
                        <YAxis 
                          domain={[0, 10]} 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => value.toFixed(1)}
                        />
                        <Tooltip 
                          formatter={(value: number) => value.toFixed(1)}
                          labelFormatter={(label) => {
                            const fullName = Array.from(new Set(evaluation.evaluationanswer.map(a => a.evaluationquestion.category.name)))
                              .find(cat => cat.split(' ').map(word => word[0]).join('') === label);
                            return fullName;
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{ 
                            paddingTop: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            position: 'absolute',
                            bottom: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%'
                          }}
                        />
                        <Bar
                          name="Gestor"
                          dataKey="manager"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          label={{ 
                            position: 'top', 
                            fill: '#374151',
                            fontSize: 12,
                            formatter: (value: number) => value.toFixed(1)
                          }}
                        />
                        <Bar
                          name="Esperada"
                          dataKey="expected"
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                          label={{ 
                            position: 'top', 
                            fill: '#374151',
                            fontSize: 12,
                            formatter: (value: number) => value.toFixed(1)
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comentários da Última Avaliação */}
      {evaluation && (
        <Card>
          <CardHeader>
            <CardTitle>Comentários da Última Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Pontos Fortes</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-4">
                      <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Autoavaliação
                      </Badge>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {evaluation.selfStrengths || "Não informado"}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <Badge variant="secondary" className="mb-2 bg-green-100 text-green-700 hover:bg-green-100">
                        Avaliação do Gestor
                      </Badge>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {evaluation.managerStrengths || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Pontos de Melhoria</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-4">
                      <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Autoavaliação
                      </Badge>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {evaluation.selfImprovements || "Não informado"}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <Badge variant="secondary" className="mb-2 bg-green-100 text-green-700 hover:bg-green-100">
                        Avaliação do Gestor
                      </Badge>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {evaluation.managerImprovements || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Metas e Objetivos</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-card p-4">
                      <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Autoavaliação
                      </Badge>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {evaluation.selfGoals || "Não informado"}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <Badge variant="secondary" className="mb-2 bg-green-100 text-green-700 hover:bg-green-100">
                        Avaliação do Gestor
                      </Badge>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {evaluation.managerGoals || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Cargos e Salários */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Cargos e Salários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Salário</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careerHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(item.salary)}
                    </TableCell>
                    <TableCell>{item.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Gráfico de Evolução Salarial */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Salarial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...careerHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(value)
                    }
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value) => 
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(Number(value))
                    }
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="salary"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimos Atestados */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Atestados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Data Inicial</TableHead>
                <TableHead>Data Final</TableHead>
                <TableHead>Dias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.medicalleavecategory?.name || "Sem Categoria"}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{leave.days}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Últimos Treinamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data Inicial</TableHead>
                <TableHead>Data Final</TableHead>
                <TableHead>Horas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell>{training.name}</TableCell>
                  <TableCell>
                    <Badge variant={training.type === "internal" ? "secondary" : "outline"}>
                      {training.type === "internal" ? "Interno" : "Externo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(training.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(training.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{training.hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 