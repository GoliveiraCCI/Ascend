"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      router.push("/dashboard")
    }
  }, [router])

  return null
}