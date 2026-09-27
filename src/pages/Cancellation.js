import React, { useState } from 'react'

function Cancellation() {
  const [pnr, setPnr] = useState('')
  const [cancellation, setCancellation] = useState(null)
  const [loading, setLoading] = useState(false)

  const rules = [
    { time: '48+ hours before', refund: '75%' },
    { time: '24-48 hours before', refund: '50%' },
    { time: '12-24 hours before', refund: '25%' },
    { time: '< 12 hours before', refund: '0%' }
  ]

  const handleCheck = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setCancellation({
        pnr: pnr,
        trainName: 'Rajdhani Express',
        trainNumber: '12301',
        date: '15 Mar 2025',
        from: 'NDLS',
        to: 'HWH',
        totalFare: 3750,
        refundAmount: 2813,
        charges: 937,
        status: 'Eligible'
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
          Cancellation
        </h1>

        {/* Check PNR */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Enter PNR Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="10-digit PNR"
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
                  {loading ? 'Checking...' : 'Check'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Cancellation Details */}
        {cancellation && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cancellation Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">PNR</p>
                <p className="font-semibold text-sm">{cancellation.pnr}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Train</p>
                <p className="font-semibold text-sm">{cancellation.trainName} ({cancellation.trainNumber})</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Journey</p>
                <p className="font-semibold text-sm">{cancellation.from} → {cancellation.to}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-sm">{cancellation.date}</p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-indigo-600">Total Fare</p>
                  <p className="font-bold text-base text-indigo-700">₹{cancellation.totalFare}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600">Refund</p>
                  <p className="font-bold text-base text-green-600">₹{cancellation.refundAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-600">Charges</p>
                  <p className="font-bold text-base text-red-600">₹{cancellation.charges}</p>
                </div>
              </div>
            </div>

            <button className="w-full bg-red-600 text-white py-3 rounded text-sm font-semibold hover:bg-red-700">
              Confirm Cancellation
            </button>
          </div>
        )}

        {/* Cancellation Rules */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Cancellation Rules</h2>
          
          {/* Mobile View */}
          <div className="block sm:hidden space-y-2">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{rule.time}</span>
                <span className="font-semibold text-green-600">{rule.refund}</span>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Time of Cancellation</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Refund</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-3">{rule.time}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">{rule.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * Cancellation charges apply. Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cancellation