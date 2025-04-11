"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Position {
  id: string
  title: string
  description: string | null
  departmentId: string
  department: {
    id: string
    name: string
  }
  positionlevel: PositionLevel[]
}

interface PositionLevel {
  id: string
  name: string
  salary: number
  positionId: string
}

interface Department {
  id: string
  name: string
}

export default function PositionsTab() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [positions, setPositions] = useState<Position[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentId: "",
  })
  const [positionLevels, setPositionLevels] = useState<PositionLevel[]>([])
  const [newLevel, setNewLevel] = useState({
    name: "",
    salary: "",
  })

  useEffect(() => {
    fetchPositions()
    fetchDepartments()
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/positions")
      if (!response.ok) throw new Error("Erro ao buscar cargos")
      const data = await response.json()
      setPositions(data)
    } catch (error) {
      console.error("Erro ao buscar cargos:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar cargos",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments")
      if (!response.ok) throw new Error("Erro ao buscar departamentos")
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar departamentos",
      })
    }
  }

  const handleAddLevel = () => {
    if (!newLevel.name.trim() || !newLevel.salary.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e salário são obrigatórios"
      })
      return
    }

    setPositionLevels([
      ...positionLevels,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newLevel.name.trim(),
        salary: parseFloat(newLevel.salary),
        positionId: ""
      }
    ])

    setNewLevel({
      name: "",
      salary: "",
    })
  }

  const handleRemoveLevel = (id: string) => {
    setPositionLevels(positionLevels.filter(level => level.id !== id))
  }

  const handleCreate = async () => {
    try {
      // Validar campos obrigatórios
      if (!formData.title.trim()) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "O título do cargo é obrigatório"
        })
        return
      }

      if (!formData.departmentId) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Selecione um departamento"
        })
        return
      }

      if (positionLevels.length === 0) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Adicione pelo menos uma faixa de cargo"
        })
        return
      }

      const response = await fetch("/api/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description?.trim(),
          departmentId: formData.departmentId,
          positionLevels: positionLevels.map(level => ({
            name: level.name,
            salary: level.salary
          }))
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar cargo")
      }

      await fetchPositions()
      setCreateDialogOpen(false)
      setFormData({
        title: "",
        description: "",
        departmentId: ""
      })
      setPositionLevels([])
      toast({
        title: "Sucesso",
        description: "Cargo criado com sucesso"
      })
    } catch (error) {
      console.error("Erro ao criar cargo:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar cargo"
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedPosition) return

    try {
      const response = await fetch(`/api/positions/${selectedPosition.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          positionLevels: positionLevels.map(level => ({
            id: level.id,
            name: level.name,
            salary: level.salary
          }))
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao atualizar cargo")
      }

      await fetchPositions()
      setEditDialogOpen(false)
      setSelectedPosition(null)
      setFormData({
        title: "",
        description: "",
        departmentId: "",
      })
      setPositionLevels([])
      toast({
        title: "Sucesso",
        description: "Cargo atualizado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao atualizar cargo:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar cargo",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedPosition) return

    try {
      const response = await fetch(`/api/positions/${selectedPosition.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao excluir cargo")
      }

      await fetchPositions()
      setDeleteDialogOpen(false)
      setSelectedPosition(null)
      toast({
        title: "Sucesso",
        description: "Cargo excluído com sucesso",
      })
    } catch (error) {
      console.error("Erro ao excluir cargo:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir cargo",
      })
    }
  }

  const filteredPositions = positions.filter((position) =>
    position.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cargos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px] lg:w-[400px]"
          />
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cargo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Cargo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Faixas de Cargo</Label>
                <div className="space-y-2">
                  {positionLevels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Input
                        value={level.name}
                        onChange={(e) => {
                          setPositionLevels(
                            positionLevels.map((l) =>
                              l.id === level.id ? { ...l, name: e.target.value } : l
                            )
                          )
                        }}
                        placeholder="Nome da faixa"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={level.salary}
                        onChange={(e) => {
                          setPositionLevels(
                            positionLevels.map((l) =>
                              l.id === level.id ? { ...l, salary: parseFloat(e.target.value) } : l
                            )
                          )
                        }}
                        placeholder="Salário"
                        className="w-32"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLevel(level.id)}
                        className="h-8 w-8"
                      >
                        <span className="sr-only">Remover faixa</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newLevel.name}
                      onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
                      placeholder="Nome da faixa"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={newLevel.salary}
                      onChange={(e) => setNewLevel({ ...newLevel, salary: e.target.value })}
                      placeholder="Salário"
                      className="w-32"
                    />
                    <Button onClick={handleAddLevel} className="h-8 w-8">
                      <span className="sr-only">Adicionar faixa</span>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={handleCreate} className="w-full mt-6">
              Criar
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Faixas</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : filteredPositions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum cargo encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell>{position.title}</TableCell>
                <TableCell>{position.description}</TableCell>
                <TableCell>{position.department.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {position.positionlevel?.map((level) => (
                      <div key={level.id} className="text-sm">
                        {level.name} - R$ {level.salary.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPosition(position)
                          setFormData({
                            title: position.title,
                            description: position.description || "",
                            departmentId: position.departmentId,
                          })
                          setPositionLevels(position.positionLevels)
                          setEditDialogOpen(true)
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPosition(position)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cargo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Departamento</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Faixas de Cargo</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLevel}
                >
                  Adicionar Faixa
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da faixa"
                    value={newLevel.name}
                    onChange={(e) => setNewLevel({ ...newLevel, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Salário"
                    value={newLevel.salary}
                    onChange={(e) => setNewLevel({ ...newLevel, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {positionLevels.map((level) => (
                  <div key={level.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{level.name}</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {level.salary.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLevel(level.id)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={handleEdit} className="w-full mt-6">
            Salvar
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cargo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cargo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 