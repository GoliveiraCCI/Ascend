"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { TrainingFiles } from "../new/training-files"
import { TrainingParticipants } from "../new/training-participants"

interface NewTrainingFormProps {
  onCancel: () => void
  onSuccess: () => void
  departments: Department[]
}

const formSchema = z.object({
  name: z.string().min(1, "Título é obrigatório"),
  source: z.string().min(1, "Origem é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  instructor: z.string().min(1, "Instrutor é obrigatório"),
  institution: z.string().min(1, "Instituição é obrigatória"),
  hours: z.string().min(1, "Carga horária é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória")
})

export default function NewTrainingForm({ onCancel, onSuccess, departments }: NewTrainingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      source: "",
      startDate: "",
      endDate: "",
      description: "",
      instructor: "",
      institution: "",
      hours: "",
      category: ""
    }
  })

  const handleFilesChange = (newFiles: File[]) => {
    console.log("NewTrainingForm - handleFilesChange - Novos arquivos:", newFiles.map(f => f.name))
    setFiles(newFiles)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      if (selectedParticipants.length === 0) {
        toast.error("Selecione pelo menos um participante")
        return
      }

      const startDate = new Date(values.startDate)
      const endDate = new Date(values.endDate)

      if (startDate > endDate) {
        toast.error("A data de início não pode ser posterior à data de término")
        return
      }

      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("source", values.source)
      formData.append("startDate", values.startDate)
      formData.append("endDate", values.endDate)
      formData.append("description", values.description)
      formData.append("instructor", values.instructor)
      formData.append("institution", values.institution)
      formData.append("hours", values.hours)
      formData.append("category", values.category)
      formData.append("participants", JSON.stringify(selectedParticipants))

      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/trainings", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar treinamento")
      }

      toast.success("Treinamento criado com sucesso!")
      onSuccess()
      router.push("/trainings")
      router.refresh()
    } catch (error) {
      console.error("Erro ao criar treinamento:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao criar treinamento")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Informações do Treinamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do treinamento" {...field} />
                    </FormControl>
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
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrutor</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do instrutor" {...field} />
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
                    <FormLabel>Instituição</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da instituição" {...field} />
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
                      <Input placeholder="Digite a carga horária" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Digite a descrição do treinamento" {...field} />
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
                        <SelectItem value="SAFETY">Segurança</SelectItem>
                        <SelectItem value="QUALITY">Qualidade</SelectItem>
                        <SelectItem value="PROCESS">Processo</SelectItem>
                        <SelectItem value="TECHNICAL">Técnico</SelectItem>
                        <SelectItem value="MANAGEMENT">Gestão</SelectItem>
                        <SelectItem value="OTHER">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <TrainingParticipants
          selectedParticipants={selectedParticipants}
          onParticipantsChange={setSelectedParticipants}
        />

        <TrainingFiles 
          files={files} 
          onFilesChange={handleFilesChange} 
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar Treinamento"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 