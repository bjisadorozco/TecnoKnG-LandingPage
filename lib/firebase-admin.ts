import { getApps, initializeApp, cert, getApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

function assertServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("firebase-admin solo debe inicializarse en el servidor.")
  }

  const required = {
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length) {
    throw new Error(`Variables de entorno faltantes para Firebase Admin: ${missing.join(", ")}`)
  }
}

assertServerEnv()

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}

const firebaseAdminApp = getApps().length > 0 ? getApp() : initializeApp({
  credential: cert(serviceAccount as Parameters<typeof cert>[0]),
})

export const adminDb = getFirestore(firebaseAdminApp)
export const adminAuth = getAuth(firebaseAdminApp)
