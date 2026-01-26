import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
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
    const adminDb = getAdminDb() 

    const snapshot = await adminDb
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get()

    const messages = snapshot.docs.map(mapDoc)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("GET /api/messages error:", error)
    return NextResponse.json(
      { error: "Error al obtener mensajes" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb() 

    const { name, email, phone, service, message } = await req.json()

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: "Campos obligatorios inválidos" },
        { status: 400 }
      )
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
    return NextResponse.json(mapDoc(created))
  } catch (error) {
    console.error("POST /api/messages error", error)
    return NextResponse.json(
      { error: "Error al crear mensaje" },
      { status: 500 }
    )
  }
}
