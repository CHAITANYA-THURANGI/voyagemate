import React, { useState } from 'react'

function StationInfo() {
  const [stationCode, setStationCode] = useState('')
  const [station, setStation] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setStation({
        code: 'NDLS',
        name: 'New Delhi Railway Station',
        zone: 'Northern Railway',
        state: 'Delhi',
        address: 'Paharganj, New Delhi',
        platforms: 16,
        facilities: ['Waiting Room', 'Food Court', 'ATM', 'WiFi', 'Medical Room', 'Cloak Room', 'Lift', 'Escalator']
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
          Station Information
        </h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Enter Station Code
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g., NDLS"
                  value={stationCode}
                  onChange={(e) => setStationCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 sm:py-3 text-sm border rounded focus:outline-none focus:border-indigo-500 uppercase"
                  maxLength="5"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-sm hover:bg-indigo-700 transition"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Enter station code (e.g., NDLS for New Delhi)</p>
            </div>
          </form>
        </div>

        {/* Station Info Display */}
        {station && (
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{station.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-start space-x-2">
                  <span className="text-indigo-600 text-lg">📍</span>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">{station.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-indigo-600 text-lg">🏢</span>
                  <div>
                    <p className="text-xs text-gray-500">Zone</p>
                    <p className="text-sm">{station.zone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-indigo-600 text-lg">🚂</span>
                  <div>
                    <p className="text-xs text-gray-500">Platforms</p>
                    <p className="text-sm">{station.platforms}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-indigo-600 text-lg">🗺️</span>
                  <div>
                    <p className="text-xs text-gray-500">State</p>
                    <p className="text-sm">{station.state}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base mb-3">Facilities Available</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {station.facilities.map((facility, idx) => (
                  <div key={idx} className="flex items-center space-x-1 bg-gray-50 p-2 rounded">
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-xs sm:text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base mb-3">Station Location</h3>
              <div className="bg-gray-200 h-32 sm:h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">Map view coming soon</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StationInfo