import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/SupabaseAuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Generate unique 10-digit PNR
const generatePNR = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return (timestamp + random).slice(0, 10)
}

function Booking() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()
  const { train, fromStation, toStation, journeyDate } = location.state || {}

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'male', berth: 'lower', id: 1 }
  ])
  const [contactDetails, setContactDetails] = useState({
    email: user?.email || '',
    phone: ''
  })
  const [selectedClass, setSelectedClass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Set default class when train loads
  useEffect(() => {
    if (train?.classes && train.classes.length > 0) {
      setSelectedClass(train.classes[0])
    }
  }, [train])

  // Handle loading state and redirects
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!train) {
    navigate('/check-trains')
    return null
  }

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login', { 
      state: { 
        from: { 
          pathname: '/booking',
          state: { train, fromStation, toStation, journeyDate }
        }
      } 
    })
    return null
  }

  const addPassenger = () => {
    setPassengers([...passengers, { 
      name: '', 
      age: '', 
      gender: 'male', 
      berth: 'lower', 
      id: passengers.length + 1 
    }])
  }

  const removePassenger = (id) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id))
    }
  }

  const updatePassenger = (id, field, value) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const calculateTotalFare = () => {
    if (!train?.fare || !selectedClass) return 0
    const farePerPassenger = train.fare[selectedClass] || 1200
    return passengers.length * farePerPassenger
  }

  const validateForm = () => {
    // Validate passengers
    for (let p of passengers) {
      if (!p.name?.trim()) {
        setError('Please enter all passenger names')
        return false
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        setError('Please enter valid age for all passengers')
        return false
      }
    }
    
    // Validate contact
    if (!contactDetails.phone || contactDetails.phone.length !== 10) {
      setError('Please enter valid 10-digit phone number')
      return false
    }
    
    if (!contactDetails.email || !contactDetails.email.includes('@')) {
      setError('Please enter valid email address')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)

    setTimeout(() => {
      try {
        // Generate unique 10-digit PNR
        const pnrNumber = generatePNR()
        
        // Calculate total fare
        const totalFare = calculateTotalFare()
        
        // Prepare clean passenger data
        const cleanPassengers = passengers.map(({ id, ...passenger }) => ({
          name: passenger.name.trim(),
          age: parseInt(passenger.age),
          gender: passenger.gender,
          berth: passenger.berth
        }))
        
        // Create booking object with user ID
        const bookingData = {
          id: 'booking_' + Date.now(),
          pnr_number: pnrNumber,
          train_name: train.train_name,
          train_number: train.train_number,
          from_station: fromStation.code || fromStation,
          to_station: toStation.code || toStation,
          journey_date: journeyDate,
          class: selectedClass,
          passengers: cleanPassengers,
          passenger_count: passengers.length,
          total_fare: totalFare,
          base_fare: totalFare - Math.round(totalFare * 0.05),
          gst: Math.round(totalFare * 0.05),
          contact_email: contactDetails.email,
          contact_phone: contactDetails.phone,
          status: 'confirmed',
          user_id: user.id,
          user_email: user.email,
          created_at: new Date().toISOString()
        }

        // Get existing bookings for this specific user
        const storageKey = `voyagemate_bookings_${user.id}`
        const existingBookings = JSON.parse(localStorage.getItem(storageKey) || '[]')
        
        // Add new booking
        existingBookings.push(bookingData)
        
        // Also save to a global PNR lookup for cross-user access (optional)
        const allBookings = JSON.parse(localStorage.getItem('voyagemate_all_bookings') || '[]')
        allBookings.push(bookingData)
        localStorage.setItem('voyagemate_all_bookings', JSON.stringify(allBookings))

        // Save back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(existingBookings))

        console.log('Booking created for user:', user.email, bookingData)

        // Navigate to payment page
        navigate('/payment', { 
          state: { 
            booking: bookingData
          } 
        })
      } catch (error) {
        console.error('Error creating booking:', error)
        setError('Failed to create booking. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">Complete Your Booking</h1>
            <p className="text-indigo-100 mt-1">{train.train_name} ({train.train_number})</p>
          </div>

          <div className="p-6">
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* User Info */}
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm text-indigo-700 flex items-center">
                <span className="text-lg mr-2">👤</span>
                Booking for: {user?.email}
              </p>
            </div>

            {/* Journey Summary */}
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-indigo-600">From</p>
                  <p className="font-bold">{fromStation.code || fromStation}</p>
                  <p className="text-xs text-gray-600">{fromStation.name || ''}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600">To</p>
                  <p className="font-bold">{toStation.code || toStation}</p>
                  <p className="text-xs text-gray-600">{toStation.name || ''}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600">Date</p>
                  <p className="font-bold">{new Date(journeyDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600">Train</p>
                  <p className="font-bold">{train.train_number}</p>
                </div>
              </div>
            </div>

            {/* Class Selection */}
            {train.classes && train.classes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class
                </label>
                <div className="flex flex-wrap gap-2">
                  {train.classes.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedClass === cls
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } transition`}
                    >
                      <span className="font-medium">{cls}</span>
                      <span className="ml-2 text-sm">₹{train.fare?.[cls] || 1200}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Passenger Details */}
              <div className="space-y-4 mb-6">
                <h2 className="text-lg font-medium text-gray-900">Passenger Details</h2>
                
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Passenger {index + 1}</h3>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(passenger.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(passenger.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Age</label>
                        <input
                          type="number"
                          value={passenger.age}
                          onChange={(e) => updatePassenger(passenger.id, 'age', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                          min="1"
                          max="120"
                          placeholder="Age"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Gender</label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => updatePassenger(passenger.id, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Berth Preference</label>
                        <select
                          value={passenger.berth}
                          onChange={(e) => updatePassenger(passenger.id, 'berth', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="lower">Lower</option>
                          <option value="middle">Middle</option>
                          <option value="upper">Upper</option>
                          <option value="side-lower">Side Lower</option>
                          <option value="side-upper">Side Upper</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPassenger}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition"
                >
                  + Add Another Passenger
                </button>
              </div>

              {/* Contact Details */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={contactDetails.email}
                      onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={contactDetails.phone}
                      onChange={(e) => setContactDetails({
                        ...contactDetails, 
                        phone: e.target.value.replace(/\D/g, '').slice(0, 10)
                      })}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      maxLength="10"
                    />
                  </div>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Fare Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Fare ({passengers.length} x ₹{train.fare?.[selectedClass] || 1200})</span>
                    <span>₹{passengers.length * (train.fare?.[selectedClass] || 1200)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{Math.round(passengers.length * (train.fare?.[selectedClass] || 1200) * 0.05)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹{calculateTotalFare()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Booking