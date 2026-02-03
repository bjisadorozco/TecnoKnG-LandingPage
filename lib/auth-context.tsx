"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth'
import { auth } from '@/lib/firebase-client'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithUsername: (username: string, password: string) => Promise<{ success: boolean; hasAdminClaim: boolean; usernameClaim: string | null } | undefined>
  logout: () => Promise<void>
  isAdmin: boolean
  username: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', { user: !!user, email: user?.email })
      setUser(user)
      
      if (user) {
        try {
          // Obtener el token y guardarlo en cookie
          const idToken = await user.getIdToken()
          console.log('Guardando token en cookie...')
          document.cookie = `auth_token=${idToken}; path=/; max-age=3600; SameSite=Strict;`
          console.log('Token guardado en cookie:', !!document.cookie.includes('auth_token'))
          
          // Verificar si el usuario tiene claims de administrador
          const idTokenResult = await user.getIdTokenResult(true)
          console.log('Token claims:', idTokenResult.claims)
          
          const hasAdminClaim = !!idTokenResult.claims.admin
          const usernameClaim = (idTokenResult.claims.username as string) || null
          
          console.log('Admin status:', hasAdminClaim, 'Username:', usernameClaim)
          
          setIsAdmin(hasAdminClaim)
          setUsername(usernameClaim)
        } catch (error) {
          console.error('Error getting token claims:', error)
          setIsAdmin(false)
          setUsername(null)
        }
      } else {
        // Eliminar la cookie cuando el usuario cierra sesión
        console.log('Eliminando token de cookie...')
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        setIsAdmin(false)
        setUsername(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Usuario autenticado:', userCredential.user.email)
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const loginWithUsername = async (username: string, password: string) => {
    try {
      console.log('Attempting login with username:', username)
      
      // Primero obtener el email asociado al username
      const response = await fetch('/api/auth/login-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log('Login API response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación')
      }

      if (!data.success) {
        throw new Error(data.error || 'Usuario no encontrado')
      }

      // Ahora autenticar con el email usando Firebase Auth
      await login(data.email, password)
      console.log('Usuario autenticado con username:', username)
      
      // Esperar un momento para que onAuthStateChanged se dispare
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Verificar el estado actual después del login
      const currentUser = auth.currentUser
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult(true)
        console.log('Token refreshed after login:', idTokenResult.claims)
        
        const hasAdminClaim = !!idTokenResult.claims.admin
        const usernameClaim = (idTokenResult.claims.username as string) || null
        
        console.log('Admin status:', hasAdminClaim, 'Username:', usernameClaim)
        
        return { success: true, hasAdminClaim, usernameClaim }
      }
      
    } catch (error) {
      console.error('Error en login con username:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      console.log('Sesión cerrada')
    } catch (error) {
      console.error('Error en logout:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    loginWithUsername,
    logout,
    isAdmin,
    username
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
