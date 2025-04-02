"use client"

import type React from "react"

import { useState } from "react"
import { Download, FileSpreadsheet, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImportExportModalProps {
  type: "import" | "export"
  entityType: "employees" | "evaluations" | "trainings" | "medical-leaves" | "departments"
  trigger?: React.ReactNode
}

export function ImportExportModal({ type, entityType, trigger }: ImportExportModalProps) {
  const [fileFormat, setFileFormat] = useState("excel")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dateRange, setDateRange] = useState("all")

  const entityNames = {
    employees: "Funcionários",
    evaluations: "Avaliações",
    trainings: "Treinamentos",
    "medical-leaves": "Atestados Médicos",
    departments: "Departamentos",
  }

  const entityName = entityNames[entityType]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    // Lógica de importação aqui
    console.log("Importando arquivo:", selectedFile)
  }

  const handleExport = () => {
    // Lógica de exportação aqui
    console.log("Exportando dados no formato:", fileFormat)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            {type === "import" ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{type === "import" ? `Importar ${entityName}` : `Exportar ${entityName}`}</DialogTitle>
          <DialogDescription>
            {type === "import"
              ? `Importe dados de ${entityName.toLowerCase()} a partir de um arquivo.`
              : `Exporte dados de ${entityName.toLowerCase()} para um arquivo.`}
          </DialogDescription>
        </DialogHeader>

        {type === "import" ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file-format">Formato do Arquivo</Label>
              <Select value={fileFormat} onValueChange={setFileFormat}>
                <SelectTrigger id="file-format">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Arquivo</Label>
              <Input
                id="file-upload"
                type="file"
                accept={fileFormat === "excel" ? ".xlsx,.xls" : fileFormat === "csv" ? ".csv" : ".json"}
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                {fileFormat === "excel"
                  ? "Arquivos Excel (.xlsx, .xls)"
                  : fileFormat === "csv"
                    ? "Arquivos CSV (.csv)"
                    : "Arquivos JSON (.json)"}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Opções de Importação</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="overwrite" className="h-4 w-4 rounded border-gray-300" />
                <Label htmlFor="overwrite" className="text-sm font-normal">
                  Sobrescrever registros existentes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="validate" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                <Label htmlFor="validate" className="text-sm font-normal">
                  Validar dados antes de importar
                </Label>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Todos os Dados</TabsTrigger>
                <TabsTrigger value="filtered">Dados Filtrados</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="export-format">Formato de Exportação</Label>
                  <Select value={fileFormat} onValueChange={setFileFormat}>
                    <SelectTrigger id="export-format">
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date-range">Período</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Dados</SelectItem>
                      <SelectItem value="month">Este Mês</SelectItem>
                      <SelectItem value="quarter">Este Trimestre</SelectItem>
                      <SelectItem value="year">Este Ano</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {dateRange === "custom" && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="start-date">Data Inicial</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="end-date">Data Final</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="filtered" className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm">Esta opção exportará apenas os dados atualmente filtrados na tabela.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="export-format-filtered">Formato de Exportação</Label>
                  <Select value={fileFormat} onValueChange={setFileFormat}>
                    <SelectTrigger id="export-format-filtered">
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            <div className="grid gap-2">
              <Label>Opções de Exportação</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-headers"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
                <Label htmlFor="include-headers" className="text-sm font-normal">
                  Incluir cabeçalhos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-metadata"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
                <Label htmlFor="include-metadata" className="text-sm font-normal">
                  Incluir metadados
                </Label>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={type === "import" ? handleImport : handleExport}
            disabled={type === "import" && !selectedFile}
          >
            {type === "import" ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </>
            ) : (
              <>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

