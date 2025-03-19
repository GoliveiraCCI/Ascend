"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Verificação inicial
    checkIsMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkIsMobile)

    // Limpar listener ao desmontar
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}

