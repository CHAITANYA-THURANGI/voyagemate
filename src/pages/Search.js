import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import Loader from '../components/Loader';

function Search() {
  const navigate = useNavigate();
  const [trainNumber, setTrainNumber] = useState('');
  const [trainData, setTrainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!trainNumber || trainNumber.length !== 5) {
      setError('Please enter a valid 5-digit train number');
      return;
    }

    setLoading(true);
    setError('');
    setTrainData(null);

    // Mock data for demonstration
    setTimeout(() => {
      setTrainData({
        train_number: trainNumber,
        train_name: 'Vande Bharat Express',
        from: 'SC',
        to: 'TPTY',
        departure_time: '06:10',
        arrival_time: '14:35',
        duration: '8h 25m',
        running_days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        classes: ['1A', '2A', '3A', 'SL'],
        route: [
          { station: 'SECUNDERABAD JN', code: 'SC', arrival: 'Source', departure: '06:10', day: 1 },
          { station: 'NALGONDA', code: 'NLDA', arrival: '07:38', departure: '07:40', day: 1 },
          { station: 'GUNTUR', code: 'GNT', arrival: '09:50', departure: '09:52', day: 1 },
          { station: 'ONGOLE', code: 'OGL', arrival: '11:30', departure: '11:32', day: 1 },
          { station: 'NELLORE', code: 'NLR', arrival: '12:55', departure: '12:57', day: 1 },
          { station: 'TIRUPATI', code: 'TPTY', arrival: '14:35', departure: 'Destination', day: 1 }
        ]
      });
      setLoading(false);
    }, 1500);

    // Uncomment for actual API call
    /*
    const options = {
      method: 'GET',
      url: 'https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status',
      params: { trainNo: trainNumber },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY,
        'x-rapidapi-host': 'indian-railway-irctc.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      if (response.data && response.data.status) {
        setTrainData(response.data);
      } else {
        setError('Train details not found for this number.');
      }
    } catch (err) {
      setError('API Error: You may have used your monthly trials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Chatbot />

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 text-blue-600 font-bold hover:underline flex items-center gap-2"
          >
            ← Back to Home
          </button>

          <h1 className="text-3xl font-bold text-center mb-8">Track Your Train</h1>

          {/* Search Input */}
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-4">Enter journey details</h2>
            <input
              type="text"
              value={trainNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                setTrainNumber(value);
                setError('');
              }}
              placeholder="Enter 5-digit Train Number"
              className="w-full p-4 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl"
              maxLength="5"
            />
            
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
            )}

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Get Live Status'}
            </button>
          </div>

          {/* Loading State */}
          {loading && <Loader />}

          {/* Results Display - Matching video */}
          {trainData && !loading && (
            <div className="bg-white p-6 rounded-xl shadow-xl">
              {/* Train Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{trainData.train_name} ({trainData.train_number})</h3>
                  <p className="text-gray-600">{trainData.from} → {trainData.to}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  Live Status
                </span>
              </div>

              {/* Journey Info */}
              <div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">{trainData.departure_time}</p>
                  <p className="text-sm text-gray-600">{trainData.from}</p>
                </div>
                <div className="flex-1 mx-4 text-center">
                  <p className="text-sm text-gray-500">{trainData.duration}</p>
                  <div className="border-t-2 border-dashed border-gray-300 my-2"></div>
                  <p className="text-xs text-gray-400">Runs on: {trainData.running_days.join(' | ')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{trainData.arrival_time}</p>
                  <p className="text-sm text-gray-600">{trainData.to}</p>
                </div>
              </div>

              {/* Route Table */}
              <div>
                <h4 className="font-bold mb-3">Route & Schedule</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-sm">
                        <th className="p-3 border">Station</th>
                        <th className="p-3 border">Code</th>
                        <th className="p-3 border">Arrival</th>
                        <th className="p-3 border">Departure</th>
                        <th className="p-3 border">Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainData.route.map((stop, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 border font-medium">{stop.station}</td>
                          <td className="p-3 border">{stop.code}</td>
                          <td className="p-3 border">{stop.arrival}</td>
                          <td className="p-3 border">{stop.departure}</td>
                          <td className="p-3 border">{stop.day}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Search;