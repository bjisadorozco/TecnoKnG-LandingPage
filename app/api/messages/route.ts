import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import type { ContactMessage } from "@/lib/store-context"

function mapDoc(doc: any): ContactMessage {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    service: data.service ?? "",
    message: data.message ?? "",
    status: data.status ?? "pending",
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  }
}

export async function GET() {
  try {
    console.log("GET /api/messages - Starting...")
    console.log("Environment check:", {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ? "set" : "missing",
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "set" : "missing",
      privateKeyBase64: process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 ? "set" : "missing",
    })
    
    const snapshot = await adminDb.collection("messages").orderBy("createdAt", "desc").get()
    console.log("Messages fetched from Firestore:", snapshot.docs.length)
    
    const messages = snapshot.docs.map(mapDoc)
    console.log("Messages mapped:", messages.length)
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error("GET /api/messages error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ 
      error: "Error al obtener mensajes",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const { name, email, phone, service, message } = payload

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json({ error: "Campos obligatorios inválidos" }, { status: 400 })
    }

    const docRef = await adminDb.collection("messages").add({
      name,
      email,
      phone,
      service,
      message,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const created = await docRef.get()
    if (!created.exists) {
      return NextResponse.json({ error: "No se pudo obtener el mensaje creado" }, { status: 500 })
    }

    return NextResponse.json(mapDoc(created))
  } catch (error) {
    console.error("POST /api/messages error", error)
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 })
  }
}
