import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function assertConfig(config: Record<string, string | undefined>) {
  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missingKeys.length > 0) {
    throw new Error(`Configuración de Firebase incompleta. Faltan variables: ${missingKeys.join(", ")}`)
  }
}

assertConfig(firebaseConfig)

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const firestoreDb = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// Authentication functions
export { signInWithEmailAndPassword, signOut, onAuthStateChanged }
export type { User }
