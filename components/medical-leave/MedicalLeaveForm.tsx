"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MedicalLeaveFormProps {
  initialData?: {
    id: string
    employee: {
      id: string
      name: string
      matricula: string
      department: {
        id: string
        name: string
      }
    }
    startDate: string
    endDate: string
    days: number
    reason: string
    doctor: string | null
    hospital: string | null
    status: string
    notes: string | null
    category?: {
      id: string
      name: string
    }
    file?: {
      id: string
      url: string
      type: string
      name: string
    } | null
  }
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

const formSchema = z.object({
  startDate: z.date({
    required_error: "A data de início é obrigatória",
  }),
  endDate: z.date({
    required_error: "A data de término é obrigatória",
  }),
  days: z.number().min(1, "O número de dias deve ser maior que 0"),
  reason: z.string().min(1, "O motivo é obrigatório"),
  doctor: z.string().nullable(),
  hospital: z.string().nullable(),
  status: z.string(),
  notes: z.string().nullable(),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  file: z.any().optional(),
})

export function MedicalLeaveForm({
  initialData,
  onSuccess,
  onError
}: MedicalLeaveFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: initialData ? new Date(initialData.startDate) : new Date(),
      endDate: initialData ? new Date(initialData.endDate) : new Date(),
      days: initialData?.days || 1,
      reason: initialData?.reason || "",
      doctor: initialData?.doctor || "",
      hospital: initialData?.hospital || "",
      status: initialData?.status || "AFASTADO",
      notes: initialData?.notes || "",
      categoryId: initialData?.category?.id || "",
    },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/medical-leaves/categories")
      if (!response.ok) throw new Error("Erro ao buscar categorias")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      onError?.(error)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      
      const formData = new FormData()
      
      // Adicionar campos do formulário
      formData.append("startDate", values.startDate.toISOString())
      formData.append("endDate", values.endDate.toISOString())
      formData.append("days", values.days.toString())
      formData.append("reason", values.reason)
      formData.append("doctor", values.doctor || "")
      formData.append("hospital", values.hospital || "")
      formData.append("status", values.status)
      formData.append("notes", values.notes || "")
      formData.append("categoryId", values.categoryId)
      
      // Se houver arquivo, adicionar ao FormData
      if (values.file?.[0]) {
        formData.append("file", values.file[0])
      }

      // Se for edição, adicionar ID
      if (initialData) {
        formData.append("id", initialData.id)
      }

      const response = await fetch(
        initialData 
          ? `/api/medical-leaves?id=${initialData.id}`
          : "/api/medical-leaves",
        {
          method: initialData ? "PUT" : "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao salvar atestado médico")
      }

      onSuccess?.()
    } catch (error) {
      console.error("Erro ao salvar atestado:", error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Término</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dias de Afastamento</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
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
            name="doctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital/Clínica</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AFASTADO">Afastado</SelectItem>
                    <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, ...field } }) => (
              <FormItem className="col-span-2">
                <FormLabel>Arquivo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Atualizar" : "Criar"} Atestado Médico
        </Button>
      </form>
    </Form>
  )
} 