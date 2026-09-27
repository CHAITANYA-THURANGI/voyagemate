import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/SupabaseAuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Dashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Load user-specific bookings
    const loadUserBookings = () => {
      const storageKey = `voyagemate_bookings_${user.id}`
      const userBookings = JSON.parse(localStorage.getItem(storageKey) || '[]')
      
      // Sort by date (newest first)
      userBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      setBookings(userBookings)
      setLoading(false)
    }

    loadUserBookings()
  }, [user, navigate])

  const stats = {
    totalBookings: bookings.length,
    upcomingTrips: bookings.filter(b => new Date(b.journey_date) > new Date()).length,
    completedTrips: bookings.filter(b => new Date(b.journey_date) < new Date()).length,
    totalSpent: bookings.reduce((sum, b) => sum + (b.total_fare || 0), 0)
  }

  const quickActions = [
    {
      title: 'Book Tickets',
      description: 'Search and book train tickets',
      icon: '🚂',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      path: '/check-trains'
    },
    {
      title: 'Check PNR',
      description: 'View PNR status instantly',
      icon: '✅',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      path: '/pnr'
    },
    {
      title: 'Live Status',
      description: 'Track trains in real-time',
      icon: '📍',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      path: '/live-status'
    },
    {
      title: 'My Bookings',
      description: 'View all your bookings',
      icon: '📋',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      path: '/my-bookings'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {profile?.fullName || user?.email?.split('@')[0] || 'User'}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                You have {stats.upcomingTrips} upcoming {stats.upcomingTrips === 1 ? 'trip' : 'trips'}
              </p>
            </div>
            <div className="hidden md:block">
              <span className="text-6xl">🚂</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-3xl font-bold text-blue-600">{stats.totalBookings}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Bookings</h3>
            <p className="text-sm text-gray-400 mt-1">All time bookings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🚆</span>
              </div>
              <span className="text-3xl font-bold text-green-600">{stats.upcomingTrips}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Upcoming Trips</h3>
            <p className="text-sm text-gray-400 mt-1">Scheduled journeys</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <span className="text-3xl font-bold text-purple-600">{stats.completedTrips}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Completed Trips</h3>
            <p className="text-sm text-gray-400 mt-1">Journeys finished</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-3xl font-bold text-orange-600">₹{stats.totalSpent}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Spent</h3>
            <p className="text-sm text-gray-400 mt-1">Lifetime expenditure</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`group relative overflow-hidden rounded-xl ${action.color} ${action.hoverColor} transition-all transform hover:scale-105 shadow-lg`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="p-6 text-white">
                  <div className="text-4xl mb-3">{action.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Recent Bookings</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {bookings.length > 0 ? (
              bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-indigo-600">{booking.train_number}</span>
                        <span className="text-gray-400">|</span>
                        <span className="font-semibold text-gray-900">{booking.train_name}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">PNR</p>
                          <p className="font-mono font-medium">{booking.pnr_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Journey</p>
                          <p>{booking.from_station} → {booking.to_station}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p>{new Date(booking.journey_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Fare</p>
                          <p className="font-semibold text-green-600">₹{booking.total_fare}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/pnr', { state: { pnrNumber: booking.pnr_number } })}
                      className="ml-4 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6">Start your journey by booking your first train ticket</p>
                <button
                  onClick={() => navigate('/check-trains')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
                >
                  Book Your First Journey
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard