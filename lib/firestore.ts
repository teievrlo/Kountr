import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore"
import { getFirestore } from "firebase/firestore"
import { firebaseApp } from "./firebaseClient"

const db = getFirestore(firebaseApp)

// Collections
export const COLLECTIONS = {
  CAMPAIGNS: "campaigns",
  CREATORS: "creators",
  VIDEOS: "videos",
  SCRAPE_LOGS: "scrape_logs",
} as const

// Campaign functions
export const campaignService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CAMPAIGNS))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getById(id: string) {
    const docRef = doc(db, COLLECTIONS.CAMPAIGNS, id)
    const snapshot = await getDoc(docRef)
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
  },

  async create(data: any) {
    const docRef = await addDoc(collection(db, COLLECTIONS.CAMPAIGNS), {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return docRef.id
  },

  async update(id: string, data: any) {
    const docRef = doc(db, COLLECTIONS.CAMPAIGNS, id)
    await updateDoc(docRef, {
      ...data,
      updated_at: new Date(),
    })
  },

  async delete(id: string) {
    const docRef = doc(db, COLLECTIONS.CAMPAIGNS, id)
    await deleteDoc(docRef)
  },
}

// Creator functions
export const creatorService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CREATORS))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getByCampaign(campaignId: string) {
    const q = query(collection(db, COLLECTIONS.CREATORS), where("campaign_id", "==", campaignId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async create(data: any) {
    const docRef = await addDoc(collection(db, COLLECTIONS.CREATORS), {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return docRef.id
  },

  async update(id: string, data: any) {
    const docRef = doc(db, COLLECTIONS.CREATORS, id)
    await updateDoc(docRef, {
      ...data,
      updated_at: new Date(),
    })
  },

  async delete(id: string) {
    const docRef = doc(db, COLLECTIONS.CREATORS, id)
    await deleteDoc(docRef)
  },
}

// Video functions
export const videoService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTIONS.VIDEOS))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getByCreator(creatorId: string) {
    const q = query(
      collection(db, COLLECTIONS.VIDEOS),
      where("creator_id", "==", creatorId),
      orderBy("created_at", "desc"),
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async create(data: any) {
    const docRef = await addDoc(collection(db, COLLECTIONS.VIDEOS), {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return docRef.id
  },

  async update(id: string, data: any) {
    const docRef = doc(db, COLLECTIONS.VIDEOS, id)
    await updateDoc(docRef, {
      ...data,
      updated_at: new Date(),
    })
  },
}

// Real-time listeners
export const realtimeService = {
  onCampaignsChange(callback: (campaigns: any[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.CAMPAIGNS), (snapshot) => {
      const campaigns = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      callback(campaigns)
    })
  },

  onCreatorsChange(callback: (creators: any[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.CREATORS), (snapshot) => {
      const creators = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      callback(creators)
    })
  },
}
