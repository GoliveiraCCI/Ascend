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

  return response
}

export const config = {
  matcher: [
    "/api/:path*",
    "/employees/:path*",
    "/departments/:path*",
    "/positions/:path*",
    "/position-levels/:path*",
    "/shifts/:path*"
  ]
} 