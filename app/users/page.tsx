"use client"

import { useState } from "react"
import { ArrowUpDown, FileSpreadsheet, Filter, MoreHorizontal, Plus, Search, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados de exemplo de usuários
const users = [
  {
    id: "USR001",
    name: "Admin Sistema",
    email: "admin@exemplo.com",
    role: "Administrador",
    department: "TI",
    lastActive: "Agora",
    status: "Ativo",
  },
  {
    id: "USR002",
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    role: "Gerente",
    department: "TI",
    lastActive: "5 minutos atrás",
    status: "Ativo",
  },
  {
    id: "USR003",
    name: "Maria Santos",
    email: "maria.santos@exemplo.com",
    role: "Gerente",
    department: "RH",
    lastActive: "30 minutos atrás",
    status: "Ativo",
  },
  {
    id: "USR004",
    name: "Roberto Oliveira",
    email: "roberto.oliveira@exemplo.com",
    role: "Gerente",
    department: "Financeiro",
    lastActive: "1 hora atrás",
    status: "Ativo",
  },
  {
    id: "USR005",
    name: "Camila Pereira",
    email: "camila.pereira@exemplo.com",
    role: "Gerente",
    department: "Marketing",
    lastActive: "2 horas atrás",
    status: "Ativo",
  },
  {
    id: "USR006",
    name: "Lucas Mendes",
    email: "lucas.mendes@exemplo.com",
    role: "Supervisor",
    department: "Operações",
    lastActive: "3 horas atrás",
    status: "Ativo",
  },
  {
    id: "USR007",
    name: "Ana Ferreira",
    email: "ana.ferreira@exemplo.com",
    role: "Supervisor",
    department: "TI",
    lastActive: "5 horas atrás",
    status: "Ativo",
  },
  {
    id: "USR008",
    name: "Pedro Costa",
    email: "pedro.costa@exemplo.com",
    role: "Funcionário",
    department: "TI",
    lastActive: "1 dia atrás",
    status: "Inativo",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filtrar e ordenar usuários
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((user) => roleFilter === "all" || user.role === roleFilter)
    .filter((user) => departmentFilter === "all" || user.department === departmentFilter)
    .filter((user) => statusFilter === "all" || user.status === statusFilter)
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else {
        return sortDirection === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
      }
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl">Usuários</h1>
        <p className="text-muted-foreground">Gerenciar usuários e permissões do sistema</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="roles">Papéis</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="animate-fade">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar usuários..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Papéis</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Funcionário">Funcionário</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Departamentos</SelectItem>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription>Preencha os detalhes para criar um novo usuário no sistema</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nome
                      </Label>
                      <Input id="name" placeholder="Nome completo" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input id="email" type="email" placeholder="email@exemplo.com" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Papel
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o papel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="manager">Gerente</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="employee">Funcionário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Departamento
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it">TI</SelectItem>
                          <SelectItem value="hr">RH</SelectItem>
                          <SelectItem value="finance">Financeiro</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operations">Operações</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Senha
                      </Label>
                      <Input id="password" type="password" placeholder="••••••••" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirm-password" className="text-right">
                        Confirmar Senha
                      </Label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Criar Usuário</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full md:w-auto">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="mt-4 overflow-hidden">
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>Gerenciar usuários e suas permissões no sistema</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                        ID
                        {sortField === "id" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                        Nome
                        {sortField === "name" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                      </TableHead>
                      <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("email")}>
                        Email
                        {sortField === "email" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
                        Papel
                        {sortField === "role" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hidden md:table-cell"
                        onClick={() => handleSort("department")}
                      >
                        Departamento
                        {sortField === "department" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hidden lg:table-cell"
                        onClick={() => handleSort("lastActive")}
                      >
                        Último Acesso
                        {sortField === "lastActive" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        Status
                        {sortField === "status" && <ArrowUpDown className="ml-2 inline h-4 w-4" />}
                      </TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="animate-fade">
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.department}</TableCell>
                        <TableCell className="hidden lg:table-cell">{user.lastActive}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              user.status === "Ativo"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem>Editar usuário</DropdownMenuItem>
                              <DropdownMenuItem>Redefinir senha</DropdownMenuItem>
                              <DropdownMenuItem>Gerenciar permissões</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "Ativo" ? (
                                <DropdownMenuItem className="text-amber-500">Desativar usuário</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-500">Ativar usuário</DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">Excluir usuário</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
                Mostrando {filteredUsers.length} de {users.length} usuários
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="roles" className="animate-fade">
          <Card>
            <CardHeader>
              <CardTitle>Papéis do Sistema</CardTitle>
              <CardDescription>Gerenciar papéis e níveis de acesso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Administrador",
                    description: "Acesso completo a todas as funcionalidades do sistema",
                    users: 1,
                    permissions: "Todas",
                  },
                  {
                    name: "Gerente",
                    description: "Acesso a relatórios e gerenciamento de equipes",
                    users: 3,
                    permissions: "Gerenciamento, Relatórios, Visualização",
                  },
                  {
                    name: "Supervisor",
                    description: "Acesso a avaliações e relatórios básicos",
                    users: 2,
                    permissions: "Avaliações, Relatórios Básicos, Visualização",
                  },
                  {
                    name: "Funcionário",
                    description: "Acesso limitado a informações pessoais",
                    users: 1,
                    permissions: "Visualização Limitada",
                  },
                ].map((role, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{role.name}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-4 sm:mt-0">
                      <div className="text-right">
                        <p className="text-sm font-medium">{role.users} usuários</p>
                        <p className="text-xs text-muted-foreground">{role.permissions}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Papel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="permissions" className="animate-fade">
          <Card>
            <CardHeader>
              <CardTitle>Permissões do Sistema</CardTitle>
              <CardDescription>Gerenciar permissões e controle de acesso</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="space-y-6 overflow-x-auto">
                {[
                  {
                    category: "Funcionários",
                    permissions: [
                      { name: "Visualizar Funcionários", roles: ["Administrador", "Gerente", "Supervisor"] },
                      { name: "Adicionar Funcionários", roles: ["Administrador", "Gerente"] },
                      { name: "Editar Funcionários", roles: ["Administrador", "Gerente"] },
                      { name: "Excluir Funcionários", roles: ["Administrador"] },
                    ],
                  },
                  {
                    category: "Avaliações",
                    permissions: [
                      { name: "Visualizar Avaliações", roles: ["Administrador", "Gerente", "Supervisor"] },
                      { name: "Criar Avaliações", roles: ["Administrador", "Gerente", "Supervisor"] },
                      { name: "Editar Avaliações", roles: ["Administrador", "Gerente"] },
                      { name: "Excluir Avaliações", roles: ["Administrador"] },
                    ],
                  },
                  {
                    category: "Relatórios",
                    permissions: [
                      { name: "Visualizar Relatórios Básicos", roles: ["Administrador", "Gerente", "Supervisor"] },
                      { name: "Visualizar Relatórios Avançados", roles: ["Administrador", "Gerente"] },
                      { name: "Exportar Relatórios", roles: ["Administrador", "Gerente"] },
                      { name: "Criar Relatórios Personalizados", roles: ["Administrador"] },
                    ],
                  },
                ].map((category, i) => (
                  <div key={i} className="rounded-lg border">
                    <div className="border-b bg-muted/50 px-4 py-3">
                      <h3 className="font-medium">{category.category}</h3>
                    </div>
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Permissão</TableHead>
                              <TableHead>Administrador</TableHead>
                              <TableHead>Gerente</TableHead>
                              <TableHead>Supervisor</TableHead>
                              <TableHead>Funcionário</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.permissions.map((permission, j) => (
                              <TableRow key={j}>
                                <TableCell>{permission.name}</TableCell>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    defaultChecked={permission.roles.includes("Administrador")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    defaultChecked={permission.roles.includes("Gerente")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    defaultChecked={permission.roles.includes("Supervisor")}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    defaultChecked={permission.roles.includes("Funcionário")}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

