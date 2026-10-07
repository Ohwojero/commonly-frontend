'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiLogin, apiRegister, apiGetMe, type MeResponse } from '@/lib/api'

type AuthState = {
  user: MeResponse | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<string>
  register: (email: string, password: string, name: string | undefined, location: string) => Promise<string>
  logout: () => void
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  loading: true,
  login: async () => '',
  register: async () => '',
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('commonly_token')
    if (stored) {
      setToken(stored)
      apiGetMe()
        .then((me) => setUser(me))
        .catch(() => {
          localStorage.removeItem('commonly_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<string> => {
    const res = await apiLogin(email, password)
    localStorage.setItem('commonly_token', res.access_token)
    setToken(res.access_token)
    setUser({ id: res.user.id, email: res.user.email, name: res.user.name, location: res.user.location, role: res.user.role, createdAt: new Date().toISOString() })
    return res.user.role
  }

  const register = async (email: string, password: string, name: string | undefined, location: string): Promise<string> => {
    const res = await apiRegister(email, password, name, location)
    localStorage.setItem('commonly_token', res.access_token)
    setToken(res.access_token)
    setUser({ id: res.user.id, email: res.user.email, name: res.user.name, location: res.user.location, role: res.user.role, createdAt: new Date().toISOString() })
    return res.user.role
  }

  const logout = () => {
    localStorage.removeItem('commonly_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
