"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  User,
  Users,
  Clock,
  CheckCircle2,
  Building,
  Award,
  ImageIcon,
  type File,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados de exemplo para o treinamento
const trainingData = {
  id: "TR001",
  name: "JavaScript Avançado",
  category: "Técnico",
  type: "Equipe", // Individual ou Equipe
  source: "Interno", // Interno ou Externo
  instructor: "Carlos Mendes",
  institution: null, // Apenas para treinamentos externos
  startDate: "2024-03-15",
  endDate: "2024-03-17",
  hours: 24,
  status: "Concluído",
  department: "TI",
  description:
    "Treinamento avançado em JavaScript, abordando tópicos como ES6+, Promises, async/await, e padrões de design modernos.",
  participants: [
    {
      id: "EMP001",
      name: "João Silva",
      department: "TI",
      position: "Desenvolvedor Senior",
      status: "Concluído",
      score: 9.2,
    },
    {
      id: "EMP003",
      name: "Pedro Santos",
      department: "TI",
      position: "Desenvolvedor Pleno",
      status: "Concluído",
      score: 8.7,
    },
    {
      id: "EMP006",
      name: "Fernanda Lima",
      department: "TI",
      position: "Analista de Sistemas",
      status: "Concluído",
      score: 9.5,
    },
    {
      id: "EMP008",
      name: "Ricardo Oliveira",
      department: "TI",
      position: "Desenvolvedor Junior",
      status: "Concluído",
      score: 8.3,
    },
  ],
  materials: [
    { id: "MAT001", name: "Apostila JavaScript Avançado.pdf", type: "PDF", size: "2.4 MB" },
    { id: "MAT002", name: "Exemplos de Código", type: "ZIP", size: "1.8 MB" },
    { id: "MAT003", name: "Apresentação do Curso.pptx", type: "PPTX", size: "5.1 MB" },
  ],
  sessions: [
    { date: "2024-03-15", startTime: "09:00", endTime: "17:00", topic: "Fundamentos Avançados e ES6+" },
    { date: "2024-03-16", startTime: "09:00", endTime: "17:00", topic: "Programação Assíncrona e Promises" },
    { date: "2024-03-17", startTime: "09:00", endTime: "17:00", topic: "Padrões de Design e Boas Práticas" },
  ],
  evaluations: [
    { id: "EVAL001", type: "Teste Prático", date: "2024-03-17", averageScore: 8.9 },
    { id: "EVAL002", type: "Avaliação de Satisfação", date: "2024-03-17", averageScore: 9.3 },
  ],
  photos: [
    { id: "PHOTO001", url: "/placeholder.svg?height=400&width=600", caption: "Apresentação inicial" },
    { id: "PHOTO002", url: "/placeholder.svg?height=400&width=600", caption: "Atividade em grupo" },
    { id: "PHOTO003", url: "/placeholder.svg?height=400&width=600", caption: "Demonstração prática" },
    { id: "PHOTO004", url: "/placeholder.svg?height=400&width=600", caption: "Participantes" },
    { id: "PHOTO005", url: "/placeholder.svg?height=400&width=600", caption: "Entrega de certificados" },
  ],
}

