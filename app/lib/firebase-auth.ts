// lib/firebase-auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { firebaseAuth } from "./firebaseClient"

export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const signUp = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const logOut = async () => {
  try {
    await signOut(firebaseAuth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(firebaseAuth, callback)
}
