import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function PNR() {
  const navigate = useNavigate()
  const location = useLocation()
  const [pnrNumber, setPnrNumber] = useState(location.state?.pnrNumber || '')
  const [pnrData, setPnrData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Function to search for a booking by PNR across all users
  const findBookingByPNR = (pnr) => {
    // First, get all users
    const users = JSON.parse(localStorage.getItem('voyagemate_users') || '[]')
    
    // Search in current user's bookings first (most likely)
    const currentUser = JSON.parse(localStorage.getItem('voyagemate_current_user') || 'null')
    if (currentUser) {
      const userBookingsKey = `voyagemate_bookings_${currentUser.id}`
      const userBookings = JSON.parse(localStorage.getItem(userBookingsKey) || '[]')
      const booking = userBookings.find(b => b.pnr_number === pnr)
      if (booking) return booking
    }
    
    // If not found in current user, search all users
    for (const user of users) {
      const userBookingsKey = `voyagemate_bookings_${user.id}`
      const userBookings = JSON.parse(localStorage.getItem(userBookingsKey) || '[]')
      const booking = userBookings.find(b => b.pnr_number === pnr)
      if (booking) return booking
    }
    
    return null
  }

  // Define handleSearch with useCallback
  const handleSearch = useCallback(() => {
    if (!pnrNumber || pnrNumber.length !== 10) {
      setError('Please enter a valid 10-digit PNR number')
      return
    }

    setLoading(true)
    setError('')

    // Simulate API call delay for better UX
    setTimeout(() => {
      // First, check in localStorage for booked PNRs
      const booking = findBookingByPNR(pnrNumber)

      if (booking) {
        // Format the booking data for display
        setPnrData({
          pnr: booking.pnr_number,
          train_number: booking.train_number,
          train_name: booking.train_name,
          journey_date: booking.journey_date,
          from_station: booking.from_station,
          to_station: booking.to_station,
          class: booking.class,
          quota: 'GN',
          passengers: booking.passengers.map(p => ({
            name: p.name,
            age: p.age,
            gender: p.gender,
            status: 'CNF',
            berth: p.berth
          })),
          chart_status: 'Prepared',
          fare: booking.total_fare
        })
      } else {
        // Mock data for demo PNRs
        const mockBookings = {
          '1234567890': {
            pnr: '1234567890',
            train_number: '12794',
            train_name: 'Rayalaseema Express',
            journey_date: new Date().toISOString().split('T')[0],
            from_station: 'SC',
            to_station: 'TPTY',
            class: '3A',
            quota: 'GN',
            passengers: [
              { name: 'John Doe', age: 28, gender: 'Male', status: 'CNF', berth: 'Lower' },
              { name: 'Jane Doe', age: 25, gender: 'Female', status: 'CNF', berth: 'Upper' }
            ],
            chart_status: 'Prepared',
            fare: 2400
          },
          '1234567891': {
            pnr: '1234567891',
            train_number: '17230',
            train_name: 'Sabari Express',
            journey_date: new Date().toISOString().split('T')[0],
            from_station: 'SC',
            to_station: 'TPTY',
            class: '2A',
            quota: 'GN',
            passengers: [
              { name: 'Alice Smith', age: 32, gender: 'Female', status: 'CNF', berth: 'Lower' }
            ],
            chart_status: 'Prepared',
            fare: 1800
          }
        }

        if (mockBookings[pnrNumber]) {
          setPnrData(mockBookings[pnrNumber])
        } else {
          setError('PNR not found. Please check the number and try again.')
        }
      }
      
      setLoading(false)
    }, 500)
  }, [pnrNumber])

  // Auto-search if PNR number is provided in state
  useEffect(() => {
    if (location.state?.pnrNumber) {
      handleSearch()
    }
  }, [location.state?.pnrNumber, handleSearch])

  const getStatusColor = (status) => {
    if (status === 'CNF' || status === 'confirmed') return 'bg-green-100 text-green-800'
    if (status === 'RAC') return 'bg-yellow-100 text-yellow-800'
    if (status === 'WL') return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">Check PNR Status</h1>
            <p className="text-indigo-100 mt-1">Enter your 10-digit PNR number</p>
          </div>

          <div className="p-6">
            <div className="max-w-md mx-auto">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={pnrNumber}
                  onChange={(e) => {
                    setPnrNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
                    setError('')
                  }}
                  placeholder="Enter 10-digit PNR"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-lg tracking-widest"
                  maxLength="10"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 min-w-[80px]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  ) : 'Check'}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <p className="mt-2 text-xs text-gray-500">Try: 1234567890, 1234567891, or your booked PNR</p>
            </div>

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {pnrData && !loading && (
              <div className="mt-8 animate-fadeIn">
                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-indigo-900">{pnrData.train_name}</h2>
                      <p className="text-indigo-700">Train No: {pnrData.train_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-indigo-600">PNR: {pnrData.pnr}</p>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Chart: {pnrData.chart_status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500">Journey Date</p>
                    <p className="font-medium">{new Date(pnrData.journey_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-medium">{pnrData.from_station}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="font-medium">{pnrData.to_station}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Class</p>
                    <p className="font-medium">{pnrData.class}</p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-3">Passenger Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">S.No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Age/Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Berth</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pnrData.passengers.map((passenger, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{passenger.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{passenger.age}/{passenger.gender}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(passenger.status || 'CNF')}`}>
                              {passenger.status || 'CNF'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{passenger.berth || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Fare:</span>
                    <span className="text-xl font-bold text-green-600">₹{pnrData.fare}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
                  >
                    Print Ticket
                  </button>
                  <button
                    onClick={() => navigate('/check-trains')}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PNR