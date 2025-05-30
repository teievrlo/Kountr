// lib/firebase-firestore.ts
import { collection, addDoc, getDocs, query, where, onSnapshot } from "firebase/firestore"
import { firebaseDb } from "./firebaseClient"

// Collections
export const COLLECTIONS = {
  CAMPAIGNS: "campaigns",
  CREATORS: "creators",
  VIDEOS: "videos",
  SCRAPE_LOGS: "scrape_logs",
} as const

// Campaign operations
export const addCampaign = async (campaignData: any) => {
  try {
    const docRef = await addDoc(collection(firebaseDb, COLLECTIONS.CAMPAIGNS), {
      ...campaignData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getCampaigns = async () => {
  try {
    const querySnapshot = await getDocs(collection(firebaseDb, COLLECTIONS.CAMPAIGNS))
    const campaigns = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return { campaigns, error: null }
  } catch (error: any) {
    return { campaigns: [], error: error.message }
  }
}

// Creator operations
export const addCreator = async (creatorData: any) => {
  try {
    const docRef = await addDoc(collection(firebaseDb, COLLECTIONS.CREATORS), {
      ...creatorData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getCreators = async (campaignId?: string) => {
  try {
    let q = collection(firebaseDb, COLLECTIONS.CREATORS)

    if (campaignId) {
      q = query(collection(firebaseDb, COLLECTIONS.CREATORS), where("campaignId", "==", campaignId))
    }

    const querySnapshot = await getDocs(q)
    const creators = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return { creators, error: null }
  } catch (error: any) {
    return { creators: [], error: error.message }
  }
}

// Video operations
export const addVideo = async (videoData: any) => {
  try {
    const docRef = await addDoc(collection(firebaseDb, COLLECTIONS.VIDEOS), {
      ...videoData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getVideos = async (creatorId?: string) => {
  try {
    let q = collection(firebaseDb, COLLECTIONS.VIDEOS)

    if (creatorId) {
      q = query(collection(firebaseDb, COLLECTIONS.VIDEOS), where("creatorId", "==", creatorId))
    }

    const querySnapshot = await getDocs(q)
    const videos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return { videos, error: null }
  } catch (error: any) {
    return { videos: [], error: error.message }
  }
}

// Real-time listeners
export const listenToCampaigns = (callback: (campaigns: any[]) => void) => {
  return onSnapshot(collection(firebaseDb, COLLECTIONS.CAMPAIGNS), (snapshot) => {
    const campaigns = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(campaigns)
  })
}

export const listenToCreators = (callback: (creators: any[]) => void) => {
  return onSnapshot(collection(firebaseDb, COLLECTIONS.CREATORS), (snapshot) => {
    const creators = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(creators)
  })
}
