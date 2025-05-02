"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface MedicalLeave {
  id: string
  startDate: string
  endDate: string
  reason: string
  days: number
  status: string
  observations?: string
}

interface MedicalLeavesDialogProps {
  employeeId: string
  isOpen: boolean
  onClose: () => void
}

export function MedicalLeavesDialog({
  employeeId,
  isOpen,
  onClose,
}: MedicalLeavesDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [leaves, setLeaves] = useState<MedicalLeave[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchLeaves()
    }
  }, [isOpen, employeeId])

  const fetchLeaves = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/medical-leaves`)
      if (!response.ok) throw new Error("Erro ao buscar afastamentos")
      const data = await response.json()
      setLeaves(data)
    } catch (error) {
      console.error("Erro ao buscar afastamentos:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar o histórico de afastamentos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (leaveId: string) => {
    router.push(`/medical-leaves/${leaveId}`)
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

  const getLeaveStatus = (leave: MedicalLeave) => {
    const today = new Date()
    const endDate = new Date(leave.endDate)
    
    if (endDate < today) {
      return "FINALIZADO"
    }
    return "AFASTADO"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Histórico de Afastamentos Médicos</DialogTitle>
          <DialogDescription>
            Visualize o histórico de afastamentos médicos do funcionário.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p>Carregando histórico...</p>
        ) : leaves.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data Inicial</TableHead>
                <TableHead>Data Final</TableHead>
                <TableHead>Dias Perdidos</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    {new Date(leave.startDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {leave.endDate ? new Date(leave.endDate).toLocaleDateString('pt-BR') : "-"}
                  </TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(getLeaveStatus(leave))}>
                      {getLeaveStatus(leave)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(leave.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhum afastamento médico registrado.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
} 