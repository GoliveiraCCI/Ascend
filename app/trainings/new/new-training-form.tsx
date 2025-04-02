"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import { toast } from "sonner"
import TrainingFiles from "./training-files"
import TrainingParticipants from "./training-participants"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FileIcon } from "lucide-react"

interface NewTrainingFormProps {
  departments: { id: string; name: string }[]
  onSuccess?: () => void
}

const formSchema = z.object({
  name: z.string().min(1, "O nome do treinamento é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  type: z.enum(["INDIVIDUAL", "TEAM"]),
  source: z.enum(["INTERNAL", "EXTERNAL"]),
  instructor: z.string().min(1, "O instrutor é obrigatório"),
  institution: z.string().optional(),
  departmentId: z.string().min(1, "O departamento é obrigatório"),
  startDate: z.string().min(1, "A data de início é obrigatória"),
  endDate: z.string().min(1, "A data de término é obrigatória"),
  hours: z.string().min(1, "A carga horária é obrigatória"),
  description: z.string().optional(),
})

export default function NewTrainingForm({ departments, onSuccess }: NewTrainingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [trainingType, setTrainingType] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      type: "INDIVIDUAL",
      source: "INTERNAL",
      instructor: "",
      institution: "",
      departmentId: "",
      startDate: "",
      endDate: "",
      hours: "",
      description: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      
      // Adicionar campos do formulário
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Adicionar os arquivos ao FormData
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Adicionar os participantes ao FormData apenas se for treinamento em equipe
      if (values.type === "TEAM") {
        if (selectedParticipants.length === 0) {
          toast.error("Selecione pelo menos um participante para treinamentos em equipe")
          setIsSubmitting(false)
          return
        }
        formData.append("participants", JSON.stringify(selectedParticipants))
      }

      // Adicionar o departmentId ao FormData
      formData.append("departmentId", values.departmentId)

      const response = await fetch("/api/trainings", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar treinamento")
      }

      toast.success("Treinamento criado com sucesso")
      if (onSuccess) {
        onSuccess()
      }
      router.push("/trainings")
      router.refresh()
    } catch (error) {
      console.error("Erro ao criar treinamento:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao criar treinamento")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Novo Treinamento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Treinamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Treinamento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TECHNICAL">Técnico</SelectItem>
                          <SelectItem value="SOFT_SKILLS">Habilidades Sociais</SelectItem>
                          <SelectItem value="LEADERSHIP">Liderança</SelectItem>
                          <SelectItem value="COMPLIANCE">Conformidade</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value)
                          setTrainingType(value)
                          if (value !== "TEAM") {
                            setSelectedParticipants([])
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                          <SelectItem value="TEAM">Equipe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a origem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INTERNAL">Interno</SelectItem>
                          <SelectItem value="EXTERNAL">Externo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instrutor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instituição (apenas para treinamentos externos)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedDepartment(value)
                          setSelectedParticipants([])
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o departamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Término</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carga Horária</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Treinamento"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {selectedDepartment && trainingType === "TEAM" && (
        <TrainingParticipants
          departmentId={selectedDepartment}
          selectedParticipants={selectedParticipants}
          onParticipantsChange={setSelectedParticipants}
          type={trainingType}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Anexos do Treinamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
                onChange={(e) => {
                  const selectedFiles = e.target.files
                  if (!selectedFiles || selectedFiles.length === 0) return

                  const newFiles = Array.from(selectedFiles)
                  const validFiles = newFiles.filter(file => {
                    if (file.size > 10 * 1024 * 1024) {
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

                  setFiles(prev => [...prev, ...validFiles])
                }}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Incluir Anexo
              </Button>
            </div>

            {files.length > 0 ? (
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
                        <span className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFiles(prev => prev.filter((_, i) => i !== index))
                      }}
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
    </div>
  )
} 