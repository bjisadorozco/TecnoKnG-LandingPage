import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import type { OrderRequest } from "@/lib/store-context"

function mapDoc(doc: any): OrderRequest & { archivedAt: Date } {
  const data = doc.data()
  return {
    id: doc.id,
    items: data.items ?? [],
    total: data.total ?? 0,
    customerName: data.customerName ?? "",
    customerPhone: data.customerPhone ?? "",
    customerEmail: data.customerEmail ?? "",
    notes: data.notes ?? "",
    status: data.status ?? "completed",
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    archivedAt: data.archivedAt?.toDate?.() ?? new Date(),
  }
}

export async function GET() {
  try {
    const adminDb = getAdminDb()

    const snapshot = await adminDb
      .collection("orders_history")
      .orderBy("archivedAt", "desc")
      .get()

    const orders = snapshot.docs.map(mapDoc)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("GET /api/orders/history error", error)
    return NextResponse.json({ error: "Error al obtener historial de pedidos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb()
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "ID de pedido requerido" }, { status: 400 })
    }

    // Obtener el pedido original
    const orderRef = adminDb.collection("orders").doc(orderId)
    const orderDoc = await orderRef.get()

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    const orderData = orderDoc.data()

    // Mover a historial
    await adminDb.collection("orders_history").add({
      ...orderData,
      archivedAt: new Date(),
    })

    // Eliminar de la colección original
    await orderRef.delete()

    return NextResponse.json({ success: true, message: "Pedido archivado correctamente" })
  } catch (error) {
    console.error("POST /api/orders/history error", error)
    return NextResponse.json({ error: "Error al archivar pedido" }, { status: 500 })
  }
}
