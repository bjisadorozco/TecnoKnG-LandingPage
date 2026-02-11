import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"

import { firestoreDb } from "@/lib/firebase-client"
import type { Product } from "@/lib/store-context"

const PRODUCTS_COLLECTION = "products"
const productsCollection = collection(firestoreDb, PRODUCTS_COLLECTION)

function mapProductSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): Product {
  const data = snapshot.data()
  return {
    id: snapshot.id,
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

export async function fetchProducts(): Promise<Product[]> {
  const productsQuery = query(productsCollection, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(productsQuery)
  return snapshot.docs.map((doc) => mapProductSnapshot(doc))
}

export type CreateProductPayload = Omit<Product, "id">

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const docRef = await addDoc(productsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const createdDoc = await getDoc(docRef)
  if (!createdDoc.exists()) {
    throw new Error("No se pudo obtener el producto recién creado")
  }

  return mapProductSnapshot(createdDoc as QueryDocumentSnapshot<DocumentData>)
}

export async function updateProductStock(productId: string, stock: number) {
  const productRef = doc(firestoreDb, PRODUCTS_COLLECTION, productId)
  await updateDoc(productRef, {
    stock: Math.max(0, stock),
    available: stock > 0,
    updatedAt: serverTimestamp(),
  })
}

export async function toggleProductAvailability(productId: string, forceValue?: boolean) {
  const productRef = doc(firestoreDb, PRODUCTS_COLLECTION, productId)
  const existing = await getDoc(productRef)
  if (!existing.exists()) {
    throw new Error("Producto no encontrado")
  }

  const current = existing.data()
  const nextValue = typeof forceValue === "boolean" ? forceValue : !current.available

  await updateDoc(productRef, {
    available: nextValue,
    updatedAt: serverTimestamp(),
  })
}

export async function updateProduct(productId: string, data: Partial<CreateProductPayload>) {
  const productRef = doc(firestoreDb, PRODUCTS_COLLECTION, productId)
  await updateDoc(productRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}
