"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, Trash2, Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MedicalLeaveFilesProps {
  medicalLeaveId: string
  files: {
    id: string
    name: string
    type: string
    url: string
  }[]
  onFilesChange: (files: any[]) => void
}

export function MedicalLeaveFiles({
  medicalLeaveId,
  files,
  onFilesChange,
}: MedicalLeaveFilesProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)
    const formData = new FormData()

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i])
    }

    try {
      console.log("Iniciando upload de arquivos...")
      const response = await fetch(`/api/medical-leaves/${medicalLeaveId}/files`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      console.log("Resposta da API:", data)

      if (!response.ok) {
        const errorMessage = data.error || data.details || "Erro ao fazer upload dos arquivos"
        console.error("Erro na resposta da API:", errorMessage)
        throw new Error(errorMessage)
      }

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida do servidor")
      }

      onFilesChange([...files, ...data])

      toast({
        title: "Sucesso",
        description: "Arquivos anexados com sucesso",
      })
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao anexar arquivos",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/medical-leaves/${medicalLeaveId}/files/${fileId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao remover arquivo")
      }

      onFilesChange(files.filter((file) => file.id !== fileId))

      toast({
        title: "Sucesso",
        description: "Arquivo removido com sucesso",
      })
    } catch (error) {
      console.error("Erro ao remover arquivo:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover arquivo",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arquivos Anexados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Enviando..." : "Anexar Arquivos"}
            </Button>
          </div>

          {files.length > 0 ? (
            <div className="grid gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhum arquivo anexado</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 