import React, { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('voyagemate_current_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setProfile(userData)
    }
    setLoading(false)
  }, [])

  // Sign up
  const signUp = async ({ email, password, fullName }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('voyagemate_users') || '[]')
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email)
        if (existingUser) {
          resolve({ 
            success: false, 
            error: 'Email already registered. Please sign in instead.'
          })
          return
        }

        // Create new user
        const newUser = {
          id: 'user_' + Date.now(),
          email,
          fullName,
          created_at: new Date().toISOString()
        }

        // Add to users list
        users.push(newUser)
        localStorage.setItem('voyagemate_users', JSON.stringify(users))

        // Set as current user
        localStorage.setItem('voyagemate_current_user', JSON.stringify(newUser))
        setUser(newUser)
        setProfile(newUser)

        // Create empty bookings array for this user
        const userBookings = []
        localStorage.setItem(`voyagemate_bookings_${newUser.id}`, JSON.stringify(userBookings))

        resolve({ 
          success: true, 
          user: newUser,
          message: 'Account created successfully!'
        })
      }, 500)
    })
  }

  // Sign in
  const signIn = async ({ email, password }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get all users
        const users = JSON.parse(localStorage.getItem('voyagemate_users') || '[]')
        
        // Find user by email (in demo, any password works)
        const foundUser = users.find(u => u.email === email)
        
        if (foundUser) {
          // Set as current user
          localStorage.setItem('voyagemate_current_user', JSON.stringify(foundUser))
          setUser(foundUser)
          setProfile(foundUser)
          resolve({ success: true, user: foundUser })
        } else {
          // Create new user if not found (for demo)
          const newUser = {
            id: 'user_' + Date.now(),
            email,
            fullName: email.split('@')[0],
            created_at: new Date().toISOString()
          }
          
          users.push(newUser)
          localStorage.setItem('voyagemate_users', JSON.stringify(users))
          localStorage.setItem('voyagemate_current_user', JSON.stringify(newUser))
          localStorage.setItem(`voyagemate_bookings_${newUser.id}`, JSON.stringify([]))
          
          setUser(newUser)
          setProfile(newUser)
          resolve({ success: true, user: newUser })
        }
      }, 500)
    })
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const googleUser = {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          fullName: 'Google User',
          provider: 'google'
        }
        
        // Save user
        const users = JSON.parse(localStorage.getItem('voyagemate_users') || '[]')
        users.push(googleUser)
        localStorage.setItem('voyagemate_users', JSON.stringify(users))
        localStorage.setItem('voyagemate_current_user', JSON.stringify(googleUser))
        localStorage.setItem(`voyagemate_bookings_${googleUser.id}`, JSON.stringify([]))
        
        setUser(googleUser)
        setProfile(googleUser)
        
        resolve({ success: true })
      }, 500)
    })
  }

  // Sign out
  const signOut = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('voyagemate_current_user')
        setUser(null)
        setProfile(null)
        resolve({ success: true })
      }, 300)
    })
  }

  // Update profile
  const updateProfile = async (updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) {
          resolve({ success: false, error: 'Not authenticated' })
          return
        }

        const updatedProfile = { ...profile, ...updates }
        setProfile(updatedProfile)
        
        const updatedUser = { ...user, ...updates }
        localStorage.setItem('voyagemate_current_user', JSON.stringify(updatedUser))
        
        // Update in users list
        const users = JSON.parse(localStorage.getItem('voyagemate_users') || '[]')
        const userIndex = users.findIndex(u => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem('voyagemate_users', JSON.stringify(users))
        }
        
        resolve({ success: true, profile: updatedProfile })
      }, 300)
    })
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}