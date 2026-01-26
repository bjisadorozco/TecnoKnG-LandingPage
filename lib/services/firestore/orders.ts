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
import type { OrderRequest } from "@/lib/store-context"

const ORDERS_COLLECTION = "orders"
const ordersCollection = collection(firestoreDb, ORDERS_COLLECTION)

function mapOrderSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): OrderRequest {
  const data = snapshot.data()
  return {
    id: snapshot.id,
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

export async function fetchOrders(): Promise<OrderRequest[]> {
  const ordersQuery = query(ordersCollection, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(ordersQuery)
  return snapshot.docs.map((doc) => mapOrderSnapshot(doc))
}

export type CreateOrderPayload = Omit<OrderRequest, "id" | "createdAt" | "status">

export async function createOrder(payload: CreateOrderPayload) {
  const docRef = await addDoc(ordersCollection, {
    ...payload,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const createdDoc = await getDoc(docRef)
  if (!createdDoc.exists()) {
    throw new Error("No se pudo obtener el pedido recién creado")
  }

  return mapOrderSnapshot(createdDoc as QueryDocumentSnapshot<DocumentData>)
}

export async function updateOrderStatus(orderId: string, status: OrderRequest["status"]) {
  const orderRef = doc(firestoreDb, ORDERS_COLLECTION, orderId)
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  })
}
