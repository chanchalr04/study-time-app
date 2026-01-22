import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'   // ✅ axios instance

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false) // For login/register loading

  // ✅ Verify token and get user profile on app load
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          // Verify token by getting user profile
          const response = await api.get('/auth/me')
          setUser(response.user)
          localStorage.setItem('user', JSON.stringify(response.user))
        } catch (error) {
          console.error('Token verification failed:', error)
          // Clear invalid tokens
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

  // ✅ REAL LOGIN (BACKEND)
  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)
      setToken(token)
      toast.success('Login successful')

      return { success: true, data: response }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setAuthLoading(false)
    }
  }

  // ✅ REAL REGISTER
  const register = async (data) => {
    setAuthLoading(true)
    try {
      const response = await api.post('/auth/register', data)
      const { user, token } = response

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)
      setToken(token)
      toast.success('Registration successful')

      return { success: true, data: response }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setAuthLoading(false)
    }
  }

  // ✅ LOGOUT
  const logout = async () => {
    try {
      // Call backend logout if endpoint exists
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setToken(null)
      toast.success('Logged out successfully')
    }
  }

  // ✅ UPDATE USER PROFILE
  const updateProfile = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // ✅ REFRESH USER DATA
  const refreshUser = async () => {
    if (token) {
      try {
        const response = await api.get('/auth/me')
        setUser(response.user)
        localStorage.setItem('user', JSON.stringify(response.user))
      } catch (error) {
        console.error('Failed to refresh user:', error)
      }
    }
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
        updateProfile,
        refreshUser,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}