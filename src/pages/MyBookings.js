import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/SupabaseAuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MyBookings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

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

  const getFilteredBookings = () => {
    const now = new Date()
    if (filter === 'upcoming') {
      return bookings.filter(b => new Date(b.journey_date) > now)
    } else if (filter === 'past') {
      return bookings.filter(b => new Date(b.journey_date) < now)
    }
    return bookings
  }

  const getStatusBadge = (booking) => {
    const now = new Date()
    const journeyDate = new Date(booking.journey_date)
    
    if (journeyDate < now) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Completed</span>
    } else if (journeyDate > now) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Upcoming</span>
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Today</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  const filteredBookings = getFilteredBookings()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">My Bookings</h1>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'upcoming' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'past' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet." 
                : filter === 'upcoming' 
                ? "You don't have any upcoming trips." 
                : "No past bookings found."}
            </p>
            <button
              onClick={() => navigate('/check-trains')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
            >
              Search Trains
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-indigo-600">{booking.train_number}</span>
                        <span className="text-gray-400">|</span>
                        <span className="font-semibold text-gray-900">{booking.train_name}</span>
                        {getStatusBadge(booking)}
                      </div>
                      <p className="text-sm text-gray-500">PNR: {booking.pnr_number}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => navigate('/pnr', { state: { pnrNumber: booking.pnr_number } })}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Journey Date</p>
                      <p className="font-medium">{new Date(booking.journey_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">From → To</p>
                      <p className="font-medium">{booking.from_station} → {booking.to_station}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Class</p>
                      <p className="font-medium">{booking.class}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Total Fare</p>
                      <p className="font-bold text-green-600">₹{booking.total_fare}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default MyBookings