"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Trophy } from "lucide-react"
import Cookies from 'js-cookie'
import Head from "next/head"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  // Verifica se já está autenticado ao carregar a página
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("") // Limpa mensagem de erro anterior
    
    try {
      // Chamada à API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer login')
      }

      const userData = await response.json()
      
      // Salva os dados do usuário
      const userDataToStore = {
        id: userData.id,
        name: userData.name,
        role: userData.role,
        isAuthenticated: true
      }
      
      // Salva no cookie com expiração de 8 horas
      Cookies.set('userData', JSON.stringify(userDataToStore), { expires: 1/3 }) // 8 horas
      Cookies.set('isAuthenticated', 'true', { expires: 1/3 }) // 8 horas
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      })
      
      router.push("/dashboard")
    } catch (error) {
      // Limpa qualquer autenticação existente em caso de credenciais inválidas
      localStorage.removeItem("userData")
      localStorage.removeItem("isAuthenticated")
      Cookies.remove('userData')
      Cookies.remove('isAuthenticated')
      
      setErrorMessage(error instanceof Error ? error.message : "Usuário ou senha inválidos")
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Usuário ou senha inválidos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              ASCEND
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Faça login para acessar o sistema
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Usuário</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            {errorMessage && (
              <p className="text-sm text-red-500 text-center mt-2">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  )
} 