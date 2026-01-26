import { NextRequest, NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/firebase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const adminAuth = getAdminAuth()

    const email = "brayanorozco920@gmail.com"
    const password = "tecnokng"
    const username = "tecnokng"

    console.log("Creando usuario administrador...")

    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: "Administrador TecnoKnG",
    })

    await adminAuth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      username,
    })

    const user = await adminAuth.getUser(userRecord.uid)

    return NextResponse.json({
      success: true,
      message: "Usuario administrador creado exitosamente",
      user: {
        uid: user.uid,
        email: user.email,
        username,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        customClaims: user.customClaims,
      },
    })
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      const adminAuth = getAdminAuth()
      const email = "brayanorozco920@gmail.com"
      const username = "admin"

      const user = await adminAuth.getUserByEmail(email)

      await adminAuth.setCustomUserClaims(user.uid, {
        admin: true,
        username,
      })

      return NextResponse.json({
        success: true,
        message: "Claims de administrador actualizados",
        user: {
          uid: user.uid,
          email: user.email,
          username,
          customClaims: { admin: true, username },
        },
      })
    }

    console.error("Error al crear admin:", error)
    return NextResponse.json(
      { error: "Error al crear usuario administrador" },
      { status: 500 }
    )
  }
}
