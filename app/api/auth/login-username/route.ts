import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Para autenticar con username, necesitamos:
    // 1. Obtener todos los usuarios con claims de admin
    // 2. Buscar el que tenga el username matching
    // 3. Autenticar con su email usando Firebase Auth
    
    // Listar todos los usuarios (esto es limitado pero funciona para pocos admins)
    const listUsersResult = await adminAuth.listUsers(1000) // Máximo 1000 usuarios
    
    // Buscar usuario admin con el username especificado
    let targetUser = null
    for (const user of listUsersResult.users) {
      const customClaims = user.customClaims || {}
      if (customClaims.admin && customClaims.username === username) {
        targetUser = user
        break
      }
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      )
    }

    // Generar un token personalizado para el usuario
    // Nota: Firebase no permite verificar contraseñas directamente del lado del servidor
    // Necesitamos usar el SDK de cliente para la verificación real
    
    return NextResponse.json({
      success: true,
      message: "Usuario encontrado. Use el cliente para autenticar.",
      email: targetUser.email,
      uid: targetUser.uid
    })

  } catch (error: any) {
    console.error("Error en login con username:", error)
    return NextResponse.json(
      { error: "Error en autenticación" },
      { status: 500 }
    )
  }
}
