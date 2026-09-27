import { useState } from 'react'

// Mock train database
const trainDatabase = {
  'SC-TPTY': [
    {
      id: 1,
      number: '12794',
      name: 'Rayalaseema Express',
      departure: '17:17',
      arrival: '22:45',
      duration: '5h 28m',
      classes: ['1A', '2A', '3A', 'SL'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      id: 2,
      number: '17230',
      name: 'Sabari Express',
      departure: '12:20',
      arrival: '00:00',
      duration: '11h 40m',
      classes: ['1A', '2A', '3A', 'SL'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      id: 3,
      number: '20701',
      name: 'Vande Bharat Express',
      departure: '06:10',
      arrival: '14:35',
      duration: '8h 25m',
      classes: ['EC', 'CC'],
      days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  'NDLS-CSTM': [
    {
      id: 4,
      number: '12951',
      name: 'Mumbai Rajdhani',
      departure: '16:25',
      arrival: '08:20',
      duration: '15h 55m',
      classes: ['1A', '2A', '3A'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      id: 5,
      number: '12309',
      name: 'Rajdhani Express',
      departure: '16:00',
      arrival: '08:15',
      duration: '16h 15m',
      classes: ['1A', '2A', '3A'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  'MAS-SBC': [
    {
      id: 6,
      number: '12607',
      name: 'Lalbagh Express',
      departure: '14:50',
      arrival: '22:00',
      duration: '7h 10m',
      classes: ['CC', '2S'],
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ]
}

// Mock live status database
const liveStatusDatabase = {
  '12794': {
    current_station: 'Nizamabad (NZB)',
    next_station: 'Kamareddi (KMC)',
    delay: '15 min',
    last_updated: new Date().toLocaleTimeString(),
    route: [
      { station: 'Secunderabad (SC)', scheduled: '17:17', actual: '17:17', status: 'On Time' },
      { station: 'Nizamabad (NZB)', scheduled: '19:45', actual: '20:00', status: 'Late by 15 min' },
      { station: 'Kamareddi (KMC)', scheduled: '20:30', actual: '20:45', status: 'Late by 15 min' },
      { station: 'Tirupati (TPTY)', scheduled: '22:45', actual: '23:00', status: 'Expected' }
    ]
  }
}

export const useTrains = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Search trains between stations
  const searchTrains = async (from, to, date) => {
    setLoading(true)
    setError(null)

    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `${from}-${to}`
        const trains = trainDatabase[key] || []
        resolve(trains)
        setLoading(false)
      }, 1000)
    })
  }

  // Get live train status
  const getLiveStatus = async (trainNumber) => {
    setLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const status = liveStatusDatabase[trainNumber]
        if (status) {
          resolve(status)
        } else {
          reject(new Error('Train not found'))
        }
        setLoading(false)
      }, 1000)
    })
  }

  // Check seat availability
  const checkAvailability = async (trainNumber, date, classCode) => {
    setLoading(true)
    setError(null)

    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock availability data
        const availability = {
          '1A': { available: 12, fare: 2400 },
          '2A': { available: 24, fare: 1800 },
          '3A': { available: 48, fare: 1200 },
          'SL': { available: 120, fare: 600 },
          'CC': { available: 36, fare: 800 }
        }
        resolve(availability[classCode] || { available: 0, fare: 0 })
        setLoading(false)
      }, 1000)
    })
  }

  // Get train schedule
  const getTrainSchedule = async (trainNumber) => {
    setLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const status = liveStatusDatabase[trainNumber]
        if (status) {
          resolve(status.route)
        } else {
          reject(new Error('Train schedule not found'))
        }
        setLoading(false)
      }, 1000)
    })
  }

  return {
    loading,
    error,
    searchTrains,
    getLiveStatus,
    checkAvailability,
    getTrainSchedule
  }
}