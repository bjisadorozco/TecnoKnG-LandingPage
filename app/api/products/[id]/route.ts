import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

function mapDoc(doc: any) {
  const data = doc.data()

  return {
    id: doc.id,
    name: data.name ?? "",
    description: data.description ?? "",
    price: data.price ?? 0,
    images: Array.isArray(data.images) ? data.images : [],
    category: data.category ?? "accessories",
    brand: data.brand ?? "",
    stock: data.stock ?? 0,
    available: typeof data.available === "boolean" ? data.available : true,
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminDb = getAdminDb()
    const { id } = params
    const payload = await req.json()

    const productRef = adminDb.collection("products").doc(id)
    const existing = await productRef.get()

    if (!existing.exists) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (typeof payload.name === "string") updates.name = payload.name
    if (typeof payload.description === "string")
      updates.description = payload.description
    if (typeof payload.price === "number") updates.price = payload.price
    if (typeof payload.category === "string")
      updates.category = payload.category
    if (typeof payload.brand === "string") updates.brand = payload.brand

    if (typeof payload.stock === "number") {
      updates.stock = Math.max(0, payload.stock)
      updates.available = payload.stock > 0
    }

    if (typeof payload.available === "boolean")
      updates.available = payload.available

    // 🔥 ACTUALIZAR IMÁGENES SOLO SI ES ARRAY
    if (Array.isArray(payload.images)) {
      updates.images = payload.images
    }

    await productRef.update(updates)

    const updated = await productRef.get()

    return NextResponse.json(mapDoc(updated))
  } catch (error) {
    console.error("PATCH /api/products/[id] error", error)
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminDb = getAdminDb()
    const { id } = params
    const payload = await req.json()

    const productRef = adminDb.collection("products").doc(id)
    const existing = await productRef.get()

    if (!existing.exists) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    const updates = {
      ...payload,
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (typeof payload.stock === "number") {
      updates.stock = Math.max(0, payload.stock)
      updates.available = payload.stock > 0
    }

    if (Array.isArray(payload.images)) {
      updates.images = payload.images
    }

    await productRef.update(updates)

    const updated = await productRef.get()

    return NextResponse.json(mapDoc(updated))
  } catch (error) {
    console.error("PUT /api/products/[id] error", error)
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminDb = getAdminDb()
    const { id } = params

    const productRef = adminDb.collection("products").doc(id)
    const existing = await productRef.get()

    if (!existing.exists) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    await productRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/products/[id] error", error)
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    )
  }
}