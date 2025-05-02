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
import { ArrowLeft } from "lucide-react"

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
  medicalleavecategory?: {
    id: string
    name: string
    description: string
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
    switch (status.toLowerCase()) {
      case "afastado":
        return "bg-red-500 hover:bg-red-600"
      case "finalizado":
        return "bg-black hover:bg-black text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getLeaveStatus = (leave: MedicalLeaveDetails) => {
    const today = new Date()
    const endDate = new Date(leave.endDate)
    
    if (endDate < today) {
      return "FINALIZADO"
    }
    return "AFASTADO"
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhes do Afastamento</h1>
      </div>

      <div className="grid gap-6">
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
            <CardTitle>Informações do afastamento</CardTitle>
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
              {medicalLeave.medicalleavecategory && (
                <>
                  <p>
                    <span className="font-semibold">Categoria:</span>{" "}
                    {medicalLeave.medicalleavecategory.name}
                  </p>
                  <p>
                    <span className="font-semibold">Descrição da Categoria:</span>{" "}
                    {medicalLeave.medicalleavecategory.description}
                  </p>
                </>
              )}
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
                <Badge className={getStatusColor(getLeaveStatus(medicalLeave))}>
                  {getLeaveStatus(medicalLeave)}
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

