"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Check, Upload, X } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Category {
  id: string
  name: string
  description: string
}

interface Employee {
  id: string
  name: string
  matricula: string
}

interface MedicalLeaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function MedicalLeaveDialog({
  open,
  onOpenChange,
  onSuccess,
}: MedicalLeaveDialogProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    categoryId: "",
    startDate: "",
    endDate: "",
    reason: "",
    doctor: "",
    hospital: "",
    notes: "",
  })
  const [employees, setEmployees] = useState<Employee[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [openCombobox, setOpenCombobox] = useState(false)

  useEffect(() => {
    console.log("MedicalLeaveDialog - useEffect - open:", open)
    if (open) {
      fetchEmployees()
      fetchCategories()
    }
  }, [open])

  const fetchEmployees = async () => {
    try {
      console.log("Buscando funcionários...")
      const response = await fetch("/api/employees")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao buscar funcionários")
      }
      const data = await response.json()
      console.log("Funcionários encontrados:", data)
      setEmployees(data)
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar funcionários",
        variant: "destructive",
      })
    }
  }

  const fetchCategories = async () => {
    try {
      console.log("Buscando categorias...")
      const response = await fetch("/api/medical-leaves/categories")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao buscar categorias")
      }
      const data = await response.json()
      console.log("Categorias encontradas:", data)
      setCategories(data)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar categorias",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles(files)
      // Criar preview para imagens
      if (files[0].type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result as string)
        }
        reader.readAsDataURL(files[0])
      } else {
        setFilePreview(null)
      }
    }
  }

  const handleRemoveFile = () => {
    setSelectedFiles([])
    setFilePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1

      const formDataToSend = new FormData()
      formDataToSend.append('employeeId', formData.employeeId)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('startDate', startDate.toISOString())
      formDataToSend.append('endDate', endDate.toISOString())
      formDataToSend.append('days', days.toString())
      formDataToSend.append('reason', formData.reason)
      formDataToSend.append('doctor', formData.doctor)
      formDataToSend.append('hospital', formData.hospital)
      formDataToSend.append('notes', formData.notes)
      formDataToSend.append('status', 'AFASTADO')

      // Adiciona os arquivos ao FormData
      selectedFiles.forEach((file) => {
        formDataToSend.append('files', file)
      })

      const response = await fetch("/api/medical-leaves", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Erro ao criar licença médica")
      }

      toast({
        title: "Sucesso",
        description: "Licença médica criada com sucesso",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar licença médica",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Nova Licença Médica</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Funcionário</Label>
              <Command className="border rounded-md">
                <CommandInput 
                  placeholder="Digite o nome ou matrícula do funcionário..."
                  value={searchValue}
                  onValueChange={(value) => {
                    setSearchValue(value)
                    const searchLower = value.toLowerCase()
                    const filtered = employees.filter(employee => {
                      const nameMatch = employee.name?.toLowerCase().includes(searchLower) || false
                      const matriculaMatch = employee.matricula?.toLowerCase().includes(searchLower) || false
                      return nameMatch || matriculaMatch
                    })
                    setFilteredEmployees(filtered)
                  }}
                />
                <CommandEmpty>Nenhum funcionário encontrado.</CommandEmpty>
                <CommandGroup className="max-h-[150px] overflow-auto">
                  {(searchValue ? filteredEmployees : employees).map((employee) => (
                    <CommandItem
                      key={employee.id}
                      value={`${employee.name} ${employee.matricula}`}
                      onSelect={() => {
                        setFormData({ ...formData, employeeId: employee.id })
                        setSearchValue(employee.name)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.employeeId === employee.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{employee.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Matrícula: {employee.matricula}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Médico</Label>
                <Input
                  id="doctor"
                  value={formData.doctor}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital/Clínica</Label>
                <Input
                  id="hospital"
                  value={formData.hospital}
                  onChange={(e) =>
                    setFormData({ ...formData, hospital: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Arquivos Anexados</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="flex-1"
                  multiple
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedFiles.map(file => file.name).join(', ')}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {filePreview && (
                <div className="mt-2 relative h-40 w-full">
                  <Image
                    src={filePreview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-md border"
                  />
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "Criando..." : "Criar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 