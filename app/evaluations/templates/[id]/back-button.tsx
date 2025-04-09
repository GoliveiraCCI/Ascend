'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => router.push('/evaluations')}
      className="h-8 w-8"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
} 