"use client"

import { useState } from "react"
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
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulando uma chamada de API
      // Em produção, isso seria substituído por uma chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simula delay da API
      
      // Simulando validação de credenciais
      if (name === "admin" && password === "123456") {
        // Salva os dados do usuário
        const userData = {
          id: 1,
          name: "Administrador",
          role: "admin",
          isAuthenticated: true
        }
        
        // Salva no localStorage
        localStorage.setItem("userData", JSON.stringify(userData))
        
        // Salva o cookie de autenticação
        Cookies.set('isAuthenticated', 'true', { expires: 7 }) // Expira em 7 dias
        
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!",
        })
        
        // Redireciona para o dashboard
        window.location.href = "/dashboard"
      } else {
        throw new Error("Credenciais inválidas")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Usuário ou senha inválidos",
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
          </form>
        </div>
      </div>
    </>
  )
} 