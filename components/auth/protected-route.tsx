"use client"

import { useAuth } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }

      if (requireAdmin && !isAdmin) {
        router.push('/inicio') // Redirigir a inicio si no es admin
        return
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router])

  // Mostrar loading mientras se verifica
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // No mostrar contenido si no está autenticado o no tiene permisos
  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}