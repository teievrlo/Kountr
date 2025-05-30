import { getFirestore } from "firebase-admin/firestore"
import { initAdmin } from "./firebaseAdmin"

// Initialize admin if not already done
initAdmin()

const adminDb = getFirestore()

export const adminFirestore = {
  // Get all documents from a collection
  async getCollection(collectionName: string) {
    const snapshot = await adminDb.collection(collectionName).get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  // Get a single document
  async getDocument(collectionName: string, docId: string) {
    const doc = await adminDb.collection(collectionName).doc(docId).get()
    return doc.exists ? { id: doc.id, ...doc.data() } : null
  },

  // Create a document
  async createDocument(collectionName: string, data: any) {
    const docRef = await adminDb.collection(collectionName).add({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return docRef.id
  },

  // Update a document
  async updateDocument(collectionName: string, docId: string, data: any) {
    await adminDb
      .collection(collectionName)
      .doc(docId)
      .update({
        ...data,
        updated_at: new Date(),
      })
  },

  // Delete a document
  async deleteDocument(collectionName: string, docId: string) {
    await adminDb.collection(collectionName).doc(docId).delete()
  },

  // Query documents
  async queryDocuments(collectionName: string, field: string, operator: any, value: any) {
    const snapshot = await adminDb.collection(collectionName).where(field, operator, value).get()
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },
}
