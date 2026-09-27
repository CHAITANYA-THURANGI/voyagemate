import React, { useState } from 'react'

function SeatAvailability() {
  const [formData, setFormData] = useState({
    trainNumber: '',
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    class: '3A'
  })
  const [availability, setAvailability] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setAvailability([
        { date: '15 Mar 2025', status: 'Available', seats: 120, quota: 'GN' },
        { date: '16 Mar 2025', status: 'Available', seats: 95, quota: 'GN' },
        { date: '17 Mar 2025', status: 'RAC', seats: 12, quota: 'GN' },
        { date: '18 Mar 2025', status: 'Available', seats: 150, quota: 'GN' },
        { date: '19 Mar 2025', status: 'Waiting', seats: 0, quota: 'GN' }
      ])
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-700'
      case 'RAC': return 'bg-yellow-100 text-yellow-700'
      case 'Waiting': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
          Seat Availability
        </h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Train No.</label>
                <input
                  type="text"
                  placeholder="12301"
                  value={formData.trainNumber}
                  onChange={(e) => setFormData({...formData, trainNumber: e.target.value})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="text"
                  placeholder="NDLS"
                  value={formData.from}
                  onChange={(e) => setFormData({...formData, from: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="text"
                  placeholder="HWH"
                  value={formData.to}
                  onChange={(e) => setFormData({...formData, to: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
                >
                  <option value="1A">First AC</option>
                  <option value="2A">Second AC</option>
                  <option value="3A">Third AC</option>
                  <option value="SL">Sleeper</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base font-medium hover:bg-indigo-700 transition"
            >
              {loading ? 'Checking...' : 'Check Availability'}
            </button>
          </form>
        </div>

        {/* Availability Display */}
        {availability && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="font-semibold text-base sm:text-lg mb-4">Next 5 Days Availability</h2>
            
            {/* Mobile View - Cards */}
            <div className="block sm:hidden space-y-3">
              {availability.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.date}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seats: {item.seats}</span>
                    <span className="text-gray-600">Quota: {item.quota}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Available Seats</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quota</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-3">{item.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{item.seats}</td>
                      <td className="px-4 py-3">{item.quota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeatAvailability