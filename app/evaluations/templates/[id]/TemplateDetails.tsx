"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Template } from "@/types/evaluation"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Question {
  id: string
  text: string
  category: {
    id: string
    name: string
  }
}

export function TemplateDetails({ template }: { template: Template }) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)

  useEffect(() => {
    console.log('Template recebido:', template)
  }, [template])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/evaluations/templates/${template.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir modelo')
      }

      toast({
        title: "Modelo excluído",
        description: "O modelo foi excluído com sucesso.",
      })
      router.push('/evaluations')
    } catch (error) {
      console.error('Erro ao excluir modelo:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o modelo.",
        variant: "destructive",
      })
    }
  }

  // Agrupar avaliações por departamento
  const evaluationsByDepartment = template.evaluations.reduce((acc: any, evaluation: any) => {
    const department = evaluation.employee.department.name
    if (!acc[department]) {
      acc[department] = {
        count: 0,
        evaluations: []
      }
    }
    acc[department].count++
    acc[department].evaluations.push(evaluation)
    return acc
  }, {})

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{template.name}</h1>
        </div>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Modelo
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Descrição:</span> {template.description || "Sem descrição"}</p>
            <p><span className="font-medium">Total de avaliações:</span> {template._count.evaluations}</p>
            <p><span className="font-medium">Última atualização:</span> {new Date(template.updatedAt).toLocaleDateString()}</p>
          </div>
        </Card>

        {template.questions && template.questions.length > 0 ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Questões</h2>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {template.questions.map((question) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{question.text}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Categoria: {question.category.name}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        ) : (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Questões</h2>
            <p className="text-muted-foreground">Nenhuma questão encontrada para este modelo.</p>
          </Card>
        )}

        {template.evaluations && template.evaluations.length > 0 ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Avaliações por Departamento</h2>
            <div className="grid gap-4">
              {Object.entries(evaluationsByDepartment).map(([department, data]: [string, any]) => (
                <div key={department} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{department}</h3>
                    <p className="text-sm text-muted-foreground">{data.count} avaliações</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedDepartment({ name: department, ...data })
                      setShowDepartmentDialog(true)
                    }}
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Avaliações por Departamento</h2>
            <p className="text-muted-foreground">Nenhuma avaliação encontrada para este modelo.</p>
          </Card>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Modelo</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Avaliações do Departamento: {selectedDepartment?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Nota Pessoal</TableHead>
                  <TableHead>Nota Gestão</TableHead>
                  <TableHead>Nota Média</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDepartment?.evaluations.map((evaluation: any) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.employee.name}</TableCell>
                    <TableCell>
                      {evaluation.selfScore ? (
                        <Badge variant="outline">{evaluation.selfScore.toFixed(1)}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {evaluation.managerScore ? (
                        <Badge variant="outline">{evaluation.managerScore.toFixed(1)}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {evaluation.finalScore ? (
                        <Badge>{evaluation.finalScore.toFixed(1)}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
} 