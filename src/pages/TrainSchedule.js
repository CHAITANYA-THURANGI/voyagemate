import React, { useState } from 'react'

function TrainSchedule() {
  const [trainNumber, setTrainNumber] = useState('')
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSchedule({
        trainName: 'Rajdhani Express',
        trainNumber: '12301',
        from: 'New Delhi',
        to: 'Kolkata',
        runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        stations: [
          { name: 'New Delhi', code: 'NDLS', arrival: '--', departure: '16:50', day: 1 },
          { name: 'Kanpur', code: 'CNB', arrival: '21:15', departure: '21:20', day: 1 },
          { name: 'Allahabad', code: 'ALD', arrival: '00:30', departure: '00:35', day: 2 },
          { name: 'Kolkata', code: 'KOAA', arrival: '09:55', departure: '--', day: 2 }
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
          Train Schedule
        </h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter Train Number (e.g., 12301)"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="flex-1 px-3 py-2 sm:py-3 text-sm border rounded focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-sm hover:bg-indigo-700 transition"
              >
                {loading ? 'Searching...' : 'Get Schedule'}
              </button>
            </div>
          </form>
        </div>

        {/* Schedule Display */}
        {schedule && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Train Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{schedule.trainName}</h2>
                <p className="text-xs sm:text-sm text-gray-600">Train {schedule.trainNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Runs On</p>
                <div className="flex gap-1">
                  {schedule.runsOn.map((day, idx) => (
                    <span key={idx} className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {day.charAt(0)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
              <p className="text-sm font-medium text-indigo-700">{schedule.from} → {schedule.to}</p>
            </div>

            {/* Schedule Table - Horizontal scroll on mobile */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-3">Route & Schedule</h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Station</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Code</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Arrival</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Departure</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Day</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {schedule.stations.map((station, idx) => (
                        <tr key={idx} className={idx === 0 ? 'bg-green-50' : idx === schedule.stations.length - 1 ? 'bg-red-50' : ''}>
                          <td className="px-4 py-2 text-sm whitespace-nowrap font-medium">{station.name}</td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{station.code}</td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{station.arrival}</td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{station.departure}</td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{station.day}</td>
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
                <span className="font-semibold">Note:</span> Green = Source, Red = Destination
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrainSchedule