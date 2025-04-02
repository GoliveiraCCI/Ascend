"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Printer, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("performance")
  const [timeRange, setTimeRange] = useState("month")
  const [department, setDepartment] = useState("all")
  const [format, setFormat] = useState("excel")

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl">Relatórios</h1>
        <p className="text-muted-foreground">Gerar e baixar relatórios personalizados</p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="generate">Gerar Relatório</TabsTrigger>
          <TabsTrigger value="saved">Relatórios Salvos</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="animate-fade">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Novo Relatório</CardTitle>
              <CardDescription>Selecione os parâmetros para gerar um relatório personalizado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Tipo de Relatório</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Selecione o tipo de relatório" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Desempenho de Funcionários</SelectItem>
                        <SelectItem value="attendance">Presença e Atestados</SelectItem>
                        <SelectItem value="training">Treinamentos</SelectItem>
                        <SelectItem value="department">Análise de Departamento</SelectItem>
                        <SelectItem value="evaluation">Avaliações</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-range">Período</Label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger id="time-range">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Esta Semana</SelectItem>
                        <SelectItem value="month">Este Mês</SelectItem>
                        <SelectItem value="quarter">Este Trimestre</SelectItem>
                        <SelectItem value="year">Este Ano</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {timeRange === "custom" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Data de Início</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="date" id="start-date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Data de Término</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="date" id="end-date" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Selecione o departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Departamentos</SelectItem>
                        <SelectItem value="it">TI</SelectItem>
                        <SelectItem value="hr">RH</SelectItem>
                        <SelectItem value="finance">Financeiro</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Operações</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Formato</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {reportType === "performance" && (
                  <div className="space-y-2">
                    <Label>Métricas Incluídas</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="metric-1"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <Label htmlFor="metric-1" className="text-sm font-normal">
                          Pontuações de Avaliação
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="metric-2"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <Label htmlFor="metric-2" className="text-sm font-normal">
                          Metas Atingidas
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="metric-3"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <Label htmlFor="metric-3" className="text-sm font-normal">
                          Horas de Treinamento
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="metric-4"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <Label htmlFor="metric-4" className="text-sm font-normal">
                          Dias de Atestado
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Salvar Configurações</Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Relatórios Recentes</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Desempenho de Funcionários - Março 2024",
                  type: "Desempenho",
                  date: "28/03/2024",
                  format: "Excel",
                },
                {
                  title: "Análise de Atestados - Q1 2024",
                  type: "Atestados",
                  date: "15/03/2024",
                  format: "PDF",
                },
                {
                  title: "Resumo de Treinamentos - Fevereiro 2024",
                  type: "Treinamentos",
                  date: "05/03/2024",
                  format: "Excel",
                },
              ].map((report, i) => (
                <Card key={i} className="animate-scale">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription>
                      {report.type} • {report.date}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar {report.format}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="saved" className="animate-fade">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar relatórios..." className="pl-8 w-full md:w-[300px]" />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="performance">Desempenho</SelectItem>
                  <SelectItem value="attendance">Atestados</SelectItem>
                  <SelectItem value="training">Treinamentos</SelectItem>
                  <SelectItem value="department">Departamentos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              {
                title: "Desempenho de Funcionários - Março 2024",
                type: "Desempenho",
                date: "28/03/2024",
                format: "Excel",
                department: "Todos",
                createdBy: "Admin",
              },
              {
                title: "Análise de Atestados - Q1 2024",
                type: "Atestados",
                date: "15/03/2024",
                format: "PDF",
                department: "TI",
                createdBy: "Admin",
              },
              {
                title: "Resumo de Treinamentos - Fevereiro 2024",
                type: "Treinamentos",
                date: "05/03/2024",
                format: "Excel",
                department: "Todos",
                createdBy: "Admin",
              },
              {
                title: "Análise de Departamento - TI - Q1 2024",
                type: "Departamentos",
                date: "01/04/2024",
                format: "PDF",
                department: "TI",
                createdBy: "Admin",
              },
              {
                title: "Avaliações de Desempenho - Q4 2023",
                type: "Avaliações",
                date: "15/01/2024",
                format: "Excel",
                department: "Todos",
                createdBy: "Admin",
              },
              {
                title: "Relatório de Atestados - Fevereiro 2024",
                type: "Atestados",
                date: "02/03/2024",
                format: "CSV",
                department: "Marketing",
                createdBy: "Admin",
              },
            ].map((report, i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {report.date} • {report.department}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2 sm:mt-0">
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar {report.format}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

