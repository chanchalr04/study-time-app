import React, { createContext, useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      // Mock login - replace with actual API
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        dailyGoal: 120,
        totalStudyTime: 540,
        streak: 5,
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      toast.success('Login successful!')
      return { success: true, user: mockUser }
    } catch (error) {
      toast.error('Login failed')
      return { success: false, error: error.message }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        dailyGoal: 120,
        totalStudyTime: 0,
        streak: 0,
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      toast.success('Registration successful!')
      return { success: true, user: mockUser }
    } catch (error) {
      toast.error('Registration failed')
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully!')
  }

  // ✅ ADD THIS FUNCTION - Update Profile
  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        throw new Error('No user logged in')
      }
      
      // Merge existing user data with new data
      const updatedUser = {
        ...user,
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Update state
      setUser(updatedUser)
      
      toast.success('Profile updated successfully!')
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile, // ✅ Make sure this is included
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}