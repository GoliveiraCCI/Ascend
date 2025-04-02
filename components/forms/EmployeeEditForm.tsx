"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistoryEditForm } from "./HistoryEditForm"
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
import { Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const employeeFormSchema = z.object({
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  hireDate: z.string().min(1, "Data de contratação é obrigatória"),
  terminationDate: z.string().optional(),
  departmentId: z.string().min(1, "Departamento é obrigatório"),
  positionId: z.string().min(1, "Cargo é obrigatório"),
  positionLevelId: z.string().optional(),
  shiftId: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

interface EmployeeEditFormProps {
  employee?: {
    id: string
    matricula: string
    name: string
    email: string
    cpf: string
    birthDate: string
    hireDate: string
    terminationDate?: string
    departmentId: string
    positionId: string
    positionLevelId?: string
    shiftId?: string
    phone?: string
    address?: string
  }
  departments: { id: string; name: string }[]
  positions: { id: string; title: string }[]
  positionLevels: { id: string; name: string }[]
  shifts: { id: string; name: string }[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EmployeeEditForm({
  employee,
  departments,
  positions,
  positionLevels,
  shifts,
  isOpen,
  onClose,
  onSuccess,
}: EmployeeEditFormProps) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      matricula: "",
      name: "",
      email: "",
      cpf: "",
      birthDate: new Date().toISOString().split("T")[0],
      hireDate: new Date().toISOString().split("T")[0],
      terminationDate: "",
      departmentId: "",
      positionId: "",
      positionLevelId: "",
      shiftId: "",
      phone: "",
      address: "",
    },
  })

  // Resetar o formulário quando o employee mudar
  useEffect(() => {
    if (employee) {
      console.log("Dados do funcionário recebidos:", employee)
      console.log("Listas de opções:", {
        departments: departments.map(d => ({ id: d.id, name: d.name })),
        positions: positions.map(p => ({ id: p.id, title: p.title })),
        positionLevels: positionLevels.map(l => ({ id: l.id, name: l.name })),
        shifts: shifts.map(s => ({ id: s.id, name: s.name }))
      })

      // Garantir que os IDs estejam definidos
      const formData = {
        matricula: employee.matricula || "",
        name: employee.name || "",
        email: employee.email || "",
        cpf: employee.cpf || "",
        birthDate: employee.birthDate || new Date().toISOString().split("T")[0],
        hireDate: employee.hireDate || new Date().toISOString().split("T")[0],
        terminationDate: employee.terminationDate || "",
        departmentId: employee.departmentId || "",
        positionId: employee.positionId || "",
        positionLevelId: employee.positionLevelId || "",
        shiftId: employee.shiftId || "",
        phone: employee.phone || "",
        address: employee.address || "",
      }

      console.log("Dados do formulário antes do reset:", formData)
      form.reset(formData)

      // Verificar os valores após o reset
      console.log("Valores do formulário após reset:", {
        departmentId: form.getValues("departmentId"),
        positionId: form.getValues("positionId"),
        positionLevelId: form.getValues("positionLevelId"),
        shiftId: form.getValues("shiftId")
      })
    }
  }, [employee, form, departments, positions, positionLevels, shifts])

  const onSubmit = async (values: z.infer<typeof employeeFormSchema>) => {
    try {
      const url = employee
        ? `/api/employees/${employee.id}`
        : "/api/employees"
      
      const method = employee ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "P2002") {
          throw new Error("Este email já está cadastrado para outro funcionário")
        }
        throw new Error(data.message || "Erro ao salvar funcionário")
      }

      toast({
        title: "Sucesso",
        description: employee
          ? "Funcionário atualizado com sucesso"
          : "Funcionário cadastrado com sucesso",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o funcionário.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!employee) return

    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir funcionário")
      }

      toast({
        title: "Funcionário excluído",
        description: "O funcionário foi excluído com sucesso.",
      })

      setIsDeleteDialogOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o funcionário.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
          <DialogDescription>
            {employee
              ? "Atualize as informações do funcionário"
              : "Preencha as informações para cadastrar um novo funcionário"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="matricula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matrícula</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Contratação</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terminationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Desligamento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => {
                      const selectedDepartment = departments.find(d => d.id === field.value)
                      console.log("Campo departmentId:", {
                        value: field.value,
                        selectedDepartment,
                        allDepartments: departments
                      })
                      return (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            disabled
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  {selectedDepartment?.name || "Selecione um departamento"}
                                </SelectValue>
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
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="positionId"
                    render={({ field }) => {
                      const selectedPosition = positions.find(p => p.id === field.value)
                      console.log("Campo positionId:", {
                        value: field.value,
                        selectedPosition,
                        allPositions: positions
                      })
                      return (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            disabled
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  {selectedPosition?.title || "Selecione um cargo"}
                                </SelectValue>
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
                      )
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="positionLevelId"
                    render={({ field }) => {
                      const selectedLevel = positionLevels.find(l => l.id === field.value)
                      console.log("Campo positionLevelId:", {
                        value: field.value,
                        selectedLevel,
                        allLevels: positionLevels
                      })
                      return (
                        <FormItem>
                          <FormLabel>Nível do Cargo</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            disabled
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  {selectedLevel?.name || "Selecione um nível"}
                                </SelectValue>
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
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="shiftId"
                    render={({ field }) => {
                      const selectedShift = shifts.find(s => s.id === field.value)
                      console.log("Campo shiftId:", {
                        value: field.value,
                        selectedShift,
                        allShifts: shifts
                      })
                      return (
                        <FormItem>
                          <FormLabel>Turno</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            disabled
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  {selectedShift?.name || "Selecione um turno"}
                                </SelectValue>
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
                      )
                    }}
                  />
                </div>

                <div className="flex justify-between space-x-2">
                  {employee && (
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir funcionário</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <div className="flex space-x-2 ml-auto">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={(e) => {
                        e.preventDefault()
                        onClose()
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {employee ? "Salvar Alterações" : "Cadastrar"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="history">
            {employee ? (
              <HistoryEditForm
                employeeId={employee.id}
                departments={departments}
                positions={positions}
                positionLevels={positionLevels}
                shifts={shifts}
              />
            ) : (
              <p className="text-center text-muted-foreground">
                O histórico estará disponível após cadastrar o funcionário.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 