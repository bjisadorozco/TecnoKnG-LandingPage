import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/auth/login-username - Starting...")
    console.log("Environment check:", {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ? "set" : "missing",
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "set" : "missing",
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "set" : "missing",
    })
    
    const { username, password } = await req.json()
    console.log("Login attempt for username:", username)

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
    
    console.log("Fetching users from Firebase...")
    // Listar todos los usuarios (esto es limitado pero funciona para pocos admins)
    const listUsersResult = await adminAuth.listUsers(1000) // Máximo 1000 usuarios
    console.log("Users fetched:", listUsersResult.users.length)
    
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
      console.log("User not found with username:", username)
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      )
    }

    console.log("User found:", targetUser.email)
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
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: "Error en autenticación",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
