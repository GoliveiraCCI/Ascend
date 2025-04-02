"use client"

import { useState } from "react"
import { Calendar, Mail, Phone, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Dados de exemplo do usuário
const user = {
  id: "USR001",
  name: "Admin Sistema",
  email: "admin@exemplo.com",
  phone: "+55 (11) 98765-4321",
  role: "Administrador",
  department: "TI",
  joinDate: "2022-01-15",
  bio: "Administrador do sistema ASCEND, responsável pela gestão de desempenho dos funcionários.",
  skills: ["Gestão de Sistemas", "Análise de Dados", "Liderança", "Desenvolvimento"],
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
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")

  const handleSaveChanges = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas alterações foram salvas com sucesso.",
    })
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl">Meu Perfil</h1>
        <p className="text-muted-foreground">Visualize e edite suas informações pessoais</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary">
                <User className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Alterar Foto
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Telefone:</span>
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Departamento:</span>
                <span className="text-sm">{user.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Data de Admissão:</span>
                <span className="text-sm">{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais e profissionais</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="personal">Pessoal</TabsTrigger>
                <TabsTrigger value="professional">Profissional</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="animate-fade">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" defaultValue={user.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birth-date">Data de Nascimento</Label>
                      <Input id="birth-date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <div className="rounded-md border p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="street">Rua/Avenida</Label>
                          <Input id="street" defaultValue={user.address.street} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input id="city" defaultValue={user.address.city} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">Estado</Label>
                          <Input id="state" defaultValue={user.address.state} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip-code">CEP</Label>
                          <Input id="zip-code" defaultValue={user.address.zipCode} />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input id="country" defaultValue={user.address.country} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contato de Emergência</Label>
                    <div className="rounded-md border p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="emergency-name">Nome</Label>
                          <Input id="emergency-name" defaultValue={user.emergencyContact.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergency-relationship">Relação</Label>
                          <Input id="emergency-relationship" defaultValue={user.emergencyContact.relationship} />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="emergency-phone">Telefone</Label>
                        <Input id="emergency-phone" defaultValue={user.emergencyContact.phone} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="professional" className="animate-fade">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Select defaultValue={user.department.toLowerCase()}>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ti">TI</SelectItem>
                          <SelectItem value="rh">RH</SelectItem>
                          <SelectItem value="financeiro">Financeiro</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operações">Operações</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Input id="role" defaultValue={user.role} readOnly />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="join-date">Data de Admissão</Label>
                      <Input id="join-date" type="date" defaultValue={user.joinDate} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-id">ID do Funcionário</Label>
                      <Input id="employee-id" defaultValue={user.id} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea id="bio" defaultValue={user.bio} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Habilidades</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                        >
                          {skill}
                          <button className="ml-2 text-primary hover:text-primary/80">×</button>
                        </div>
                      ))}
                      <button className="rounded-full border border-dashed border-muted-foreground/50 px-3 py-1 text-sm text-muted-foreground hover:border-muted-foreground/80 hover:text-muted-foreground/80">
                        + Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="security" className="animate-fade">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm">
                      A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas, números e
                      caracteres especiais.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Autenticação de Dois Fatores</Label>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Autenticação de Dois Fatores</p>
                          <p className="text-sm text-muted-foreground">
                            Adicione uma camada extra de segurança à sua conta
                          </p>
                        </div>
                        <Button variant="outline">Configurar</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

