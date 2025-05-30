// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

export function getAdminApp() {
  if (!getApps().length) {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_JSON as string)
    return initializeApp({ credential: cert(svc) })
  }
  return getApps()[0]
}

export function getAdminFirestore() {
  const app = getAdminApp()
  return getFirestore(app)
}
