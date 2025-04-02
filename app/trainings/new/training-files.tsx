"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileIcon, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface TrainingFilesProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function TrainingFiles({ files, onFilesChange }: TrainingFilesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange - Iniciando")
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log("handleFileChange - Nenhum arquivo selecionado")
      return
    }

    const newFiles = Array.from(selectedFiles)
    console.log("handleFileChange - Arquivos selecionados:", newFiles.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
      sizeMB: (f.size / (1024 * 1024)).toFixed(2)
    })))

    // Validar arquivos
    const validFiles = newFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error(`O arquivo ${file.name} excede o tamanho máximo de 10MB`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles]
      console.log("handleFileChange - Total de arquivos:", updatedFiles.length)
      onFilesChange(updatedFiles)
    }

    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (index: number) => {
    console.log("handleRemoveFile - Removendo arquivo no índice:", index)
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  console.log("TrainingFiles - Renderizando com arquivos:", files.map(f => ({
    name: f.name,
    type: f.type,
    size: f.size,
    sizeMB: (f.size / (1024 * 1024)).toFixed(2)
  })))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Anexos do Treinamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Enviando..." : "Incluir Anexo"}
            </Button>
          </div>

          {files && files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`file-${index}-${file.name}`}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum arquivo anexado</p>
          )}

          <p className="text-xs text-muted-foreground">
            Formatos suportados: PDF, JPG, JPEG, PNG, DOC, DOCX, PPT, PPTX. Tamanho máximo: 10MB por arquivo.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 