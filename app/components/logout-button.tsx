"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Limpa os dados de autenticação
    localStorage.removeItem("userData")
    localStorage.removeItem("isAuthenticated")
    Cookies.remove('isAuthenticated')
    
    // Redireciona para a página de login
    router.push("/login")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  )
} 