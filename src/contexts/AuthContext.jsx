"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { authService } from "../services/auth"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials)
      setUser(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const register = async (userData) => {
    try {
      const data = await authService.register(userData)
      return data
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email) => {
    try {
      const data = await authService.forgotPassword(email)
      return data
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      const data = await authService.resetPassword(token, newPassword)
      return data
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role_id === 1,
    isTechnician: user?.role_id === 2,
    isCustomer: user?.role_id === 3,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
