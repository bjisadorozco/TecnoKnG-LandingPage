// lib/firebase-admin.ts
import { getApps, getApp, initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getAdminApp() {
  if (getApps().length) return getApp()

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin env vars missing")
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  })
}

export function getAdminAuth() {
  return getAuth(getAdminApp())
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
