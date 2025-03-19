"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

// Dados de exemplo para o atestado médico
const medicalLeaveData = {
  id: "ML001",
  employeeName: "João Silva",
  employeeId: "EMP001",
  department: "TI",
  position: "Desenvolvedor Senior",
  startDate: "2024-03-10",
  endDate: "2024-03-14",
  days: 5,
  reason: "Gripe",
  cid: "J11",
  status: "Aprovado",
  doctor: "Dr. Carlos Mendes",
  hospital: "Hospital Santa Maria",
  notes:
    "Paciente apresentou sintomas de gripe forte, com febre alta e mal-estar. Recomendado repouso absoluto por 5 dias.",
  documents: [
    { id: "DOC001", name: "Atestado Médico.pdf", type: "PDF", size: "1.2 MB", date: "2024-03-10" },
    { id: "DOC002", name: "Receita Médica.pdf", type: "PDF", size: "0.8 MB", date: "2024-03-10" },
    { id: "DOC003", name: "Exames Laboratoriais.pdf", type: "PDF", size: "2.5 MB", date: "2024-03-10" },
  ],
  history: [
    { date: "2024-03-10", time: "09:30", action: "Atestado registrado", user: "Maria Santos" },
    { date: "2024-03-10", time: "10:15", action: "Documentos anexados", user: "Maria Santos" },
    { date: "2024-03-10", time: "14:45", action: "Atestado aprovado", user: "Carlos Mendes" },
    { date: "2024-03-15", time: "08:30", action: "Retorno do funcionário registrado", user: "Maria Santos" },
  ],
}

export default function MedicalLeaveDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const downloadDocument = (documentId: string, documentName: string) => {
    // Em uma implementação real, isso faria o download do documento
    toast({
      title: "Download iniciado",
      description: `Baixando ${documentName}...`,
    })
  }

  const exportMedicalLeave = () => {
    // Em uma implementação real, isso exportaria o atestado
    toast({
      title: "Exportando atestado",
      description: "O atestado está sendo gerado em PDF.",
    })
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <h1 className="font-heading text-3xl">Detalhes do Atestado</h1>
          <Badge variant="outline" className="ml-2">
            {medicalLeaveData.id}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={exportMedicalLeave}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Atestado</CardTitle>
            <CardDescription>Detalhes gerais sobre o atestado médico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Funcionário:</span>
                <span className="text-sm">{medicalLeaveData.employeeName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Departamento:</span>
                <span className="text-sm">{medicalLeaveData.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Período:</span>
                <span className="text-sm">
                  {new Date(medicalLeaveData.startDate).toLocaleDateString()} a{" "}
                  {new Date(medicalLeaveData.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dias:</span>
                <span className="text-sm">{medicalLeaveData.days} dias</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Motivo:</span>
                <span className="text-sm">{medicalLeaveData.reason}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">CID:</span>
                <Badge variant="outline">{medicalLeaveData.cid}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                  {medicalLeaveData.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Médico:</span>
                <span className="text-sm">{medicalLeaveData.doctor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Hospital/Clínica:</span>
                <span className="text-sm">{medicalLeaveData.hospital}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Detalhes do Atestado</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Observações Médicas</h3>
                  <p className="text-sm text-muted-foreground">{medicalLeaveData.notes}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Informações do CID</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Código:</span>
                          <span>{medicalLeaveData.cid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Descrição:</span>
                          <span>Influenza [gripe] devido a vírus não identificado</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Categoria:</span>
                          <span>Doenças do aparelho respiratório</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Resumo do Afastamento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Dias de Afastamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{medicalLeaveData.days}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-green-100 text-green-800">{medicalLeaveData.status}</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-4">
                  {medicalLeaveData.documents.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {document.type} • {document.size} • Adicionado em{" "}
                            {new Date(document.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => downloadDocument(document.id, document.name)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Usuário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalLeaveData.history.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell className="font-medium">{item.action}</TableCell>
                        <TableCell>{item.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

