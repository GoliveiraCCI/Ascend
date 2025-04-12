"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const historyFormSchema = z.object({
  departmentId: z.string().min(1, "Departamento é obrigatório"),
  positionId: z.string().min(1, "Cargo é obrigatório"),
  positionLevelId: z.string().optional(),
  shiftId: z.string().optional(),
  startDate: z.string().min(1, "Data inicial é obrigatória"),
  endDate: z.string().optional(),
})

interface HistoryEditFormProps {
  employeeId: string
  departments: { id: string; name: string }[]
  positions: { id: string; title: string }[]
  positionLevels: { id: string; name: string }[]
  shifts: { id: string; name: string }[]
}

interface HistoryEntry {
  id: string
  department: { id: string; name: string }
  position: { id: string; title: string }
  positionLevel?: { id: string; name: string }
  shift?: { id: string; name: string }
  startDate: string
  endDate?: string
}

export function HistoryEditForm({
  employeeId,
  departments,
  positions,
  positionLevels,
  shifts,
}: HistoryEditFormProps) {
  const { toast } = useToast()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof historyFormSchema>>({
    resolver: zodResolver(historyFormSchema),
    defaultValues: {
      departmentId: "",
      positionId: "",
      positionLevelId: "",
      shiftId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
  })

  useEffect(() => {
    fetchHistory()
  }, [employeeId])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/history`)
      if (!response.ok) throw new Error("Erro ao buscar histórico")
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error("Erro ao buscar histórico:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar o histórico.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof historyFormSchema>) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Erro ao salvar histórico")

      toast({
        title: "Sucesso",
        description: "Histórico salvo com sucesso.",
      })

      setIsDialogOpen(false)
      form.reset()
      fetchHistory()
    } catch (error) {
      console.error("Erro ao salvar histórico:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o histórico.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Histórico de Alterações</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Alteração
        </Button>
      </div>

      {isLoading ? (
        <p>Carregando histórico...</p>
      ) : history.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Inicial</TableHead>
              <TableHead>Data Final</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Salário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.startDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {entry.endDate ? new Date(entry.endDate).toLocaleDateString('pt-BR') : "-"}
                </TableCell>
                <TableCell>{entry.department?.name || "-"}</TableCell>
                <TableCell>{entry.positionlevel?.position?.title || "-"}</TableCell>
                <TableCell>{entry.positionlevel?.name || "-"}</TableCell>
                <TableCell>{entry.shift?.name || "-"}</TableCell>
                <TableCell>
                  {entry.positionlevel?.salary
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(entry.positionlevel.salary)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Nenhum histórico encontrado.</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Alteração</DialogTitle>
            <DialogDescription>
              Registre uma nova alteração no cargo, departamento ou turno do funcionário.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um departamento" />
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
                name="positionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.title}
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
                name="positionLevelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível do Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positionLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
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
                name="shiftId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turno</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um turno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shifts.map((shift) => (
                          <SelectItem key={shift.id} value={shift.id}>
                            {shift.name}
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
                    <FormLabel>Data Inicial</FormLabel>
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
                    <FormLabel>Data Final (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Salvar Alteração</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 