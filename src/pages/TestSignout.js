import React from 'react'
import { useAuth } from '../context/SupabaseAuthContext'
import { useNavigate } from 'react-router-dom'

function TestSignout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      alert('Signed out successfully!')
      navigate('/')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const clearAllStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
    alert('Storage cleared!')
    window.location.reload()
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Out Test</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p className="mb-2">User: {user ? user.email : 'Not logged in'}</p>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded mr-2"
        >
          Sign Out
        </button>
        <button
          onClick={clearAllStorage}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Clear Storage
        </button>
      </div>
    </div>
  )
}

export default TestSignout