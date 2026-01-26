import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await req.json()

    const productRef = adminDb.collection("products").doc(id)
    const existing = await productRef.get()

    if (!existing.exists) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    let updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (typeof payload.stock === "number") {
      updates.stock = Math.max(0, payload.stock)
      updates.available = payload.stock > 0
    }

    if (typeof payload.available === "boolean") {
      updates.available = payload.available
    }

    if (typeof payload.name === "string") updates.name = payload.name
    if (typeof payload.description === "string") updates.description = payload.description
    if (typeof payload.price === "number") updates.price = payload.price
    if (typeof payload.image === "string") updates.image = payload.image
    if (typeof payload.category === "string") updates.category = payload.category

    await productRef.update(updates)

    const updated = await productRef.get()
    const data = updated.data()!

    return NextResponse.json({
      id: updated.id,
      name: data.name ?? "",
      description: data.description ?? "",
      price: data.price ?? 0,
      image: data.image ?? "",
      category: data.category ?? "accessories",
      stock: data.stock ?? 0,
      available: typeof data.available === "boolean" ? data.available : true,
    })
  } catch (error) {
    console.error("PATCH /api/products/[id] error", error)
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log("Attempting to delete product with ID:", id)
    
    if (!id) {
      console.error("No ID provided in params")
      return NextResponse.json(
        { error: "ID de producto no proporcionado" },
        { status: 400 }
      )
    }

    const productRef = adminDb.collection("products").doc(id)
    const existing = await productRef.get()

    console.log("Product exists:", existing.exists)

    if (!existing.exists) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    console.log("Deleting product...")
    await productRef.delete()
    console.log("Product deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: "Error al eliminar producto",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
