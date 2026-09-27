import React from 'react'

function SafetyTips() {
  const tips = [
    {
      category: 'Before Journey',
      icon: '📝',
      tips: [
        'Share your itinerary with family members',
        'Save emergency contacts in your phone',
        'Book confirmed tickets in advance',
        'Note down your coach and seat number',
        'Keep ID proof handy'
      ]
    },
    {
      category: 'During Journey',
      icon: '🚂',
      tips: [
        'Be aware of your surroundings',
        'Keep valuables in secure bags',
        'Use chain pulling only in emergency',
        'Inform TTE about any suspicious activity',
        'Travel in well-lit compartments'
      ]
    },
    {
      category: 'Emergency',
      icon: '🆘',
      tips: [
        'Dial 182 for Railway Police',
        'Use SOS feature on this app',
        'Alert nearby passengers if needed',
        'Note down the coach number',
        'Do not panic, stay calm'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Women Safety Tips</h1>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-8 mb-8 text-center">
          <div className="text-6xl mb-4">👩‍🦰</div>
          <h2 className="text-2xl font-bold mb-2">Your Safety is Our Priority</h2>
          <p className="text-pink-100">Follow these tips for a safe and comfortable journey</p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tips.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl mb-4">{section.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{section.category}</h3>
              <ul className="space-y-3">
                {section.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    <span className="text-gray-600 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">182</p>
              <p className="text-sm text-gray-600">Railway Police</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">1512</p>
              <p className="text-sm text-gray-600">Women Helpline</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">139</p>
              <p className="text-sm text-gray-600">Railway Enquiry</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">112</p>
              <p className="text-sm text-gray-600">Emergency</p>
            </div>
          </div>
        </div>

        {/* SOS Button */}
        <div className="mt-8 text-center">
          <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition transform hover:scale-105">
            🆘 SOS Emergency Alert
          </button>
          <p className="text-sm text-gray-500 mt-2">Click for immediate help</p>
        </div>
      </div>
    </div>
  )
}

export default SafetyTips