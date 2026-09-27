import React, { useState } from 'react'

function PnrStatus() {
  const [pnr, setPnr] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setStatus({
        pnr: pnr,
        trainName: 'Rajdhani Express',
        trainNumber: '12301',
        date: '15 Mar 2025',
        from: 'NDLS',
        to: 'HWH',
        class: '3A',
        chartStatus: 'Prepared',
        passengers: [
          { name: 'John Doe', age: 28, gender: 'M', status: 'CNF', berth: 'B3, 42' },
          { name: 'Jane Doe', age: 25, gender: 'F', status: 'CNF', berth: 'B3, 43' }
        ]
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
          PNR Status Enquiry
        </h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Enter 10-digit PNR Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g., 1234567890"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength="10"
                  className="flex-1 px-3 py-2 sm:py-3 text-sm border rounded focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || pnr.length !== 10}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-sm hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Check Status'}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Enter the 10-digit PNR from your ticket</p>
            </div>
          </form>
        </div>

        {/* Status Display */}
        {status && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* PNR Header */}
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <p className="text-xs sm:text-sm text-indigo-600">PNR Number</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-700">{status.pnr}</p>
            </div>

            {/* Journey Details - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p className="text-xs text-gray-500">Train</p>
                <p className="font-semibold text-sm sm:text-base">{status.trainNumber}</p>
                <p className="text-xs text-gray-600 truncate">{status.trainName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-sm sm:text-base">{status.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">From - To</p>
                <p className="font-semibold text-sm sm:text-base">{status.from} → {status.to}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Class</p>
                <p className="font-semibold text-sm sm:text-base">{status.class}</p>
              </div>
            </div>

            {/* Chart Status */}
            <div className="bg-green-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-green-600">Chart Status</p>
              <p className="font-bold text-sm sm:text-base text-green-700">{status.chartStatus}</p>
            </div>

            {/* Passenger Details - Horizontal scroll on mobile */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-3">Passenger Details</h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Age/Gender</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Berth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {status.passengers.map((p, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{p.name}</td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{p.age}/{p.gender}</td>
                          <td className="px-4 py-2">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs whitespace-nowrap">
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{p.berth}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                Download Ticket
              </button>
              <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                Cancel Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PnrStatus