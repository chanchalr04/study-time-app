import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = 'https://study-time-app-production.up.railway.app';

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser && storedUser !== 'null') {
          try {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
          } catch (parseError) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // ✅ LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user || { email: email });
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { email: email }));

      return { success: true, data };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTER FUNCTION (MUST BE EXPORTED)
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Registering user:', userData);
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Register response status:', response.status);
      
      const data = await response.json();
      console.log('Register response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${response.status}`);
      }

      // Handle successful registration
      if (data.token) {
        // Auto login
        setToken(data.token);
        setUser(data.user || { email: userData.email });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || { email: userData.email }));
      }

      return { success: true, data };
    } catch (error) {
      console.error('Register error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    clearAuthData();
  };

  // ✅ VALUE OBJECT - ALL FUNCTIONS MUST BE INCLUDED
  const value = {
    user,
    token,
    loading,
    error,
    login,      // ✅
    register,   // ✅ THIS IS CRITICAL
    logout,     // ✅
    isAuthenticated: !!token && !!user,
    API_URL,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};