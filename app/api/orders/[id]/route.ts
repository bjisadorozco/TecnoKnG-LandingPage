import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import type { OrderRequest } from "@/lib/store-context"

function mapDoc(doc: any): OrderRequest {
  const data = doc.data()
  return {
    id: doc.id,
    items: data.items ?? [],
    total: data.total ?? 0,
    customerName: data.customerName ?? "",
    customerPhone: data.customerPhone ?? "",
    customerEmail: data.customerEmail ?? "",
    notes: data.notes ?? "",
    status: data.status ?? "pending",
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminDb = getAdminDb()
    const { id } = params
    const { status } = await req.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID y status son requeridos" },
        { status: 400 }
      )
    }

    // Validar que el status sea válido
    const validStatuses: OrderRequest["status"][] = ["pending", "contacted", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      )
    }

    const docRef = adminDb.collection("orders").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      )
    }

    const orderData = doc.data()
    const currentStatus = orderData?.status

    // Si se está cancelando el pedido, restaurar el stock
    if (status === "cancelled" && currentStatus !== "cancelled") {
      const batch = adminDb.batch()
      
      for (const item of orderData?.items || []) {
        const productRef = adminDb.collection("products").doc(item.id)
        const productDoc = await productRef.get()
        
        if (productDoc.exists) {
          const currentStock = productDoc.data()?.stock || 0
          const newStock = currentStock + item.quantity
          
          // Restaurar stock y disponibilidad
          batch.update(productRef, {
            stock: newStock,
            available: newStock > 0,
            updatedAt: FieldValue.serverTimestamp(),
          })
        }
      }
      
      // Ejecutar restauración de stock
      await batch.commit()
    }

    // Actualizar el estado y el timestamp
    await docRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    })

    const updated = await docRef.get()
    return NextResponse.json(mapDoc(updated))
  } catch (error) {
    console.error(`PATCH /api/orders/${params.id} error:`, error)
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 }
    )
  }
}
