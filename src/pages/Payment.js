import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { booking } = location.state || {}
  const [processing, setProcessing] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)

  if (!booking) {
    navigate('/check-trains')
    return null
  }

  const handlePayment = () => {
    setProcessing(true)

    // Simulate payment processing (1.5 seconds)
    setTimeout(() => {
      setPaymentDone(true)
      setProcessing(false)
    }, 1500)
  }

  if (paymentDone) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-green-600 px-6 py-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
              <p className="text-green-100">Your ticket has been booked successfully</p>
            </div>
            <div className="p-6">
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  Your PNR Number: <span className="font-bold">{booking.pnr_number}</span>
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  ⚡ Demo Mode: This is a demonstration booking.
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <h2 className="font-bold text-lg">Booking Details</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Train:</span>
                  <span className="font-medium">{booking.train_name} ({booking.train_number})</span>
                  
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{booking.from_station}</span>
                  
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{booking.to_station}</span>
                  
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(booking.journey_date).toLocaleDateString()}</span>
                  
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">{booking.class}</span>
                  
                  <span className="text-gray-600">Passengers:</span>
                  <span className="font-medium">{booking.passenger_count}</span>
                  
                  <span className="text-gray-600">Total Fare:</span>
                  <span className="font-bold text-green-600">₹{booking.total_fare}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-lg">Passenger Details</h2>
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{passenger.name}</p>
                    <p className="text-sm text-gray-600">
                      Age: {passenger.age} | Gender: {passenger.gender} | Berth: {passenger.berth}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/check-trains')}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                >
                  Book Another Ticket
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Print Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">Payment</h1>
            <p className="text-indigo-100 mt-1">Complete your booking</p>
            <p className="text-xs text-yellow-200 mt-2">
              ⚡ Demo Mode - No actual payment required
            </p>
          </div>

          <div className="p-6">
            {/* Booking Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Train:</span>
                  <span className="font-medium">{booking.train_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PNR:</span>
                  <span className="font-mono font-bold">{booking.pnr_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Journey:</span>
                  <span className="font-medium">{booking.from_station} → {booking.to_station}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(booking.journey_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers:</span>
                  <span className="font-medium">{booking.passenger_count}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-green-600">₹{booking.total_fare}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
              <div className="border rounded-lg p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="text-gray-700">Demo Payment (No actual charge)</span>
                </label>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-lg font-medium transition"
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Payment (Demo)'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              This is a demo payment. No actual money will be charged.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Payment