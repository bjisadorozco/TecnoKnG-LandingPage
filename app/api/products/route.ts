import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import type { Product } from "@/lib/store-context"

function mapDoc(doc: any): Product {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name ?? "",
    description: data.description ?? "",
    price: data.price ?? 0,
    image: data.image ?? "",
    images: data.images ?? [],
    category: data.category ?? "accessories",
    brand: data.brand ?? "",
    stock: data.stock ?? 0,
    available: typeof data.available === "boolean" ? data.available : true,
  }
}

export async function GET() {
  try {
    const adminDb = getAdminDb()

    const snapshot = await adminDb
      .collection("products")
      .orderBy("createdAt", "desc")
      .get()

    const products = snapshot.docs.map(mapDoc)
    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/products error", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb()

    const payload = await req.json()
    const { name, description, price, image, category, stock, available } = payload

    if (!name || typeof price !== "number" || !image || !category) {
      return NextResponse.json({ error: "Campos obligatorios inválidos" }, { status: 400 })
    }

    const docRef = await adminDb.collection("products").add({
      name,
      description: description ?? "",
      price,
      image,
      category,
      stock: Math.max(0, Number(stock) || 0),
      available: typeof available === "boolean" ? available : true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const created = await docRef.get()
    if (!created.exists) {
      return NextResponse.json({ error: "No se pudo obtener el producto creado" }, { status: 500 })
    }

    return NextResponse.json(mapDoc(created))
  } catch (error) {
    console.error("POST /api/products error", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
