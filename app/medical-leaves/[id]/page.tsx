"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { MedicalLeaveFiles } from "@/components/forms/MedicalLeaveFiles"
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

interface MedicalLeaveDetails {
  id: string
  employee: {
    id: string
    name: string
    matricula: string
    department: {
      id: string
      name: string
    }
    position: {
      id: string
      title: string
    }
    shift?: {
      id: string
      name: string
      description: string
    }
  }
  startDate: string
  endDate: string
  days: number
  reason: string
  doctor: string | null
  hospital: string | null
  status: "FINALIZADO" | "AFASTADO"
  notes: string | null
  category?: {
    id: string
    name: string
  }
  files: {
    id: string
    url: string
    type: string
    name: string
  }[]
}

export default function MedicalLeaveDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [medicalLeave, setMedicalLeave] = useState<MedicalLeaveDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedicalLeave = async () => {
      try {
        const response = await fetch(`/api/medical-leaves/${params.id}`)
        if (!response.ok) {
          throw new Error("Erro ao carregar detalhes do atestado")
        }
        const data = await response.json()
        setMedicalLeave(data)
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error)
        setError("Erro ao carregar detalhes do atestado")
        toast({
          title: "Erro",
          description: "Erro ao carregar detalhes do atestado",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalLeave()
  }, [params.id, toast])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/medical-leaves/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao excluir atestado")
      }

      toast({
        title: "Sucesso",
        description: "Atestado médico excluído com sucesso",
      })

      router.push("/medical-leaves")
    } catch (error) {
      console.error("Erro ao excluir atestado:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir atestado",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (error || !medicalLeave) {
    return <div>Erro ao carregar detalhes do atestado</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FINALIZADO":
        return "bg-green-500 hover:bg-green-600"
      case "AFASTADO":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalhes do Afastamento Médico</h1>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Excluir Atestado
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Atestado Médico</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este atestado médico? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Funcionário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Nome:</span>{" "}
                {medicalLeave.employee.name}
              </p>
              <p>
                <span className="font-semibold">Matrícula:</span>{" "}
                {medicalLeave.employee.matricula}
              </p>
              <p>
                <span className="font-semibold">Departamento:</span>{" "}
                {medicalLeave.employee.department.name}
              </p>
              <p>
                <span className="font-semibold">Cargo:</span>{" "}
                {medicalLeave.employee.position.title}
              </p>
              {medicalLeave.employee.shift && (
                <p>
                  <span className="font-semibold">Turno:</span>{" "}
                  {medicalLeave.employee.shift.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Atestado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Data Inicial:</span>{" "}
                {new Date(medicalLeave.startDate).toLocaleDateString("pt-BR")}
              </p>
              <p>
                <span className="font-semibold">Data Final:</span>{" "}
                {new Date(medicalLeave.endDate).toLocaleDateString("pt-BR")}
              </p>
              <p>
                <span className="font-semibold">Dias:</span>{" "}
                {medicalLeave.days}
              </p>
              <p>
                <span className="font-semibold">Motivo:</span>{" "}
                {medicalLeave.reason}
              </p>
              {medicalLeave.doctor && (
                <p>
                  <span className="font-semibold">Médico:</span>{" "}
                  {medicalLeave.doctor}
                </p>
              )}
              {medicalLeave.hospital && (
                <p>
                  <span className="font-semibold">Hospital:</span>{" "}
                  {medicalLeave.hospital}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <Badge className={getStatusColor(medicalLeave.status)}>
                  {medicalLeave.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {medicalLeave.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{medicalLeave.notes}</p>
          </CardContent>
        </Card>
      )}

      <MedicalLeaveFiles
        medicalLeaveId={medicalLeave.id}
        files={medicalLeave.files}
        onFilesChange={(newFiles) => {
          setMedicalLeave({ ...medicalLeave, files: newFiles })
        }}
      />
    </div>
  )
}

