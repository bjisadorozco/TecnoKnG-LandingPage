"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { loginWithUsername, user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()

  // Si ya está autenticado y es admin, redirigir inmediatamente
  React.useEffect(() => {
    console.log('useEffect check:', { user: !!user, isAdmin, authLoading, isRedirecting })
    if (user && isAdmin && !authLoading && !isRedirecting) {
      console.log('Usuario ya autenticado como admin, redirigiendo...')
      setIsRedirecting(true)
      // Intentar con window.location.href como fallback
      window.location.href = '/admin'
    }
  }, [user, isAdmin, authLoading]) // Removido isRedirecting de las dependencias

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevenir múltiples submits
    if (loading || isRedirecting) return
    
    setLoading(true)
    setError('')

    try {
      const result = await loginWithUsername(username, password)
      
      if (result?.hasAdminClaim) {
        console.log('Login exitoso, esperando redirección automática...')
        setIsRedirecting(true)
        // El useEffect se encargará de la redirección cuando se actualice el estado
      } else {
        setError('No tienes permisos de administrador')
      }
    } catch (error: any) {
      console.error('Error de login:', error)

      if (error.message.includes('Usuario no encontrado')) {
        setError('Usuario no encontrado')
      } else if (error.message.includes('contraseña incorrectos')) {
        setError('Contraseña incorrecta')
      } else {
        setError('Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-foreground-secondary mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError("")
                }}
                className={`w-full px-4 py-3 pl-12 rounded-xl bg-background-secondary border ${
                  error ? "border-error" : "border-border"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl bg-background-secondary border ${
                  error ? "border-error" : "border-border"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-error text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}
