import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Adicionar headers CORS
  const response = NextResponse.next()

  // Permitir requisições de qualquer origem em desenvolvimento
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Se a rota for a raiz ("/"), sempre redireciona para "/login"
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se não estiver autenticado e tentar acessar rotas protegidas, redireciona para login
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/positions/:path*",
    "/position-levels/:path*",
    "/shifts/:path*",
    "/"
  ]
} 