import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/SupabaseAuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium transition">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-indigo-600 font-medium transition">
              Services
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 font-medium transition">
              Contact
            </Link>
            
            {/* Login Button - Always visible on left */}
            {!user ? (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition"
                  disabled={isSigningOut}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-semibold text-xs">
                    {getInitials()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      My Bookings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      disabled={isSigningOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {isSigningOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Logo */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">VoyageMate</span>
            <span className="text-2xl">🚂</span>
          </Link>

          {/* Right Section - Train Features */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/check-trains')}
              className="hidden md:inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium text-sm"
            >
              Check Trains
            </button>
            <button
              onClick={() => navigate('/live-status')}
              className="hidden md:inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
            >
              Live Status
            </button>
            <button
              onClick={() => navigate('/pnr')}
              className="hidden md:inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
            >
              PNR
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar