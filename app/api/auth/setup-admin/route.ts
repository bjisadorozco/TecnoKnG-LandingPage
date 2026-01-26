import { NextRequest, NextResponse } from "next/server"

// Esta API route es para configuración inicial y no usa Firebase Admin directamente
export async function POST() {
  try {
    // Instrucciones para el usuario
    const instructions = {
      message: "Para crear el usuario administrador, ejecuta el script directamente:",
      script: "node scripts/create-admin.js",
      credentials: {
        username: "tecnokng",
        email: "brayanorozco920@gmail.com",
        password: "tecnokng"
      },
      steps: [
        "1. Asegúrate de tener serviceAccountKey.json en la raíz",
        "2. Ejecuta: node scripts/create-admin.js",
        "3. Usa las credenciales para login en /admin/login"
      ]
    }

    return NextResponse.json({
      success: true,
      ...instructions
    })

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Error en configuración',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