export default function TrainingDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddPhotoDialogOpen, setIsAddPhotoDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoCaption, setPhotoCaption] = useState("")
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])

  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const downloadMaterial = (materialId: string, materialName: string) => {
    // Em uma implementação real, isso faria o download do material
    toast({
      title: "Download iniciado",
      description: `Baixando ${materialName}...`,
    })
  }

  const downloadCertificate = (participantId: string) => {
    // Em uma implementação real, isso geraria e baixaria o certificado
    toast({
      title: "Gerando certificado",
      description: "O certificado está sendo gerado e será baixado em instantes.",
    })
  }

  const exportTrainingReport = () => {
    // Em uma implementação real, isso exportaria o relatório do treinamento
    toast({
      title: "Exportando relatório",
      description: "O relatório do treinamento está sendo gerado em PDF.",
    })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setNewPhotos([...newPhotos, ...filesArray])

      // Criar URLs para preview
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls])
    }
  }

  const removePhoto = (index: number) => {
    // Remover a foto e sua URL de preview
    const updatedPhotos = [...newPhotos]
    updatedPhotos.splice(index, 1)
    setNewPhotos(updatedPhotos)

    const updatedUrls = [...photoPreviewUrls]
    // Revogar a URL para liberar memória
    URL.revokeObjectURL(updatedUrls[index])
    updatedUrls.splice(index, 1)
    setPhotoPreviewUrls(updatedUrls)
  }

  const savePhotos = () => {
    toast({
      title: "Fotos adicionadas",
      description: `${newPhotos.length} foto(s) adicionada(s) com sucesso.`,
    })

    // Limpar formulário
    setNewPhotos([])

    // Revogar todas as URLs de preview para liberar memória
    photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    setPhotoPreviewUrls([])

    setIsAddPhotoDialogOpen(false)
  }

  const saveTrainingChanges = () => {
    toast({
      title: "Treinamento atualizado",
      description: "As alterações no treinamento foram salvas com sucesso.",
    })
    setIsEditDialogOpen(false)
  }

  const openPhotoModal = (photoUrl: string) => {
    setSelectedPhoto(photoUrl)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  return (
    <div className="animate-in flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <h1 className="font-heading text-3xl">{trainingData.name}</h1>
          <Badge variant="outline" className="ml-2">
            {trainingData.id}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Treinamento
          </Button>
          <Button variant="outline" onClick={exportTrainingReport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Treinamento</CardTitle>
            <CardDescription>Detalhes gerais sobre o treinamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Categoria:</span>
                <Badge variant="secondary">{trainingData.category}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tipo:</span>
                <span className="text-sm">{trainingData.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Origem:</span>
                <span className="text-sm">{trainingData.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Instrutor:</span>
                <span className="text-sm">{trainingData.instructor}</span>
              </div>
              {trainingData.institution && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Instituição:</span>
                  <span className="text-sm">{trainingData.institution}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Período:</span>
                <span className="text-sm">
                  {new Date(trainingData.startDate).toLocaleDateString()} a{" "}
                  {new Date(trainingData.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Carga Horária:</span>
                <span className="text-sm">{trainingData.hours} horas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  className={
                    trainingData.status === "Concluído"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                  }
                >
                  {trainingData.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Departamento:</span>
                <span className="text-sm">{trainingData.department}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Detalhes do Treinamento</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="participants">Participantes</TabsTrigger>
                <TabsTrigger value="materials">Materiais</TabsTrigger>
                <TabsTrigger value="sessions">Sessões</TabsTrigger>
                <TabsTrigger value="photos">Fotos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Descrição</h3>
                  <p className="text-sm text-muted-foreground">{trainingData.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Resumo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total de Participantes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{trainingData.participants.length}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Nota Média</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {(
                            trainingData.participants.reduce((sum, p) => sum + p.score, 0) /
                            trainingData.participants.length
                          ).toFixed(1)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Avaliações</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Nota Média</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trainingData.evaluations.map((evaluation) => (
                        <TableRow key={evaluation.id}>
                          <TableCell className="font-medium">{evaluation.type}</TableCell>
                          <TableCell>{new Date(evaluation.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              className={
                                evaluation.averageScore >= 9
                                  ? "bg-green-100 text-green-800"
                                  : evaluation.averageScore >= 8
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {evaluation.averageScore.toFixed(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="participants">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Nota</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingData.participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell>{participant.department}</TableCell>
                        <TableCell>{participant.position}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              participant.status === "Concluído"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {participant.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                              participant.score >= 9
                                ? "bg-green-100 text-green-800"
                                : participant.score >= 8
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {participant.score.toFixed(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadCertificate(participant.id)}
                            disabled={participant.status !== "Concluído"}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Certificado
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="materials">
                <div className="space-y-4">
                  {trainingData.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {material.type} • {material.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => downloadMaterial(material.id, material.name)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Tópico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingData.sessions.map((session, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {session.startTime} - {session.endTime}
                        </TableCell>
                        <TableCell className="font-medium">{session.topic}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="photos" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Galeria de Fotos</h3>
                  <Button onClick={() => setIsAddPhotoDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Fotos
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingData.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative group cursor-pointer border rounded-md overflow-hidden"
                      onClick={() => openPhotoModal(photo.url)}
                    >
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                        <p className="text-sm">{photo.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {trainingData.photos.length === 0 && (
                  <div className="text-center p-8 border rounded-md">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Nenhuma foto disponível para este treinamento</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsAddPhotoDialogOpen(true)}>
                      Adicionar Fotos
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modal para visualização de foto */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={closePhotoModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Visualização de Foto</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedPhoto || "/placeholder.svg"}
                alt="Foto do treinamento"
                className="max-h-[70vh] object-contain"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closePhotoModal}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para adicionar fotos */}
      <Dialog open={isAddPhotoDialogOpen} onOpenChange={setIsAddPhotoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Fotos</DialogTitle>
            <DialogDescription>Adicione fotos ao registro do treinamento</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="photo-upload">Selecionar Fotos</Label>
              <div className="flex items-center gap-2">
                <Input id="photo-upload" type="file" multiple accept="image/*" onChange={handlePhotoUpload} />
                <Button type="button" variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Procurar
                </Button>
              </div>
            </div>

            {photoPreviewUrls.length > 0 && (
              <div className="border rounded-md p-3">
                <p className="text-sm font-medium mb-2">Fotos selecionadas:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {photoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Foto ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-black/40 rounded-md"></div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removePhoto(index)}
                          className="relative z-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="photo-caption">Legenda (opcional)</Label>
              <Textarea
                id="photo-caption"
                placeholder="Adicione uma legenda para as fotos"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPhotoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={savePhotos} disabled={newPhotos.length === 0}>
              Salvar Fotos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar treinamento */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Treinamento</DialogTitle>
            <DialogDescription>Atualize as informações do treinamento</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nome
              </Label>
              <Input id="edit-name" defaultValue={trainingData.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Categoria
              </Label>
              <Select defaultValue={trainingData.category.toLowerCase()}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={trainingData.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="técnico">Técnico</SelectItem>
                  <SelectItem value="habilidades sociais">Habilidades Sociais</SelectItem>
                  <SelectItem value="liderança">Liderança</SelectItem>
                  <SelectItem value="conformidade">Conformidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-instructor" className="text-right">
                Instrutor
              </Label>
              <Input id="edit-instructor" defaultValue={trainingData.instructor} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-start-date" className="text-right">
                Data de Início
              </Label>
              <Input id="edit-start-date" type="date" defaultValue={trainingData.startDate} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-end-date" className="text-right">
                Data de Término
              </Label>
              <Input id="edit-end-date" type="date" defaultValue={trainingData.endDate} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-hours" className="text-right">
                Horas
              </Label>
              <Input id="edit-hours" type="number" defaultValue={trainingData.hours} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select defaultValue={trainingData.status.toLowerCase()}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={trainingData.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="em andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descrição
              </Label>
              <Textarea id="edit-description" defaultValue={trainingData.description} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={saveTrainingChanges}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

