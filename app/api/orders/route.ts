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

export async function GET() {
  try {
    const adminDb = getAdminDb()

    const snapshot = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get()

    const orders = snapshot.docs.map(mapDoc)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("GET /api/orders error", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb()

    const payload = await req.json()
    const { items, total, customerName, customerPhone, customerEmail, notes } = payload

    if (!items?.length || typeof total !== "number" || !customerName || !customerPhone) {
      return NextResponse.json({ error: "Campos obligatorios inválidos" }, { status: 400 })
    }

    // Verificar y actualizar stock de cada producto
    const batch = adminDb.batch()
    
    for (const item of items) {
      const productRef = adminDb.collection("products").doc(item.id)
      const productDoc = await productRef.get()
      
      if (!productDoc.exists) {
        return NextResponse.json({ error: `Producto ${item.id} no encontrado` }, { status: 400 })
      }
      
      const currentStock = productDoc.data()?.stock || 0
      const newStock = currentStock - item.quantity
      
      if (newStock < 0) {
        return NextResponse.json({ error: `Stock insuficiente para ${item.name}` }, { status: 400 })
      }
      
      // Actualizar stock y disponibilidad
      batch.update(productRef, {
        stock: newStock,
        available: newStock > 0,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    // Ejecutar actualización de stock
    await batch.commit()

    // Crear el pedido
    const docRef = await adminDb.collection("orders").add({
      items,
      total,
      customerName,
      customerPhone,
      customerEmail: customerEmail ?? "",
      notes: notes ?? "",
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const created = await docRef.get()
    if (!created.exists) {
      return NextResponse.json({ error: "No se pudo obtener el pedido creado" }, { status: 500 })
    }

    return NextResponse.json(mapDoc(created))
  } catch (error) {
    console.error("POST /api/orders error", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}
