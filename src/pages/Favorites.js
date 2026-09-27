import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { toast } from '../components/Toast';
import { db, doc, getDoc } from '../firebase';

function Favorites() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { removeFromFavorites } = useBookings();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setFavorites(userDoc.data().favoriteTrains || []);
      }
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (trainNumber) => {
    try {
      await removeFromFavorites(trainNumber);
      setFavorites(favorites.filter(f => f.trainNumber !== trainNumber));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  const popularTrains = [
    {
      trainNumber: '20701',
      trainName: 'Vande Bharat Express',
      from: 'NDLS',
      to: 'VGLB',
      departure: '06:00',
      arrival: '14:35',
      duration: '8h 35m',
      days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      trainNumber: '12301',
      trainName: 'Howrah Rajdhani',
      from: 'NDLS',
      to: 'HWH',
      departure: '16:50',
      arrival: '10:05',
      duration: '17h 15m',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani',
      from: 'NDLS',
      to: 'MMCT',
      departure: '16:25',
      arrival: '08:20',
      duration: '15h 55m',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Chatbot />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorite Trains</h1>
          <p className="text-gray-600">Quick access to your most-loved trains</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* My Favorites */}
            {favorites.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Favorites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((train, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Train Number</span>
                          <p className="text-xl font-bold text-blue-600">{train.trainNumber}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(train.trainNumber)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{train.trainName}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-bold">{train.departure || '06:00'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">{train.duration || '8h 35m'}</p>
                          <div className="border-t border-dashed border-gray-300 w-16"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Arrival</p>
                          <p className="font-bold">{train.arrival || '14:35'}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{train.from} → {train.to}</p>
                      <button
                        onClick={() => navigate('/check-trains', { state: { train } })}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Trains */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Trains</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularTrains.map((train, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Train Number</span>
                      <p className="text-xl font-bold text-blue-600">{train.trainNumber}</p>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{train.trainName}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-bold">{train.departure}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">{train.duration}</p>
                        <div className="border-t border-dashed border-gray-300 w-16"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Arrival</p>
                        <p className="font-bold">{train.arrival}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{train.from} → {train.to}</p>
                    <p className="text-xs text-gray-400 mb-3">Runs on: {train.days.join(' · ')}</p>
                    <button
                      onClick={() => navigate('/check-trains', { state: { train } })}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Check Availability
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {favorites.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No favorite trains yet</h3>
                <p className="text-gray-600 mb-6">Start adding trains to your favorites for quick access.</p>
                <button
                  onClick={() => navigate('/check-trains')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Explore Trains
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Favorites;