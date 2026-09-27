import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

function Home() {
  const navigate = useNavigate()

  const features = [
    { 
      icon: '🚂', 
      title: 'Live Train Tracking', 
      description: 'Track your train in real-time',
      path: '/live-status'
    },
    { 
      icon: '🎫', 
      title: 'PNR Status', 
      description: 'Check PNR status instantly',
      path: '/pnr'
    },
    { 
      icon: '🔍', 
      title: 'Train Search', 
      description: 'Find trains between stations',
      path: '/check-trains'
    },
    { 
      icon: '💺', 
      title: 'Seat Availability', 
      description: 'Check seat availability',
      path: '/check-trains'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Chatbot />

      {/* Hero Section with Vande Bharat Background */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white overflow-hidden">
        {/* Vande Bharat Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://media.fortuneindia.com/fortune-india/import/2023-03/f965f330-128f-4fa8-8aee-80902c437541/Vande_Bharat.jpg?auto=format,compress&format=webp&w=1200&h=675&dpr=1.0&fit=cover')",
            filter: 'brightness(1)'
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-indigo-800/80"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
            <span>VoyageMate</span>
            <span className="text-4xl md:text-5xl">🚂</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Your Complete Railway Travel Companion
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto text-indigo-100">
            Book tickets, check PNR status, track trains live, and manage all your railway journeys in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/check-trains')}
              className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-indigo-600 transition transform hover:scale-105"
            >
              Search Trains
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose VoyageMate?</h2>
          <p className="text-gray-600">Everything you need for a hassle-free train journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 cursor-pointer group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Access Bar */}
        <div className="mt-12 bg-indigo-50 rounded-2xl p-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/check-trains')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            🚂 Find Trains
          </button>
          <button
            onClick={() => navigate('/pnr')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            ✅ Check PNR
          </button>
          <button
            onClick={() => navigate('/live-status')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            📍 Live Status
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home