import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(req: NextRequest) {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "No se proporcionó token de autenticación" },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]

    // Verificar el token
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    // Verificar si el usuario es administrador
    if (!decodedToken.admin) {
      return NextResponse.json(
        { error: "No tiene permisos de administrador" },
        { status: 403 }
      )
    }

    // Obtener información del usuario
    const user = await adminAuth.getUser(decodedToken.uid)

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        isAdmin: true
      }
    })

  } catch (error) {
    console.error("Error verificando sesión:", error)
    
    if (error instanceof Error && error.message.includes('auth/id-token-expired')) {
      return NextResponse.json(
        { error: "Token expirado" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Error de autenticación" },
      { status: 401 }
    )
  }
}
