"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Award,
  Calendar,
  Download,
  FileSpreadsheet,
  LucideLineChart,
  Mail,
  Phone,
  User,
  AlertTriangle,
  Plus,
  DollarSign,
} from "lucide-react"
import {
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

// Sample employee data
const employee = {
  id: "EMP001",
  name: "John Doe",
  position: "Senior Developer",
  department: "IT",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "2020-05-15",
  manager: "Sarah Johnson",
  status: "Ativo",
  leaveReason: "Cirurgia", // Motivo de afastamento
  currentSalary: 8500,
  address: "Rua das Flores, 123 - São Paulo, SP",
  birthDate: "1985-07-15",
  education: "Bacharel em Ciência da Computação",
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "SQL"],
  languages: ["Português (Nativo)", "Inglês (Avançado)", "Espanhol (Intermediário)"],
  photo: "/placeholder.svg?height=200&width=200",
}

// Sample performance data for radar chart
const performanceData = [
  {
    subject: "Habilidades Técnicas",
    self: 8.5,
    manager: 9.0,
    fullMark: 10,
  },
  {
    subject: "Comunicação",
    self: 7.0,
    manager: 7.5,
    fullMark: 10,
  },
  {
    subject: "Resolução de Problemas",
    self: 8.0,
    manager: 8.5,
    fullMark: 10,
  },
  {
    subject: "Trabalho em Equipe",
    self: 9.0,
    manager: 8.5,
    fullMark: 10,
  },
  {
    subject: "Liderança",
    self: 7.5,
    manager: 8.0,
    fullMark: 10,
  },
  {
    subject: "Adaptabilidade",
    self: 8.0,
    manager: 7.5,
    fullMark: 10,
  },
]

// Sample training data
const trainingData = [
  {
    id: "TR001",
    name: "Advanced JavaScript",
    category: "Technical",
    hours: 24,
    completionDate: "2023-11-15",
    status: "Completed",
  },
  {
    id: "TR002",
    name: "Leadership Essentials",
    category: "Soft Skills",
    hours: 16,
    completionDate: "2023-08-22",
    status: "Completed",
  },
  {
    id: "TR003",
    name: "React Advanced Patterns",
    category: "Technical",
    hours: 20,
    completionDate: "2024-01-10",
    status: "Completed",
  },
  {
    id: "TR004",
    name: "Project Management",
    category: "Management",
    hours: 30,
    completionDate: "2024-04-15",
    status: "In Progress",
  },
]

// Sample medical leave data
const medicalLeaveData = [
  {
    id: "ML001",
    startDate: "2023-07-10",
    endDate: "2023-07-14",
    days: 5,
    reason: "Illness",
    status: "AFASTADO",
    cid: "J11", // CID para gripe
  },
  {
    id: "ML002",
    startDate: "2023-10-05",
    endDate: "2023-10-06",
    days: 2,
    reason: "Medical Appointment",
    status: "AFASTADO",
    cid: "Z00.0", // CID para exame médico geral
  },
  {
    id: "ML003",
    startDate: "2024-01-22",
    endDate: "2024-01-26",
    days: 5,
    reason: "Surgery Recovery",
    status: "AFASTADO",
    cid: "K40", // CID para hérnia inguinal
  },
]

// Sample evaluation history
const evaluationHistory = [
  {
    id: "EVAL001",
    date: "2023-12-15",
    type: "Annual Review",
    evaluator: "Sarah Johnson",
    score: 8.5,
    status: "Completed",
  },
  {
    id: "EVAL002",
    date: "2023-06-10",
    type: "Mid-Year Review",
    evaluator: "Sarah Johnson",
    score: 8.2,
    status: "Completed",
  },
  {
    id: "EVAL003",
    date: "2022-12-18",
    type: "Annual Review",
    evaluator: "Michael Brown",
    score: 7.9,
    status: "Completed",
  },
]

