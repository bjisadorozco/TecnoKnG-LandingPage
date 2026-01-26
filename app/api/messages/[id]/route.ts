import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminDb = getAdminDb() // ✅ ESTA LÍNEA FALTABA

    const { id } = params
    const payload = await req.json()

    const messageRef = adminDb.collection("messages").doc(id)
    const existing = await messageRef.get()

    if (!existing.exists) {
      return NextResponse.json(
        { error: "Mensaje no encontrado" },
        { status: 404 }
      )
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (typeof payload.status === "string") {
      updates.status = payload.status
    }

    await messageRef.update(updates)

    const updated = await messageRef.get()
    const data = updated.data()!

    return NextResponse.json({
      id: updated.id,
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      service: data.service ?? "",
      message: data.message ?? "",
      status: data.status ?? "pending",
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    })
  } catch (error) {
    console.error("PATCH /api/messages/[id] error", error)
    return NextResponse.json(
      { error: "Error al actualizar mensaje" },
      { status: 500 }
    )
  }
}
