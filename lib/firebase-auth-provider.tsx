"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"
import { firebaseAuth } from "./firebaseClient"

interface FirebaseAuthContextType {
  user: User | null
  loading: boolean
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
})

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <FirebaseAuthContext.Provider value={{ user, loading }}>{children}</FirebaseAuthContext.Provider>
}

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider")
  }
  return context
}
