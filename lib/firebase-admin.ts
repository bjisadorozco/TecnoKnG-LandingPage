import { getApps, initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

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

// 👇 NO ejecutes nada aquí
export function getAdminAuth() {
  return getAuth(getAdminApp())
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
