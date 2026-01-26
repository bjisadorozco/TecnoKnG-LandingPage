import { NextRequest, NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/firebase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // ⚠️ Firebase Admin SOLO aquí
    const adminAuth = getAdminAuth()

    const listUsersResult = await adminAuth.listUsers(1000)

    let targetUser = null

    for (const user of listUsersResult.users) {
      const claims = user.customClaims || {}
      if (claims.admin && claims.username === username) {
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

    return NextResponse.json({
      success: true,
      email: targetUser.email,
      uid: targetUser.uid,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Error en autenticación" },
      { status: 500 }
    )
  }
}
