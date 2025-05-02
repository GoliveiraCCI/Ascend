import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getLoggedUserId(): Promise<string> {
  if (typeof window !== 'undefined') {
    // No cliente, tenta obter o ID do usuário do localStorage
    const userData = localStorage.getItem('userData')
    if (!userData) return ''

    try {
      const { id } = JSON.parse(userData)
      return id?.toString() || ''
    } catch (error) {
      console.error('Erro ao obter ID do usuário:', error)
      return ''
    }
  }

  try {
    // No servidor, tenta obter o ID do usuário do cookie
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const userData = await cookieStore.get('userData')?.value
    if (!userData) return ''

    const { id } = JSON.parse(userData)
    return id?.toString() || ''
  } catch (error) {
    console.error('Erro ao obter ID do usuário:', error)
    return ''
  }
}
