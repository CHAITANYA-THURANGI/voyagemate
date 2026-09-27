import React, { useState } from 'react'

function FareEnquiry() {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    trainNumber: ''
  })
  const [fares, setFares] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setFares({
        trainName: 'Rajdhani Express',
        trainNumber: '12301',
        from: 'NDLS',
        to: 'HWH',
        distance: '1440 km',
        duration: '17h 05m',
        fares: [
          { class: '1A', fare: 4565, tatkal: 5235 },
          { class: '2A', fare: 2675, tatkal: 3245 },
          { class: '3A', fare: 1875, tatkal: 2235 },
          { class: 'SL', fare: 675, tatkal: 845 }
        ]
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
          Fare Enquiry
        </h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From Station</label>
                <input
                  type="text"
                  placeholder="NDLS"
                  value={formData.from}
                  onChange={(e) => setFormData({...formData, from: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To Station</label>
                <input
                  type="text"
                  placeholder="HWH"
                  value={formData.to}
                  onChange={(e) => setFormData({...formData, to: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Train Number (Optional)</label>
                <input
                  type="text"
                  placeholder="12301"
                  value={formData.trainNumber}
                  onChange={(e) => setFormData({...formData, trainNumber: e.target.value})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base font-medium hover:bg-indigo-700 transition"
            >
              {loading ? 'Checking Fares...' : 'Check Fares'}
            </button>
          </form>
        </div>

        {/* Fare Display */}
        {fares && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Train Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{fares.trainName}</h2>
                <p className="text-xs sm:text-sm text-gray-600">Train {fares.trainNumber}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-500">Distance</p>
                <p className="font-bold text-base sm:text-lg text-indigo-600">{fares.distance}</p>
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-indigo-600">From</p>
                  <p className="font-bold text-base sm:text-lg text-indigo-700">{fares.from}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600">To</p>
                  <p className="font-bold text-base sm:text-lg text-indigo-700">{fares.to}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600">Duration</p>
                  <p className="font-bold text-base sm:text-lg text-indigo-700">{fares.duration}</p>
                </div>
              </div>
            </div>

            {/* Fare Table - Horizontal scroll on mobile */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-3">Fare Details</h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Class</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Base Fare</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tatkal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {fares.fares.map((fare, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm font-medium">{fare.class}</td>
                          <td className="px-4 py-2 text-sm">₹{fare.fare}</td>
                          <td className="px-4 py-2 text-sm text-orange-600">₹{fare.tatkal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-800">
                <span className="font-semibold">Note:</span> Fares are indicative. GST and other charges may apply.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FareEnquiry