// Histórico de cargos e salários
const careerHistory = [
  {
    id: "CH001",
    date: "2020-05-15",
    position: "Junior Developer",
    salary: 4500,
    reason: "Contratação",
  },
  {
    id: "CH002",
    date: "2021-06-01",
    position: "Developer",
    salary: 5800,
    reason: "Promoção anual",
  },
  {
    id: "CH003",
    date: "2022-07-15",
    position: "Senior Developer",
    salary: 7200,
    reason: "Promoção por mérito",
  },
  {
    id: "CH004",
    date: "2023-08-01",
    position: "Senior Developer",
    salary: 8500,
    reason: "Ajuste salarial",
  },
]

// Dados para o gráfico de evolução salarial
const salaryEvolutionData = careerHistory.map((item) => ({
  date: new Date(item.date).toLocaleDateString("pt-BR", { year: "numeric", month: "short" }),
  salary: item.salary,
}))

// Cores modernas para gráficos
const MODERN_COLORS = [
  "#4361ee",
  "#3a0ca3",
  "#7209b7",
  "#f72585",
  "#4cc9f0",
  "#4895ef",
  "#560bad",
  "#b5179e",
  "#f15bb5",
  "#00bbf9",
]

export default function EmployeeProfile({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("year")
  const [newPosition, setNewPosition] = useState("")
  const [newSalary, setNewSalary] = useState("")
  const [newReason, setNewReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)

  const handleGoBack = () => {
    router.back()
  }

  const handleAddCareerChange = () => {
    // Aqui você adicionaria a lógica para salvar a alteração
    // Em um ambiente real, isso enviaria dados para uma API
    setIsDialogOpen(false)
    setNewPosition("")
    setNewSalary("")
    setNewReason("")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Função para exportar o perfil para PDF
  const exportToPDF = () => {
    const profileElement = document.getElementById("employee-profile")
    if (!profileElement) return

    // Configurações para ajustar ao tamanho A4
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 10 // margem em mm

    // Capturar o elemento como imagem
    html2canvas(profileElement, {
      scale: 2, // Aumenta a qualidade
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      // Calcular a proporção para ajustar ao tamanho A4
      const imgWidth = pdfWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Se a altura for maior que a página A4, redimensionar
      let finalImgHeight = imgHeight
      let finalImgWidth = imgWidth

      if (imgHeight > pdfHeight - margin * 2) {
        finalImgHeight = pdfHeight - margin * 2
        finalImgWidth = (canvas.width * finalImgHeight) / canvas.height
      }

      // Converter canvas para imagem
      const imgData = canvas.toDataURL("image/png")

      // Adicionar a imagem ao PDF
      pdf.addImage(imgData, "PNG", margin, margin, finalImgWidth, finalImgHeight)

      // Salvar o PDF
      pdf.save(`perfil_${employee.name.replace(/\s+/g, "_")}.pdf`)

      toast({
        title: "PDF gerado com sucesso",
        description: "O perfil do funcionário foi exportado para PDF.",
      })
    })
  }

  // Corrigir o erro "Unexpected eval or arguments in strict mode"
  // Vamos remover completamente qualquer uso de eval ou arguments
  // Modificando a função exportBeautifulPDF para usar métodos seguros

  // Substitua a função exportBeautifulPDF por esta versão corrigida:
  const exportBeautifulPDF = () => {
    const pdfElement = document.getElementById("pdf-template")
    if (!pdfElement) return

    // Configurações para ajustar ao tamanho A4
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 10 // margem em mm

    // Capturar o elemento como imagem
    html2canvas(pdfElement, {
      scale: 2, // Aumenta a qualidade
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      // Calcular a proporção para ajustar ao tamanho A4
      const imgWidth = pdfWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Se a altura for maior que a página A4, dividir em múltiplas páginas
      if (imgHeight <= pdfHeight - margin * 2) {
        // Cabe em uma única página
        const imgData = canvas.toDataURL("image/png")
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight)
      } else {
        // Dividir em múltiplas páginas
        let heightLeft = imgHeight
        let position = 0
        const imgData = canvas.toDataURL("image/png")

        // Primeira página
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight)
        heightLeft -= pdfHeight - margin * 2
        position = -(pdfHeight - margin * 2)

        // Páginas adicionais se necessário
        while (heightLeft > 0) {
          pdf.addPage()
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight)
          heightLeft -= pdfHeight - margin * 2
          position -= pdfHeight - margin * 2
        }
      }

      // Salvar o PDF
      pdf.save(`perfil_${employee.name.replace(/\s+/g, "_")}.pdf`)

      setIsPdfDialogOpen(false)

      toast({
        title: "PDF gerado com sucesso",
        description: "O perfil do funcionário foi exportado para PDF em formato elegante.",
      })
    })
  }

  return (
    <div id="employee-profile" className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="font-heading text-3xl">{employee.name}</h1>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{employee.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Este Ano</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="all">Todo o Período</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Visualização do PDF</DialogTitle>
                <DialogDescription>Visualize como o perfil ficará no PDF antes de exportar</DialogDescription>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-y-auto">
                <div id="pdf-template" className="bg-white p-8 rounded-lg shadow">
                  <div className="flex items-center justify-between border-b pb-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold">{employee.name}</h1>
                        <p className="text-lg text-muted-foreground">{employee.position}</p>
                        <p className="text-sm text-muted-foreground">ID: {employee.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Departamento: {employee.department}</p>
                      <p className="text-sm font-medium">Status: {employee.status}</p>
                      <p className="text-sm font-medium">Data do Relatório: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h2 className="text-xl font-bold mb-4 border-b pb-2">Informações Pessoais</h2>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Email:</span>
                          <span>{employee.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Telefone:</span>
                          <span>{employee.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Endereço:</span>
                          <span>{employee.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Data de Nascimento:</span>
                          <span>{new Date(employee.birthDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Data de Admissão:</span>
                          <span>{new Date(employee.joinDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Gestor:</span>
                          <span>{employee.manager}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold mb-4 border-b pb-2">Formação e Habilidades</h2>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Formação:</span>
                          <span>{employee.education}</span>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Habilidades:</p>
                          <div className="flex flex-wrap gap-1">
                            {employee.skills.map((skill, index) => (
                              <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Idiomas:</p>
                          <div className="flex flex-col">
                            {employee.languages.map((language, index) => (
                              <span key={index} className="text-sm">
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-4 border-b pb-2 mt-8">Evolução de Carreira e Salário</h2>
                  <div className="h-[300px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salaryEvolutionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis
                          tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
                          domain={[0, "dataMax + 1000"]}
                        />
                        <Tooltip
                          formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, "Salário"]}
                          labelFormatter={(label) => `Data: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="salary"
                          name="Salário"
                          stroke={MODERN_COLORS[2]}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <table className="w-full border-collapse mb-6">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border p-2 text-left">Data</th>
                        <th className="border p-2 text-left">Cargo</th>
                        <th className="border p-2 text-left">Salário</th>
                        <th className="border p-2 text-left">Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careerHistory.map((item) => (
                        <tr key={item.id}>
                          <td className="border p-2">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="border p-2 font-medium">{item.position}</td>
                          <td className="border p-2">{formatCurrency(item.salary)}</td>
                          <td className="border p-2">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h2 className="text-xl font-bold mb-4 border-b pb-2">Histórico de Avaliações</h2>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="border p-2 text-left">Data</th>
                            <th className="border p-2 text-left">Tipo</th>
                            <th className="border p-2 text-left">Avaliador</th>
                            <th className="border p-2 text-left">Pontuação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {evaluationHistory.map((item) => (
                            <tr key={item.id}>
                              <td className="border p-2">{new Date(item.date).toLocaleDateString()}</td>
                              <td className="border p-2">{item.type}</td>
                              <td className="border p-2">{item.evaluator}</td>
                              <td className="border p-2 font-medium">{item.score.toFixed(1)}/10</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold mb-4 border-b pb-2">Afastamentos Médicos</h2>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="border p-2 text-left">Período</th>
                            <th className="border p-2 text-left">Dias</th>
                            <th className="border p-2 text-left">Motivo</th>
                            <th className="border p-2 text-left">CID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicalLeaveData.map((leave) => (
                            <tr key={leave.id}>
                              <td className="border p-2">
                                {new Date(leave.startDate).toLocaleDateString()} a{" "}
                                {new Date(leave.endDate).toLocaleDateString()}
                              </td>
                              <td className="border p-2 text-center">{leave.days}</td>
                              <td className="border p-2">{leave.reason}</td>
                              <td className="border p-2">{leave.cid}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Treinamentos e Capacitações</h2>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="border p-2 text-left">Nome</th>
                          <th className="border p-2 text-left">Categoria</th>
                          <th className="border p-2 text-left">Horas</th>
                          <th className="border p-2 text-left">Data de Conclusão</th>
                          <th className="border p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainingData.map((training) => (
                          <tr key={training.id}>
                            <td className="border p-2 font-medium">{training.name}</td>
                            <td className="border p-2">{training.category}</td>
                            <td className="border p-2 text-center">{training.hours}</td>
                            <td className="border p-2">
                              {training.completionDate ? new Date(training.completionDate).toLocaleDateString() : "-"}
                            </td>
                            <td className="border p-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                  training.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {training.status === "Completed" ? "Concluído" : "Em Andamento"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Indicadores de Desempenho</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Média de Avaliações</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">
                            {(
                              evaluationHistory.reduce((sum, item) => sum + item.score, 0) / evaluationHistory.length
                            ).toFixed(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">de 10</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Horas de Treinamento</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">
                            {trainingData.reduce((sum, training) => sum + training.hours, 0)}
                          </span>
                          <span className="text-sm text-muted-foreground">horas</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Dias de Afastamento</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">
                            {medicalLeaveData.reduce((sum, leave) => sum + leave.days, 0)}
                          </span>
                          <span className="text-sm text-muted-foreground">dias</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Aumento Salarial</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">
                            {(
                              (careerHistory[careerHistory.length - 1].salary / careerHistory[0].salary - 1) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                          <span className="text-sm text-muted-foreground">desde a contratação</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Visão Geral de Desempenho</h2>
                    <div className="h-[300px] w-full mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 10]} />
                          <Radar
                            name="Autoavaliação"
                            dataKey="self"
                            stroke={MODERN_COLORS[0]}
                            fill={MODERN_COLORS[0]}
                            fillOpacity={0.6}
                          />
                          <Radar
                            name="Avaliação do Gestor"
                            dataKey="manager"
                            stroke={MODERN_COLORS[1]}
                            fill={MODERN_COLORS[1]}
                            fillOpacity={0.6}
                          />
                          <Legend />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Meta 1: Concluir certificação avançada</h3>
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                          <span className="ml-4 text-sm font-medium">70%</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Meta 2: Liderar projeto estratégico</h3>
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          <span className="ml-4 text-sm font-medium">45%</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Meta 3: Melhorar indicadores de desempenho</h3>
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                          <span className="ml-4 text-sm font-medium">85%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground mt-12 pt-6 border-t">
                    <p>Este documento é confidencial e contém informações pessoais do funcionário.</p>
                    <p>
                      ASCEND - Sistema de Gestão de Desempenho • Gerado em {new Date().toLocaleDateString()} às{" "}
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPdfDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={exportBeautifulPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Funcionário</CardTitle>
            <CardDescription>Dados pessoais e profissionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                <User className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{employee.name}</h2>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Departamento:</span>
                <span className="text-sm">{employee.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Telefone:</span>
                <span className="text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Data de Admissão:</span>
                <span className="text-sm">{new Date(employee.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Gestor:</span>
                <span className="text-sm">{employee.manager}</span>
              </div>
              <div className="flex items-center gap-2">
                <LucideLineChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                  {employee.status}
                </span>
              </div>
              {employee.status === "Afastado" && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Motivo do Afastamento:</span>
                  <span className="text-sm">{employee.leaveReason || "Não informado"}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Salário Atual:</span>
                <span className="text-sm">{formatCurrency(employee.currentSalary)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral de Desempenho</CardTitle>
            <CardDescription>Autoavaliação vs. Avaliação do Gestor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar
                    name="Autoavaliação"
                    dataKey="self"
                    stroke={MODERN_COLORS[0]}
                    fill={MODERN_COLORS[0]}
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Avaliação do Gestor"
                    dataKey="manager"
                    stroke={MODERN_COLORS[1]}
                    fill={MODERN_COLORS[1]}
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Evolução de Cargos e Salários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Evolução de Cargos e Salários</CardTitle>
            <CardDescription>Histórico de promoções e ajustes salariais</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Alteração
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Alteração de Cargo/Salário</DialogTitle>
                <DialogDescription>
                  Registre uma nova alteração de cargo ou salário para este funcionário.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="col-span-3"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Cargo
                  </Label>
                  <Input
                    id="position"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salary" className="text-right">
                    Salário
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Motivo
                  </Label>
                  <Input
                    id="reason"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCareerChange}>
                  Salvar Alteração
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} domain={[0, "dataMax + 1000"]} />
                  <Tooltip
                    formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, "Salário"]}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="salary"
                    name="Salário"
                    stroke={MODERN_COLORS[2]}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

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
                    <TableCell className="font-medium">{item.position}</TableCell>
                    <TableCell>{formatCurrency(item.salary)}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Histórico de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Avaliações</CardTitle>
          <CardDescription>Avaliações de desempenho anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluationHistory.map((evaluation) => (
              <div
                key={evaluation.id}
                className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium">{evaluation.type}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(evaluation.date).toLocaleDateString()} • Avaliador: {evaluation.evaluator}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-4 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        evaluation.score >= 8.5
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : evaluation.score >= 7.5
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {evaluation.score.toFixed(1)}/10
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Baixar Todas as Avaliações
          </Button>
        </CardFooter>
      </Card>

      {/* Seção de Treinamentos */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Histórico de Treinamentos</CardTitle>
            <CardDescription>Treinamentos concluídos e em andamento</CardDescription>
          </div>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <div className="rounded-lg border p-2 text-center">
              <p className="text-sm font-medium text-muted-foreground">Total de Horas</p>
              <p className="text-2xl font-bold">
                {trainingData.reduce((total, training) => total + training.hours, 0)}
              </p>
            </div>
            <div className="rounded-lg border p-2 text-center">
              <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
              <p className="text-2xl font-bold">
                {trainingData.filter((training) => training.status === "Completed").length}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingData.map((training) => (
              <div
                key={training.id}
                className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{training.name}</h3>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        training.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      }`}
                    >
                      {training.status === "Completed" ? "Concluído" : "Em Andamento"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Categoria: {training.category} •{" "}
                    {training.status === "Completed"
                      ? `Concluído em ${new Date(training.completionDate).toLocaleDateString()}`
                      : "Em Andamento"}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-4 sm:mt-0">
                  <div className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium">{training.hours} horas</div>
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Baixar Relatório de Treinamentos
          </Button>
        </CardFooter>
      </Card>

      {/* Seção de Afastamentos Médicos */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Histórico de Afastamentos Médicos</CardTitle>
            <CardDescription>Registro de afastamentos e ausências médicas</CardDescription>
          </div>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <div className="rounded-lg border p-2 text-center">
              <p className="text-sm font-medium text-muted-foreground">Total de Dias</p>
              <p className="text-2xl font-bold">{medicalLeaveData.reduce((total, leave) => total + leave.days, 0)}</p>
            </div>
            <div className="rounded-lg border p-2 text-center">
              <p className="text-sm font-medium text-muted-foreground">Ocorrências</p>
              <p className="text-2xl font-bold">{medicalLeaveData.length}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicalLeaveData.map((leave) => (
              <div
                key={leave.id}
                className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{leave.reason}</h3>
                    <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      {leave.status === "AFASTADO" ? "Aprovado" : leave.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(leave.startDate).toLocaleDateString()} a {new Date(leave.endDate).toLocaleDateString()} •{" "}
                    {leave.days} dias • CID: {leave.cid}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-4 sm:mt-0">
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Baixar Relatório de Afastamentos
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

