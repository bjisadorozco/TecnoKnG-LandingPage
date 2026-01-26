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
  loginWithUsername: (username: string, password: string) => Promise<void>
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
      setUser(user)
      
      if (user) {
        // Obtener el token y guardarlo en cookie
        const idToken = await user.getIdToken()
        document.cookie = `auth_token=${idToken}; path=/; max-age=3600; SameSite=Strict;`
        
        // Verificar si el usuario tiene claims de administrador
        const idTokenResult = await user.getIdTokenResult(true)
        setIsAdmin(!!idTokenResult.claims.admin)
        setUsername((idTokenResult.claims.username as string) || null)
      } else {
        // Eliminar la cookie cuando el usuario cierra sesión
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
      // Primero obtener el email asociado al username
      const response = await fetch('/api/auth/login-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación')
      }

      if (!data.success) {
        throw new Error(data.error || 'Usuario no encontrado')
      }

      // Ahora autenticar con el email usando Firebase Auth
      await login(data.email, password)
      console.log('Usuario autenticado con username:', username)
      
      // Esperar un momento para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
