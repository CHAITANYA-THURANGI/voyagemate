import React, { useState } from 'react'

function WomenCompartment() {
  const [trainNumber, setTrainNumber] = useState('')
  const [coachInfo, setCoachInfo] = useState(null)

  const coaches = [
    { train: '12301', name: 'Rajdhani Express', womenCoaches: ['B1', 'B2', 'S1'], hasLadies: true },
    { train: '12302', name: 'Shatabdi Express', womenCoaches: ['C1', 'C2'], hasLadies: true },
    { train: '12627', name: 'Karnataka Express', womenCoaches: ['S3', 'S4'], hasLadies: true }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const found = coaches.find(c => c.train === trainNumber)
    setCoachInfo(found || { error: 'Train not found' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Women Compartment Information</h1>

        {/* Safety Banner */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-8 flex items-center">
          <span className="text-3xl mr-4">👩‍🦰</span>
          <div>
            <h2 className="font-semibold text-pink-700">Women-Only Coaches Available</h2>
            <p className="text-sm text-pink-600">Look for coaches marked with pink boards</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Train Number"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-pink-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              Check Women Compartments
            </button>
          </form>
        </div>

        {/* Results */}
        {coachInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            {coachInfo.error ? (
              <p className="text-red-600 text-center">{coachInfo.error}</p>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">{coachInfo.name}</h2>
                <p className="text-gray-600 mb-4">Train Number: {coachInfo.train}</p>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Women-Only Coaches:</h3>
                  <div className="flex flex-wrap gap-2">
                    {coachInfo.womenCoaches.map((coach, index) => (
                      <span key={index} className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg font-semibold">
                        {coach}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-pink-700">
                    <span className="font-semibold">Note:</span> Women coaches are monitored by CCTV and have female security staff onboard.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Safety Tips for Women */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Safety Tips for Women Travelers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <p className="text-gray-600">Book tickets in women-only compartments when available</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <p className="text-gray-600">Share your live location with family/friends</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <p className="text-gray-600">Use the SOS alert feature in case of emergency</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <p className="text-gray-600">Note down the coach number and train details</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <p className="text-gray-600">Keep railway helpline numbers handy</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <p className="text-gray-600">Inform TTE if you feel uncomfortable</p>
            </div>
          </div>
        </div>

        {/* Helpline Numbers */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Emergency Helpline Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">182</p>
              <p className="text-sm text-gray-600">Railway Police</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">1512</p>
              <p className="text-sm text-gray-600">Women Helpline</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">139</p>
              <p className="text-sm text-gray-600">Railway Enquiry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WomenCompartment