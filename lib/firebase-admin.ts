import { getApps, initializeApp, cert, getApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp()
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin env vars missing")
  }

  const formattedKey = privateKey
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "-----BEGIN PRIVATE KEY-----\n")
    .replace(/-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----")
    .trim()

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: formattedKey,
    }),
  })
}

const adminApp = getFirebaseAdminApp()

export const adminDb = getFirestore(adminApp)
export const adminAuth = getAuth(adminApp)
