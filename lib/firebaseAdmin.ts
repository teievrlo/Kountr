import admin from "firebase-admin"

// Store the initialized app instance to prevent re-initialization attempts
let firebaseAdminApp: admin.app.App | null = null

export function initAdmin() {
  if (firebaseAdminApp) {
    // console.log("Firebase Admin SDK already initialized.");
    return firebaseAdminApp
  }

  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_JSON
    if (!serviceAccountString) {
      console.error("CRITICAL_ADMIN_INIT: FIREBASE_SERVICE_JSON environment variable is not set.")
      throw new Error("Firebase Admin SDK service account JSON is not configured.")
    }

    let serviceAccount
    try {
      serviceAccount = JSON.parse(serviceAccountString)
    } catch (parseError: any) {
      console.error("CRITICAL_ADMIN_INIT: Failed to parse FIREBASE_SERVICE_JSON:", parseError.message)
      console.error(
        "CRITICAL_ADMIN_INIT: Ensure FIREBASE_SERVICE_JSON is a valid JSON string, possibly single-lined with escaped newlines on Vercel.",
      )
      throw new Error("Invalid Firebase Admin SDK service account JSON format.")
    }

    // Check if already initialized by name (another safety net, though firebaseAdminApp should cover it)
    const existingApp = admin.apps.find((app) => app?.name === "[DEFAULT]")
    if (existingApp) {
      // console.log("Firebase Admin SDK [DEFAULT] app already exists.");
      firebaseAdminApp = existingApp
      return firebaseAdminApp
    }

    console.log("Initializing Firebase Admin SDK...")
    firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    console.log("Firebase Admin SDK initialized successfully.")
    return firebaseAdminApp
  } catch (error: any) {
    console.error("CRITICAL_ADMIN_INIT: Error initializing Firebase Admin SDK:", error.message)
    // Do not re-throw here if you want the API route to attempt to handle it,
    // but it's a critical failure. The API route will likely fail too.
    // For now, let it throw so it's obvious.
    throw error // Re-throw to make it clear initialization failed
  }
}

// Optional: Export a getter for the admin app if needed elsewhere, though initAdmin should be called first.
export function getAdminApp() {
  if (!firebaseAdminApp) {
    // This case means initAdmin was not called or failed.
    // Depending on strategy, you could try to init here or throw.
    console.warn("getAdminApp called before initAdmin or initAdmin failed. Attempting to initialize now.")
    return initAdmin() // Attempt to initialize if not already
  }
  return firebaseAdminApp
}
