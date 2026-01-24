import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // ✅ LOAD USER ON APP START
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const response = await api.get('/auth/me')
          setUser(response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        } catch (error) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
          setToken(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  // ✅ LOGIN
  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data   // 🔥 FIX

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)
      setToken(token)

      toast.success('Login successful')
      return { success: true }

    } catch (error) {
      toast.error('Login failed')
      return { success: false }
    } finally {
      setAuthLoading(false)
    }
  }

  // ✅ REGISTER
  const register = async (data) => {
    setAuthLoading(true)
    try {
      const response = await api.post('/auth/register', data)
      const { user, token } = response.data   // 🔥 FIX

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)
      setToken(token)

      toast.success('Registration successful')
      return { success: true }

    } catch (error) {
      toast.error('Registration failed')
      return { success: false }
    } finally {
      setAuthLoading(false)
    }
  }

  // ✅ LOGOUT
  const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
