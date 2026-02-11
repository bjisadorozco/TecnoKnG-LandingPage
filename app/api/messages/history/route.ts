import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import type { ContactMessage } from "@/lib/store-context"

function mapDoc(doc: any): ContactMessage & { archivedAt: Date } {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    service: data.service ?? "",
    message: data.message ?? "",
    status: data.status ?? "replied",
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    archivedAt: data.archivedAt?.toDate?.() ?? new Date(),
  }
}

export async function GET() {
  try {
    const adminDb = getAdminDb()

    const snapshot = await adminDb
      .collection("messages_history")
      .orderBy("archivedAt", "desc")
      .get()

    const messages = snapshot.docs.map(mapDoc)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("GET /api/messages/history error", error)
    return NextResponse.json({ error: "Error al obtener historial de mensajes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb()
    const { messageId } = await req.json()

    if (!messageId) {
      return NextResponse.json({ error: "ID de mensaje requerido" }, { status: 400 })
    }

    // Obtener el mensaje original
    const messageRef = adminDb.collection("messages").doc(messageId)
    const messageDoc = await messageRef.get()

    if (!messageDoc.exists) {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    const messageData = messageDoc.data()

    // Mover a historial
    await adminDb.collection("messages_history").add({
      ...messageData,
      archivedAt: new Date(),
    })

    // Eliminar de la colección original
    await messageRef.delete()

    return NextResponse.json({ success: true, message: "Mensaje archivado correctamente" })
  } catch (error) {
    console.error("POST /api/messages/history error", error)
    return NextResponse.json({ error: "Error al archivar mensaje" }, { status: 500 })
  }
}
