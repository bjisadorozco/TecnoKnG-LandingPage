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
import type { ContactMessage } from "@/lib/store-context"

const MESSAGES_COLLECTION = "messages"
const messagesCollection = collection(firestoreDb, MESSAGES_COLLECTION)

function mapMessageSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): ContactMessage {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    service: data.service ?? "",
    message: data.message ?? "",
    status: data.status ?? "pending",
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  }
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const messagesQuery = query(messagesCollection, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(messagesQuery)
  return snapshot.docs.map((doc) => mapMessageSnapshot(doc))
}

export type CreateMessagePayload = Omit<ContactMessage, "id" | "status" | "createdAt">

export async function createContactMessage(payload: CreateMessagePayload) {
  const docRef = await addDoc(messagesCollection, {
    ...payload,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const createdDoc = await getDoc(docRef)
  if (!createdDoc.exists()) {
    throw new Error("No se pudo obtener el mensaje recién creado")
  }

  return mapMessageSnapshot(createdDoc as QueryDocumentSnapshot<DocumentData>)
}

export async function updateMessageStatus(messageId: string, status: ContactMessage["status"]) {
  const messageRef = doc(firestoreDb, MESSAGES_COLLECTION, messageId)
  await updateDoc(messageRef, {
    status,
    updatedAt: serverTimestamp(),
  })
}
