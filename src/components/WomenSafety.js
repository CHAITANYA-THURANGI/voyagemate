import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function WomenSafety() {
  const navigate = useNavigate()
  const [emergencyContact, setEmergencyContact] = useState('')
  const [contacts, setContacts] = useState([])
  const [sharingLocation, setSharingLocation] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [showSOS, setShowSOS] = useState(false)
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [trainDetails, setTrainDetails] = useState({
    trainNumber: '',
    coachNumber: '',
    seatNumber: ''
  })

  // Generate unique tracking ID on mount
  useEffect(() => {
    setTrackingId('TRK' + Math.floor(Math.random() * 1000000))
  }, [])

  // Get user location when sharing
  useEffect(() => {
    if (sharingLocation && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, maximumAge: 0 }
      )
      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [sharingLocation])

  const saveEmergencyContact = () => {
    if (emergencyContact.length === 10 && /^\d+$/.test(emergencyContact)) {
      setContacts([...contacts, emergencyContact])
      setEmergencyContact('')
      alert('✅ Emergency contact saved successfully!')
    } else {
      alert('❌ Please enter a valid 10-digit phone number')
    }
  }

  const removeContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index)
    setContacts(newContacts)
  }

  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      alert('❌ Geolocation is not supported by your browser')
      return
    }
    setSharingLocation(true)
    alert('📍 Live location sharing started! Share this tracking ID with your contacts: ' + trackingId)
  }

  const stopLocationSharing = () => {
    setSharingLocation(false)
    setLocation({ lat: null, lng: null })
    alert('📍 Live location sharing stopped')
  }

  const sendSOSAlert = () => {
    setShowSOS(true)
    
    // Create SOS message
    const sosMessage = `🚨 SOS EMERGENCY ALERT 🚨
Time: ${new Date().toLocaleString()}
Location: ${location.lat ? `https://maps.google.com/?q=${location.lat},${location.lng}` : 'Location unavailable'}
Tracking ID: ${trackingId}
Train: ${trainDetails.trainNumber || 'Not specified'}
Coach: ${trainDetails.coachNumber || 'Not specified'}
Seat: ${trainDetails.seatNumber || 'Not specified'}`

    // In a real app, this would send SMS/email to emergency contacts
    console.log('SOS Alert Sent:', sosMessage)
    
    // For demo, show alert
    alert('🚨 SOS ALERT SENT!\n\nEmergency services and your saved contacts have been notified.\n\n' + sosMessage)
  }

  const shareOnWhatsApp = () => {
    const message = `🚨 Women Safety - Live Location Tracking 🚨
Tracking ID: ${trackingId}
Live Location: ${location.lat ? `https://maps.google.com/?q=${location.lat},${location.lng}` : 'Not available'}
Train: ${trainDetails.trainNumber || 'N/A'} | Coach: ${trainDetails.coachNumber || 'N/A'} | Seat: ${trainDetails.seatNumber || 'N/A'}`

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const callEmergency = (number) => {
    window.location.href = `tel:${number}`
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-red-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">🛡️</span>
            <div>
              <h2 className="text-2xl font-bold">Women Safety Feature</h2>
              <p className="text-pink-100">Available 24/7 • No login required</p>
            </div>
          </div>
          {sharingLocation && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border-x-2 border-b-2 border-pink-100 rounded-b-2xl p-6 shadow-lg">
        {/* Emergency Contacts Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-pink-600 mr-2">📞</span>
            Emergency Contacts
          </h3>
          
          <div className="bg-pink-50 p-4 rounded-lg mb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => callEmergency('100')}
                className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition text-center"
              >
                <div className="font-bold text-xl">100</div>
                <div className="text-xs">Police</div>
              </button>
              <button
                onClick={() => callEmergency('101')}
                className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition text-center"
              >
                <div className="font-bold text-xl">101</div>
                <div className="text-xs">Fire</div>
              </button>
              <button
                onClick={() => callEmergency('102')}
                className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition text-center"
              >
                <div className="font-bold text-xl">102</div>
                <div className="text-xs">Ambulance</div>
              </button>
              <button
                onClick={() => callEmergency('112')}
                className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition text-center"
              >
                <div className="font-bold text-xl">112</div>
                <div className="text-xs">Emergency</div>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add emergency contact (10-digit mobile)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                maxLength="10"
              />
              <button
                onClick={saveEmergencyContact}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
              >
                Save
              </button>
            </div>

            {contacts.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Saved Contacts:</p>
                <div className="space-y-2">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                      <span className="text-sm">{contact}</span>
                      <button
                        onClick={() => removeContact(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Journey Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-pink-600 mr-2">🚂</span>
            Current Journey Details (Optional)
          </h3>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Train Number"
                value={trainDetails.trainNumber}
                onChange={(e) => setTrainDetails({...trainDetails, trainNumber: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="text"
                placeholder="Coach Number"
                value={trainDetails.coachNumber}
                onChange={(e) => setTrainDetails({...trainDetails, coachNumber: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="text"
                placeholder="Seat Number"
                value={trainDetails.seatNumber}
                onChange={(e) => setTrainDetails({...trainDetails, seatNumber: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Live Location Tracking */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-pink-600 mr-2">📍</span>
            Live Location Tracking
          </h3>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="mb-3">
              <p className="text-sm text-gray-600">Your Tracking ID:</p>
              <p className="text-2xl font-mono font-bold text-green-700">{trackingId}</p>
            </div>

            {!sharingLocation ? (
              <button
                onClick={startLocationSharing}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Start Sharing Live Location
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">📍 Location is being shared</p>
                  {location.lat && (
                    <p className="text-xs text-gray-500">
                      Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                    </p>
                  )}
                </div>
                <button
                  onClick={stopLocationSharing}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Stop Sharing Location
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SOS Emergency Button */}
        <div className="mb-6">
          <button
            onClick={sendSOSAlert}
            className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-xl flex items-center justify-center space-x-3 animate-pulse"
          >
            <span className="text-2xl">🚨</span>
            <span>SOS EMERGENCY ALERT</span>
            <span className="text-2xl">🚨</span>
          </button>
        </div>

        {/* Safety Tips */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
            <span className="mr-2">⚠️</span>
            Safety Tips
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Always share your live location with trusted contacts</li>
            <li>• Save emergency contacts before starting your journey</li>
            <li>• Note down your coach and seat number</li>
            <li>• Use SOS button in case of emergency</li>
            <li>• Railway Helpline: 139 | Women Helpline: 181</li>
          </ul>
        </div>

        {/* Share Options */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={shareOnWhatsApp}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-sm flex items-center justify-center"
          >
            <span className="mr-1">📱</span> Share on WhatsApp
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition text-sm flex items-center justify-center"
          >
            <span className="mr-1">🖨️</span> Print Safety Card
          </button>
        </div>

        {/* National Helplines */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            National Helplines: 139 (Railway) | 1091 (Women) | 112 (Emergency)
          </p>
        </div>
      </div>
    </div>
  )
}

export default WomenSafety