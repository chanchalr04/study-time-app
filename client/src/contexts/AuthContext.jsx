import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

  /* =========================
     SAFE USER INITIALIZATION
  ========================= */
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (!storedUser || storedUser === 'undefined') return null
      return JSON.parse(storedUser)
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token')
    return storedToken || null
  })

  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  /* =========================
     LOAD USER ON APP START
  ========================= */
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token')

      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')

        if (response?.data?.user) {
          setUser(response.data.user)
          localStorage.setItem(
            'user',
            JSON.stringify(response.data.user)
          )
        }
      } catch (error) {
        // Token invalid / expired
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  /* =========================
     LOGIN
  ========================= */
  const login = async (email, password) => {
    setAuthLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const { user, token } = response.data

      if (token) {
        localStorage.setItem('token', token)
        setToken(token)
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
      }

      toast.success('Login successful')
      return { success: true }

    } catch (error) {
      toast.error(
        error?.message || 'Login failed'
      )
      return { success: false }

    } finally {
      setAuthLoading(false)
    }
  }

  /* =========================
     REGISTER
  ========================= */
  const register = async (data) => {
    setAuthLoading(true)

    try {
      const response = await api.post('/auth/register', data)
      const { user, token } = response.data

      if (token) {
        localStorage.setItem('token', token)
        setToken(token)
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
      }

      toast.success('Registration successful')
      return { success: true }

    } catch (error) {
      toast.error(
        error?.message || 'Registration failed'
      )
      return { success: false }

    } finally {
      setAuthLoading(false)
    }
  }

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
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
