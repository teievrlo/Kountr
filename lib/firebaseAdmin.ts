import { initializeApp, cert, getApps } from "firebase-admin/app"

export function initAdmin() {
  if (!getApps().length) {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_JSON as string)
    initializeApp({ credential: cert(svc) })
  }
}
