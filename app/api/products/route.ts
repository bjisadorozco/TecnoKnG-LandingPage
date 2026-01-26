import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
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
    category: data.category ?? "accessories",
    stock: data.stock ?? 0,
    available: typeof data.available === "boolean" ? data.available : true,
  }
}

export async function GET() {
  try {
    console.log("GET /api/products - Starting...")
    console.log("Environment check:", {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ? "set" : "missing",
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "set" : "missing",
      privateKeyBase64: process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 ? "set" : "missing",
    })
    
    const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get()
    console.log("Products fetched from Firestore:", snapshot.docs.length)
    
    const products = snapshot.docs.map(mapDoc)
    console.log("Products mapped:", products.length)
    
    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/products error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ 
      error: "Error al obtener productos",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
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
