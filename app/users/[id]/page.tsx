"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Activity, ArrowLeft, Building, Calendar, Edit, Mail, MapPin, Phone, Save, Shield, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Dados de exemplo do usuário
const userData = {
  id: "USR001",
  name: "João Silva",
  email: "joao.silva@exemplo.com",
  phone: "+55 (11) 98765-4321",
  role: "Gerente",
  department: "TI",
  joinDate: "2022-01-15",
  status: "Ativo",
  bio: "Gerente de TI com mais de 10 anos de experiência em desenvolvimento de software e gestão de equipes.",
  skills: ["Gestão de Projetos", "Desenvolvimento Web", "Liderança", "Arquitetura de Software"],
  address: {
    street: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    country: "Brasil",
  },
  emergencyContact: {
    name: "Maria Silva",
    relationship: "Cônjuge",
    phone: "+55 (11) 98765-1234",
  },
  permissions: [
    { name: "Gerenciar Usuários", granted: true },
    { name: "Gerenciar Departamentos", granted: true },
    { name: "Gerenciar Avaliações", granted: true },
    { name: "Gerenciar Relatórios", granted: true },
    { name: "Administração do Sistema", granted: false },
  ],
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    id: "USR001",
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    phone: "+55 (11) 98765-4321",
    role: "Gerente",
    department: "TI",
    joinDate: "2022-01-15",
    status: "Ativo",
    bio: "Gerente de TI com mais de 10 anos de experiência em desenvolvimento de software e gestão de equipes.",
    skills: ["Gestão de Projetos", "Desenvolvimento Web", "Liderança", "Arquitetura de Software"],
    address: {
      street: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      country: "Brasil",
    },
    emergencyContact: {
      name: "Maria Silva",
      relationship: "Cônjuge",
      phone: "+55 (11) 98765-1234",
    },
    permissions: [
      { name: "Gerenciar Usuários", granted: true },
      { name: "Gerenciar Departamentos", granted: true },
      { name: "Gerenciar Avaliações", granted: true },
      { name: "Gerenciar Relatórios", granted: true },
      { name: "Administração do Sistema", granted: false },
    ],
  })

  const handleGoBack = () => {
    router.back()
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as alterações
    setIsEditing(false)
  }

  const handlePermissionChange = (index: number) => {
    const updatedPermissions = [...userData.permissions]
    updatedPermissions[index].granted = !updatedPermissions[index].granted
    setUserData({
      ...userData,
      permissions: updatedPermissions,
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{userData.name}</h1>
          <p className="text-muted-foreground">
            {userData.role} • {userData.department}
          </p>
        </div>
        <div className="ml-auto">
          {isEditing ? (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          ) : (
            <Button variant="outline" onClick={toggleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Dados pessoais e profissionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <Badge variant={userData.status === "Ativo" ? "default" : "destructive"}>{userData.status}</Badge>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Telefone:</span>
                <span className="text-sm">{userData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Departamento:</span>
                <span className="text-sm">{userData.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Data de Admissão:</span>
                <span className="text-sm">{new Date(userData.joinDate).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="mb-2 text-sm font-medium">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
                <TabsTrigger value="permissions">Permissões</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="details" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    defaultValue={userData.name}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userData.email}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      defaultValue={userData.phone}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    {isEditing ? (
                      <Select defaultValue={userData.role}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                          <SelectItem value="Gerente">Gerente</SelectItem>
                          <SelectItem value="Supervisor">Supervisor</SelectItem>
                          <SelectItem value="Funcionário">Funcionário</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="role" defaultValue={userData.role} readOnly className="bg-muted" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    {isEditing ? (
                      <Select defaultValue={userData.department}>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TI">TI</SelectItem>
                          <SelectItem value="RH">RH</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Operações">Operações</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="department" defaultValue={userData.department} readOnly className="bg-muted" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    defaultValue={userData.bio}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Contato de Emergência</Label>
                  <div className="rounded-md border p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="emergency-name">Nome</Label>
                        <Input
                          id="emergency-name"
                          defaultValue={userData.emergencyContact.name}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-relationship">Relação</Label>
                        <Input
                          id="emergency-relationship"
                          defaultValue={userData.emergencyContact.relationship}
                          readOnly={!isEditing}
                          className={!isEditing ? "bg-muted" : ""}
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="emergency-phone">Telefone</Label>
                      <Input
                        id="emergency-phone"
                        defaultValue={userData.emergencyContact.phone}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="address" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Rua/Avenida</Label>
                  <Input
                    id="street"
                    defaultValue={userData.address.street}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      defaultValue={userData.address.city}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      defaultValue={userData.address.state}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zip-code">CEP</Label>
                    <Input
                      id="zip-code"
                      defaultValue={userData.address.zipCode}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      defaultValue={userData.address.country}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Endereço completo: {userData.address.street}, {userData.address.city}, {userData.address.state},{" "}
                    {userData.address.zipCode}, {userData.address.country}
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="permissions" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Permissões do Usuário</span>
                </div>
                <div className="space-y-2">
                  {userData.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>{permission.name}</span>
                      </div>
                      <Switch
                        checked={permission.granted}
                        onCheckedChange={() => handlePermissionChange(index)}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    As permissões determinam quais ações o usuário pode realizar no sistema. Apenas administradores
                    podem modificar permissões de outros usuários.
                  </p>
                </div>
              </div>
            </TabsContent>
          </CardContent>
          <CardFooter className="flex justify-end">
            {isEditing && (
              <Button variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            )}
            {isEditing && (
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas ações realizadas pelo usuário no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Avaliação concluída", target: "Maria Santos", date: "Hoje, 14:30" },
              { action: "Relatório gerado", target: "Desempenho Trimestral", date: "Ontem, 10:15" },
              { action: "Treinamento agendado", target: "Liderança Avançada", date: "15/03/2024" },
              { action: "Funcionário adicionado", target: "Pedro Almeida", date: "10/03/2024" },
              { action: "Atestado médico aprovado", target: "Carlos Oliveira", date: "05/03/2024" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.target}</p>
                </div>
                <div className="text-sm text-muted-foreground">{activity.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver Histórico Completo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

