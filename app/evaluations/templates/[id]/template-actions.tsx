'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'

interface TemplateActionsProps {
  templateId: string
}

export function TemplateActions({ templateId }: TemplateActionsProps) {
  const router = useRouter()

  const handleDeleteTemplate = async () => {
    try {
      const response = await fetch(`/api/evaluations/templates/${templateId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir modelo de avaliação')
      }

      toast({
        title: 'Modelo excluído',
        description: 'O modelo de avaliação foi excluído com sucesso.'
      })

      router.push('/evaluations')
    } catch (error) {
      console.error('Erro ao excluir modelo de avaliação:', error)
      toast({
        title: 'Erro ao excluir',
        description: error instanceof Error ? error.message : 'Erro ao excluir modelo de avaliação',
        variant: 'destructive'
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir modelo de avaliação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este modelo de avaliação? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTemplate}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 