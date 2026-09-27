import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/SupabaseAuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WomenSafety from '../components/WomenSafety'

function Services() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showSafety, setShowSafety] = useState(false)

  const services = [
    {
      icon: '🚂',
      title: 'Live Train Tracking',
      description: 'Track your train in real-time with live location updates',
      action: '/live-status',
      color: 'bg-blue-50',
      working: true
    },
    {
      icon: '🎫',
      title: 'PNR Status',
      description: 'Check your PNR status instantly with detailed passenger info',
      action: '/pnr',
      color: 'bg-green-50',
      working: true
    },
    {
      icon: '🔍',
      title: 'Train Search',
      description: 'Find trains between any two stations in India',
      action: '/check-trains',
      color: 'bg-yellow-50',
      working: true
    },
    {
      icon: '💺',
      title: 'Seat Availability',
      description: 'Check seat availability and fare details for your journey',
      action: '/check-trains',
      color: 'bg-purple-50',
      working: true,
      onClick: () => navigate('/check-trains', { state: { checkAvailability: true } })
    },
    {
      icon: '📅',
      title: 'Journey History',
      description: 'Keep track of all your past and upcoming journeys',
      action: '/dashboard',
      color: 'bg-pink-50',
      working: true
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries',
      action: '/contact',
      color: 'bg-indigo-50',
      working: true
    },
    {
      icon: '👤',
      title: 'Personalized Dashboard',
      description: 'Your personal space with journey history and recommendations',
      action: '/dashboard',
      color: 'bg-orange-50',
      working: true
    },
    {
      icon: '🚆',
      title: 'Train Recommendations',
      description: 'Get personalized train recommendations based on your travel patterns',
      action: '/dashboard',
      color: 'bg-teal-50',
      working: true
    },
    {
      icon: '🛡️',
      title: 'Women Safety',
      description: 'Special safety features for women travelers including live location sharing and SOS alerts',
      action: '#safety',
      color: 'bg-red-50',
      working: true,
      highlight: true,
      onClick: () => {
        if (!user) {
          if (window.confirm('Please login to use Women Safety feature')) {
            navigate('/login')
          }
        } else {
          setShowSafety(!showSafety)
        }
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
          <p className="text-gray-600">Comprehensive railway services at your fingertips</p>
        </div>

        {/* Women Safety Section */}
        {showSafety && user && (
          <div className="mb-8" id="safety">
            <WomenSafety userId={user.id} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={service.onClick || (() => navigate(service.action))}
              className={`${service.color} p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 ${
                service.highlight ? 'ring-2 ring-red-400' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl mb-3">{service.icon}</div>
                {service.working && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
              
              {service.title === 'Women Safety' && (
                <div className="mt-3 flex items-center text-xs text-pink-600">
                  <span className="mr-1">🛡️</span>
                  SOS • Live Location • Emergency Contacts
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Women Safety Banner */}
        <div className="mt-12 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <span className="mr-2">🛡️</span>
                Women Safety Feature
              </h2>
              <p className="text-pink-100">
                Real-time location sharing • SOS alerts • Emergency contacts • 24/7 monitoring
              </p>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login')
                } else {
                  setShowSafety(!showSafety)
                }
              }}
              className="px-6 py-3 bg-white text-pink-600 rounded-lg font-medium hover:bg-pink-50 transition"
            >
              {user ? 'Activate Safety Mode' : 'Login to Access'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Services