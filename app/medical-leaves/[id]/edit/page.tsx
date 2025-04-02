"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { MedicalLeaveForm } from "@/components/medical-leave/MedicalLeaveForm"

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
  file?: {
    id: string
    url: string
    type: string
    name: string
  } | null
}

export default function EditMedicalLeavePage() {
  const params = useParams()
  const router = useRouter()
  const [medicalLeave, setMedicalLeave] = useState<MedicalLeaveDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMedicalLeave()
  }, [params.id])

  const fetchMedicalLeave = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/medical-leaves/${params.id}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao buscar atestado médico")
      }

      const data = await response.json()
      setMedicalLeave(data)
    } catch (error) {
      console.error("Erro ao buscar atestado:", error)
      setError(error instanceof Error ? error.message : "Erro ao carregar atestado médico")
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar atestado médico",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/medical-leaves/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !medicalLeave) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Erro</h1>
        <p className="text-gray-600">{error || "Atestado médico não encontrado"}</p>
        <Button onClick={handleBack} className="mt-4">
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Editar Atestado Médico - {medicalLeave.employee.name}
        </h1>
        
        <MedicalLeaveForm 
          initialData={medicalLeave}
          onSuccess={() => {
            toast({
              title: "Sucesso",
              description: "Atestado médico atualizado com sucesso",
            })
            router.push(`/medical-leaves/${params.id}`)
          }}
          onError={(error) => {
            toast({
              title: "Erro",
              description: error instanceof Error ? error.message : "Erro ao atualizar atestado médico",
              variant: "destructive",
            })
          }}
        />
      </div>
    </div>
  )
} 