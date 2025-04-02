"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

interface TrainingFilesProps {
  initialFiles: {
    id: string
    name: string
    type: string
    url: string
  }[]
  onFilesChange: (files: File[]) => void
  onRemovedFilesChange: (removedFiles: string[]) => void
  trainingId: string
}

export function TrainingFiles({ initialFiles, onFilesChange, onRemovedFilesChange, trainingId }: TrainingFilesProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [removedFiles, setRemovedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    if (newFiles.length === 0) return

    // Validar arquivos
    const validFiles = newFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error(`O arquivo ${file.name} excede o tamanho máximo de 10MB`)
        return false
      }
      if (![
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ].includes(file.type)) {
        toast.error(`O arquivo ${file.name} não é um formato suportado`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      validFiles.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch(`/api/trainings/${trainingId}/materials`, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error("Erro ao fazer upload dos arquivos")
      }

      const uploadedFiles = await response.json()
      
      setFiles([...files, ...validFiles])
      const urls = validFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls([...previewUrls, ...urls])
      onFilesChange([...files, ...validFiles])

      toast.success("Arquivos adicionados com sucesso!")
    } catch (error) {
      console.error("Erro ao fazer upload dos arquivos:", error)
      toast.error("Não foi possível adicionar os arquivos.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = async (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    const newUrls = [...previewUrls]
    newUrls.splice(index, 1)
    setPreviewUrls(newUrls)
    onFilesChange(newFiles)
  }

  const handleRemoveInitialFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/trainings/${trainingId}/materials/${fileId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Erro ao remover o arquivo")
      }

      const newRemovedFiles = [...removedFiles, fileId]
      setRemovedFiles(newRemovedFiles)
      onRemovedFilesChange(newRemovedFiles)

      toast.success("Arquivo removido com sucesso!")
    } catch (error) {
      console.error("Erro ao remover arquivo:", error)
      toast.error("Não foi possível remover o arquivo.")
    }
  }

  const handleAddFilesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    document.querySelector('input[type="file"]')?.click()
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initialFiles.filter(file => !removedFiles.includes(file.id)).map((file) => (
          <Card key={file.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemoveInitialFile(file.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {files.map((file, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Novo
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemoveFile(index)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddFilesClick}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Enviando..." : "Adicionar Arquivos"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Formatos suportados: PDF, JPG, JPEG, PNG, DOC, DOCX, PPT, PPTX. Tamanho máximo: 10MB por arquivo.
      </p>
    </div>
  )
} 