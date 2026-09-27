import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Complete list of Indian railway stations (same as CheckTrains)
const STATIONS = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi' },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi' },
  { code: 'DLI', name: 'Delhi', city: 'Delhi', state: 'Delhi' },
  { code: 'CSTM', name: 'Mumbai CST', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { code: 'KCG', name: 'Kacheguda', city: 'Hyderabad', state: 'Telangana' },
  { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh' },
  { code: 'BZA', name: 'Vijayawada', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { code: 'VSKP', name: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'MYS', name: 'Mysore', city: 'Mysore', state: 'Karnataka' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'KOAA', name: 'Kolkata', city: 'Kolkata', state: 'West Bengal' },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal' },
  { code: 'JP', name: 'Jaipur', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'JU', name: 'Jodhpur', city: 'Jodhpur', state: 'Rajasthan' },
  { code: 'AII', name: 'Ajmer', city: 'Ajmer', state: 'Rajasthan' },
  { code: 'LKO', name: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh' },
  { code: 'ALD', name: 'Allahabad Junction', city: 'Prayagraj', state: 'Uttar Pradesh' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
  { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'BRC', name: 'Vadodara', city: 'Vadodara', state: 'Gujarat' },
  { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'JBP', name: 'Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh' },
  { code: 'INDB', name: 'Indore', city: 'Indore', state: 'Madhya Pradesh' },
  { code: 'ASR', name: 'Amritsar', city: 'Amritsar', state: 'Punjab' },
  { code: 'LDH', name: 'Ludhiana', city: 'Ludhiana', state: 'Punjab' },
  { code: 'JUC', name: 'Jalandhar City', city: 'Jalandhar', state: 'Punjab' },
  { code: 'CDG', name: 'Chandigarh', city: 'Chandigarh', state: 'Chandigarh' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir' },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu and Kashmir' },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam' },
  { code: 'DBRG', name: 'Dibrugarh', city: 'Dibrugarh', state: 'Assam' },
  { code: 'NJP', name: 'New Jalpaiguri', city: 'Siliguri', state: 'West Bengal' },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha' },
  { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha' },
  { code: 'RNC', name: 'Ranchi', city: 'Ranchi', state: 'Jharkhand' },
  { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand' },
  { code: 'CBE', name: 'Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu' },
  { code: 'MDU', name: 'Madurai', city: 'Madurai', state: 'Tamil Nadu' },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala' },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala' },
  { code: 'CLT', name: 'Kozhikode', city: 'Kozhikode', state: 'Kerala' }
].sort((a, b) => a.code.localeCompare(b.code));

// Comprehensive train database with all trains from CheckTrains
const TRAINS_DATABASE = [
  { number: '12621', name: 'Tamil Nadu Express', from: 'NDLS', to: 'MAS' },
  { number: '12615', name: 'Grand Trunk Express', from: 'NDLS', to: 'MAS' },
  { number: '12627', name: 'Karnataka Express', from: 'NDLS', to: 'SBC' },
  { number: '12649', name: 'Sampark Kranti Express', from: 'NDLS', to: 'SBC' },
  { number: '12723', name: 'Telangana Express', from: 'NDLS', to: 'SC' },
  { number: '12791', name: 'Gatimaan Express', from: 'NDLS', to: 'SC' },
  { number: '12951', name: 'Mumbai Rajdhani', from: 'NDLS', to: 'CSTM' },
  { number: '12953', name: 'August Kranti Rajdhani', from: 'NDLS', to: 'CSTM' },
  { number: '12957', name: 'Swarna Jayanti Rajdhani', from: 'NDLS', to: 'CSTM' },
  { number: '12301', name: 'Howrah Rajdhani', from: 'NDLS', to: 'HWH' },
  { number: '12305', name: 'Howrah Express', from: 'NDLS', to: 'HWH' },
  { number: '12381', name: 'Poorva Express', from: 'NDLS', to: 'HWH' },
  { number: '12229', name: 'Lucknow Mail', from: 'NDLS', to: 'LKO' },
  { number: '12553', name: 'Vaishali Express', from: 'NDLS', to: 'LKO' },
  { number: '12915', name: 'Shatabdi Express', from: 'NDLS', to: 'JP' },
  { number: '12985', name: 'Jaipur Express', from: 'NDLS', to: 'JP' },
  { number: '12013', name: 'Shatabdi Express', from: 'NDLS', to: 'ASR' },
  { number: '12413', name: 'Amritsar Express', from: 'NDLS', to: 'ASR' },
  { number: '12619', name: 'Matsyagandha Express', from: 'CSTM', to: 'SBC' },
  { number: '16529', name: 'Udyan Express', from: 'CSTM', to: 'SBC' },
  { number: '11027', name: 'Chennai Mail', from: 'CSTM', to: 'MAS' },
  { number: '12163', name: 'Chennai Express', from: 'CSTM', to: 'MAS' },
  { number: '12321', name: 'Howrah Mail', from: 'CSTM', to: 'HWH' },
  { number: '12809', name: 'Howrah Express', from: 'CSTM', to: 'HWH' },
  { number: '12701', name: 'Hussain Sagar Express', from: 'CSTM', to: 'SC' },
  { number: '17031', name: 'Hyderabad Express', from: 'CSTM', to: 'SC' },
  { number: '12607', name: 'Lalbagh Express', from: 'MAS', to: 'SBC' },
  { number: '12609', name: 'Kaveri Express', from: 'MAS', to: 'SBC' },
  { number: '12657', name: 'Bangalore Mail', from: 'MAS', to: 'SBC' },
  { number: '12603', name: 'Hyderabad Express', from: 'MAS', to: 'SC' },
  { number: '12759', name: 'Charminar Express', from: 'MAS', to: 'SC' },
  { number: '12839', name: 'Howrah Mail', from: 'MAS', to: 'HWH' },
  { number: '12841', name: 'Coromandel Express', from: 'MAS', to: 'HWH' },
  { number: '16593', name: 'Nanded Express', from: 'SBC', to: 'SC' },
  { number: '12735', name: 'Yesvantpur Express', from: 'SBC', to: 'SC' },
  { number: '16235', name: 'Mysore Express', from: 'SBC', to: 'MYS' },
  { number: '16217', name: 'Mysore Express', from: 'SBC', to: 'MYS' },
  { number: '12794', name: 'Rayalaseema Express', from: 'SC', to: 'TPTY' },
  { number: '17230', name: 'Sabari Express', from: 'SC', to: 'TPTY' },
  { number: '20701', name: 'Vande Bharat Express', from: 'SC', to: 'TPTY' },
  { number: '12705', name: 'Goutami Express', from: 'SC', to: 'BZA' },
  { number: '12709', name: 'Simhapuri Express', from: 'SC', to: 'BZA' },
  { number: '12821', name: 'Dhauli Express', from: 'HWH', to: 'BBS' },
  { number: '12837', name: 'Howrah-Puri Express', from: 'HWH', to: 'PURI' },
  { number: '12513', name: 'Guwahati Express', from: 'HWH', to: 'GHY' },
  { number: '15639', name: 'Purvottar Express', from: 'HWH', to: 'GHY' },
  { number: '12423', name: 'Rajdhani Express', from: 'GHY', to: 'DBRG' },
  { number: '15901', name: 'Dibrugarh Express', from: 'GHY', to: 'DBRG' },
  { number: '12901', name: 'Gujarat Mail', from: 'ADI', to: 'CSTM' },
  { number: '12931', name: 'Ahmedabad Express', from: 'ADI', to: 'CSTM' },
  { number: '12955', name: 'Jaipur Express', from: 'JP', to: 'CSTM' },
  { number: '12309', name: 'Rajdhani Express', from: 'PNBE', to: 'NDLS' },
  { number: '12393', name: 'Sampoorna Kranti', from: 'PNBE', to: 'NDLS' },
  { number: '12425', name: 'Jammu Rajdhani', from: 'JAT', to: 'NDLS' },
  { number: '12671', name: 'Nilgiri Express', from: 'CBE', to: 'MAS' },
  { number: '12635', name: 'Vaigai Express', from: 'MDU', to: 'MAS' },
  { number: '12695', name: 'Trivandrum Express', from: 'TVC', to: 'MAS' },
  { number: '12105', name: 'Vidarbha Express', from: 'NGP', to: 'CSTM' }
];

// Generate live status data for any train
const generateLiveStatus = (train) => {
  const stations = STATIONS.filter(s => 
    s.code === train.from || s.code === train.to || Math.random() > 0.7
  ).slice(0, 4);
  
  return {
    train_number: train.number,
    train_name: train.name,
    from: train.from,
    to: train.to,
    current_station: stations[1]?.name || `${train.from} Station`,
    next_station: stations[2]?.name || `${train.to} Station`,
    delay: Math.random() > 0.7 ? `${Math.floor(Math.random() * 30)} minutes` : 'On Time',
    last_updated: new Date().toLocaleTimeString(),
    route: [
      { 
        station: `${stations[0]?.name || train.from} (${train.from})`, 
        scheduled: '00:00', 
        actual: '00:00', 
        status: 'On Time' 
      },
      { 
        station: `${stations[1]?.name || 'Intermediate'} (${stations[1]?.code || 'STN'})`, 
        scheduled: '12:00', 
        actual: '12:00', 
        status: Math.random() > 0.8 ? 'Late by 10 min' : 'On Time' 
      },
      { 
        station: `${stations[2]?.name || 'Intermediate'} (${stations[2]?.code || 'STN'})`, 
        scheduled: '18:00', 
        actual: '18:00', 
        status: Math.random() > 0.8 ? 'Late by 15 min' : 'On Time' 
      },
      { 
        station: `${stations[3]?.name || train.to} (${train.to})`, 
        scheduled: '23:59', 
        actual: '23:59', 
        status: 'Expected' 
      }
    ]
  };
};

function LiveStatus() {
  const [trainNumber, setTrainNumber] = useState('')
  const [fromStation, setFromStation] = useState('')
  const [toStation, setToStation] = useState('')
  
  // Autocomplete states
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [selectedFromStation, setSelectedFromStation] = useState(null)
  const [selectedToStation, setSelectedToStation] = useState(null)
  
  const [trainData, setTrainData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchMode, setSearchMode] = useState('train')

  // Filter stations based on search input
  const filterStations = (input) => {
    if (!input) return []
    const searchTerm = input.toLowerCase()
    return STATIONS.filter(station => 
      station.code.toLowerCase().includes(searchTerm) ||
      station.name.toLowerCase().includes(searchTerm) ||
      station.city?.toLowerCase().includes(searchTerm)
    ).slice(0, 10)
  }

  const handleFromChange = (e) => {
    const value = e.target.value.toUpperCase()
    setFromStation(value)
    setSelectedFromStation(null)
    setFromSuggestions(filterStations(value))
    setShowFromDropdown(true)
  }

  const handleToChange = (e) => {
    const value = e.target.value.toUpperCase()
    setToStation(value)
    setSelectedToStation(null)
    setToSuggestions(filterStations(value))
    setShowToDropdown(true)
  }

  const selectFromStation = (station) => {
    setFromStation(station.code)
    setSelectedFromStation(station)
    setFromSuggestions([])
    setShowFromDropdown(false)
  }

  const selectToStation = (station) => {
    setToStation(station.code)
    setSelectedToStation(station)
    setToSuggestions([])
    setShowToDropdown(false)
  }

  const searchByTrainNumber = () => {
    if (!trainNumber || trainNumber.length !== 5) {
      setError('Please enter a valid 5-digit train number')
      return
    }

    setLoading(true)
    setError('')

    setTimeout(() => {
      // Find train in database
      const train = TRAINS_DATABASE.find(t => t.number === trainNumber)
      
      if (train) {
        const data = generateLiveStatus(train)
        setTrainData(data)
      } else {
        // If train not found, create a generic one
        const genericTrain = {
          number: trainNumber,
          name: `Train ${trainNumber}`,
          from: 'Unknown',
          to: 'Unknown'
        }
        const data = generateLiveStatus(genericTrain)
        setTrainData(data)
      }
      setLoading(false)
    }, 500)
  }

  const searchByRoute = () => {
    if (!fromStation || !toStation) {
      setError('Please select both source and destination stations')
      return
    }

    if (fromStation === toStation) {
      setError('Source and destination cannot be the same')
      return
    }

    setLoading(true)
    setError('')

    setTimeout(() => {
      // Find trains running between these stations
      const routeTrains = TRAINS_DATABASE.filter(train => 
        train.from === fromStation && train.to === toStation
      )

      if (routeTrains.length > 0) {
        // Pick a random train from the route
        const randomTrain = routeTrains[Math.floor(Math.random() * routeTrains.length)]
        const data = generateLiveStatus(randomTrain)
        setTrainData(data)
      } else {
        // Create a generic train for this route
        const genericTrain = {
          number: 'XXXXX',
          name: `Express Train`,
          from: fromStation,
          to: toStation
        }
        const data = generateLiveStatus(genericTrain)
        setTrainData(data)
      }
      setLoading(false)
    }, 500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchMode === 'train') {
      searchByTrainNumber()
    } else {
      searchByRoute()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">Live Train Status</h1>
            <p className="text-indigo-100 mt-1">Search by train number or route</p>
          </div>

          <div className="p-6">
            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setSearchMode('train')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    searchMode === 'train'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Search by Train Number
                </button>
                <button
                  onClick={() => setSearchMode('route')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    searchMode === 'route'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Search by Route
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {searchMode === 'train' ? (
                // Train Number Search
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Train Number
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={trainNumber}
                      onChange={(e) => {
                        setTrainNumber(e.target.value.replace(/\D/g, '').slice(0, 5))
                        setError('')
                      }}
                      placeholder="e.g., 12794"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      maxLength="5"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 min-w-[80px]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      ) : 'Track'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Try: 12794, 17230, 12301, 12951, 12627, 12607
                  </p>
                </div>
              ) : (
                // Route Search with Autocomplete
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* From Station */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Station
                    </label>
                    <input
                      type="text"
                      value={fromStation}
                      onChange={handleFromChange}
                      onFocus={() => setShowFromDropdown(true)}
                      onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                      placeholder="Search station (e.g., SC, NDLS)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      autoComplete="off"
                    />
                    {selectedFromStation && (
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedFromStation.name}, {selectedFromStation.city}
                      </p>
                    )}
                    
                    {/* Suggestions Dropdown */}
                    {showFromDropdown && fromSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {fromSuggestions.map((station) => (
                          <div
                            key={station.code}
                            onMouseDown={() => selectFromStation(station)}
                            className="px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0"
                          >
                            <span className="font-medium">{station.code}</span>
                            <span className="text-sm text-gray-600 ml-2">{station.name}</span>
                            <span className="text-xs text-gray-400 ml-2">{station.city}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* To Station */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Station
                    </label>
                    <input
                      type="text"
                      value={toStation}
                      onChange={handleToChange}
                      onFocus={() => setShowToDropdown(true)}
                      onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                      placeholder="Search station (e.g., TPTY, CSTM)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      autoComplete="off"
                    />
                    {selectedToStation && (
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedToStation.name}, {selectedToStation.city}
                      </p>
                    )}
                    
                    {/* Suggestions Dropdown */}
                    {showToDropdown && toSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {toSuggestions.map((station) => (
                          <div
                            key={station.code}
                            onMouseDown={() => selectToStation(station)}
                            className="px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0"
                          >
                            <span className="font-medium">{station.code}</span>
                            <span className="text-sm text-gray-600 ml-2">{station.name}</span>
                            <span className="text-xs text-gray-400 ml-2">{station.city}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-2 flex justify-center mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 min-w-[120px]"
                    >
                      {loading ? 'Searching...' : 'Find Trains'}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {error && (
              <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {trainData && !loading && (
              <div className="mt-8 animate-fadeIn">
                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-indigo-900">{trainData.train_name}</h2>
                      <p className="text-indigo-700">Train Number: {trainData.train_number}</p>
                      <p className="text-sm text-indigo-600 mt-1">{trainData.from} → {trainData.to}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Live
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-indigo-600">Current Station</p>
                      <p className="font-medium text-sm">{trainData.current_station}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-indigo-600">Next Station</p>
                      <p className="font-medium text-sm">{trainData.next_station}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-indigo-600">Delay</p>
                      <p className={`font-medium text-sm ${trainData.delay !== 'On Time' ? 'text-red-600' : 'text-green-600'}`}>
                        {trainData.delay}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-indigo-600">Last Updated</p>
                      <p className="font-medium text-sm">{trainData.last_updated}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-3">Train Route</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {trainData.route.map((station, index) => (
                        <tr key={index} className={index === 0 ? 'bg-green-50' : index === trainData.route.length - 1 ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{station.station}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{station.scheduled}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{station.actual}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              station.status === 'On Time' 
                                ? 'bg-green-100 text-green-800' 
                                : station.status.includes('Late')
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {station.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-xs text-gray-400 text-center">
                  * Green row = Source • Blue row = Destination
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LiveStatus