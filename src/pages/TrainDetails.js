import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { toast } from '../components/Toast';

function TrainDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { train, source, destination, date } = location.state || {};
  
  const [selectedClass, setSelectedClass] = useState('1A');
  const [selectedQuota, setSelectedQuota] = useState('GN');
  const [availability, setAvailability] = useState([]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [loading, setLoading] = useState(false);

  // If no train data, redirect back
  if (!train) {
    navigate('/check-trains');
    return null;
  }

  const classes = [
    { code: '1A', name: 'First AC', fare: 2400 },
    { code: '2A', name: 'Second AC', fare: 1800 },
    { code: '3A', name: 'Third AC', fare: 1200 },
    { code: 'SL', name: 'Sleeper', fare: 600 },
    { code: 'CC', name: 'Chair Car', fare: 800 }
  ];

  const quotas = [
    { code: 'GN', name: 'General' },
    { code: 'TQ', name: 'Tatkal' },
    { code: 'LD', name: 'Ladies' },
    { code: 'HO', name: 'Higher' }
  ];

  const handleCheckAvailability = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAvailability([
        { date: '25-7-2025', fare: '₹2400', status: 'GNWL11/WL3', available: 5 },
        { date: '26-7-2025', fare: '₹2400', status: 'GNWL16/WL12', available: 2 },
        { date: '27-7-2025', fare: '₹2400', status: 'GNWL15/WL8', available: 8 }
      ]);
      setShowAvailability(true);
      setLoading(false);
      toast.success('Availability fetched successfully');
    }, 1500);
  };

  const handleSelectDate = (avail) => {
    navigate('/booking', {
      state: {
        train,
        source,
        destination,
        date: avail.date,
        class: selectedClass,
        quota: selectedQuota,
        fare: avail.fare,
        status: avail.status
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Chatbot />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search Results
        </button>

        {/* Train Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {train.train_name} ({train.train_number})
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{train.departure_time}</p>
              <p className="text-lg font-medium">{source}</p>
              <p className="text-sm text-gray-500">SECUNDERABAD JN</p>
            </div>
            <div className="flex-1 mx-4 text-center">
              <p className="text-sm text-gray-500">{train.duration}</p>
              <div className="relative">
                <div className="border-t-2 border-dashed border-gray-300"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{train.arrival_time}</p>
              <p className="text-lg font-medium">{destination}</p>
              <p className="text-sm text-gray-500">TIRUPATI</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Running Days:</span>{' '}
              {train.running_days?.join(' · ') || 'Mon Tue Wed Thu Fri Sat Sun'}
            </div>
            <div>
              <span className="font-medium">Journey Date:</span> {date}
            </div>
          </div>
        </div>

        {/* Check Availability */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Check Seat Availability and Fares
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {classes.map((cls) => (
                  <option key={cls.code} value={cls.code}>
                    {cls.name} ({cls.code}) - ₹{cls.fare}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quota
              </label>
              <select
                value={selectedQuota}
                onChange={(e) => setSelectedQuota(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {quotas.map((quota) => (
                  <option key={quota.code} value={quota.code}>
                    {quota.name} ({quota.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCheckAvailability}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Availability'}
              </button>
            </div>
          </div>

          {/* Availability Results */}
          {showAvailability && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Availability for {classes.find(c => c.code === selectedClass)?.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availability.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectDate(item)}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  >
                    <p className="font-bold text-lg">{item.date}</p>
                    <p className="text-green-600 font-semibold">{item.fare}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.status}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {item.available} seats available
                    </p>
                    <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Train Route */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Train Route</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Station</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Arrival</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Departure</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Day</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">Secunderabad Junction</td>
                  <td className="px-4 py-3">SC</td>
                  <td className="px-4 py-3">-</td>
                  <td className="px-4 py-3">12:20</td>
                  <td className="px-4 py-3">1</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Nalgonda</td>
                  <td className="px-4 py-3">NLDA</td>
                  <td className="px-4 py-3">13:38</td>
                  <td className="px-4 py-3">13:40</td>
                  <td className="px-4 py-3">1</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Guntur</td>
                  <td className="px-4 py-3">GNT</td>
                  <td className="px-4 py-3">15:50</td>
                  <td className="px-4 py-3">15:52</td>
                  <td className="px-4 py-3">1</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Ongole</td>
                  <td className="px-4 py-3">OGL</td>
                  <td className="px-4 py-3">17:30</td>
                  <td className="px-4 py-3">17:32</td>
                  <td className="px-4 py-3">1</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Nellore</td>
                  <td className="px-4 py-3">NLR</td>
                  <td className="px-4 py-3">19:55</td>
                  <td className="px-4 py-3">19:57</td>
                  <td className="px-4 py-3">1</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Tirupati</td>
                  <td className="px-4 py-3">TPTY</td>
                  <td className="px-4 py-3">00:00</td>
                  <td className="px-4 py-3">-</td>
                  <td className="px-4 py-3">2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TrainDetails;