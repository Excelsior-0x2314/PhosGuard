import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiFetch } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  role: string
  role_label: string
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const response = await apiFetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const response = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      setUser(data.user)
      return { success: true, message: data.message }
    }

    return { success: false, message: data.message || "Erreur de connexion." }
  }

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}