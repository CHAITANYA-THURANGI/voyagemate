import axios from 'axios';

// Your RapidAPI key
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

// Base URLs for different APIs
const API_HOSTS = {
  IRCTC: 'irctc1.p.rapidapi.com',
  RAILWAY: 'indian-railway-irctc.p.rapidapi.com',
  TRAIN: 'train-railway-indian-irctc.p.rapidapi.com'
};

// Create axios instance with default config
const createApiClient = (host) => {
  return axios.create({
    baseURL: `https://${host}`,
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': host
    }
  });
};

// Initialize API clients
const irctcApi = createApiClient(API_HOSTS.IRCTC);
const railwayApi = createApiClient(API_HOSTS.RAILWAY);
const trainApi = createApiClient(API_HOSTS.TRAIN);

// Search trains between stations
export const searchTrainsBetweenStations = async (fromStation, toStation, date) => {
  try {
    // Format date to DD-MM-YYYY
    const formattedDate = date.split('-').reverse().join('-');
    
    const response = await irctcApi.get('/api/v3/trainBetweenStations', {
      params: {
        fromStationCode: fromStation,
        toStationCode: toStation,
        date: formattedDate
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching trains:', error);
    throw error;
  }
};

// Get train schedule
export const getTrainSchedule = async (trainNumber) => {
  try {
    const response = await irctcApi.get('/api/v1/getTrainSchedule', {
      params: {
        trainNo: trainNumber
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting train schedule:', error);
    throw error;
  }
};

// Get live train status
export const getLiveTrainStatus = async (trainNumber, date) => {
  try {
    const formattedDate = date.split('-').reverse().join('-');
    
    const response = await irctcApi.get('/api/v1/liveTrainStatus', {
      params: {
        trainNo: trainNumber,
        date: formattedDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting live status:', error);
    throw error;
  }
};

// Check seat availability
export const checkSeatAvailability = async (trainNumber, fromStation, toStation, date, classCode, quota = 'GN') => {
  try {
    const formattedDate = date.split('-').reverse().join('-');
    
    const response = await irctcApi.get('/api/v3/checkSeatAvailability', {
      params: {
        trainNo: trainNumber,
        fromStationCode: fromStation,
        toStationCode: toStation,
        date: formattedDate,
        classCode: classCode,
        quotaCode: quota
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking seat availability:', error);
    throw error;
  }
};

// Get PNR status
export const getPNRStatus = async (pnrNumber) => {
  try {
    const response = await irctcApi.get('/api/v3/getPNRStatus', {
      params: {
        pnrNo: pnrNumber
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting PNR status:', error);
    throw error;
  }
};

// Get train fare
export const getTrainFare = async (trainNumber, fromStation, toStation, classCode) => {
  try {
    const response = await irctcApi.get('/api/v3/getTrainFare', {
      params: {
        trainNo: trainNumber,
        fromStationCode: fromStation,
        toStationCode: toStation,
        classCode: classCode
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting train fare:', error);
    throw error;
  }
};

// Get station list
export const getStations = async (query) => {
  try {
    const response = await irctcApi.get('/api/v1/searchStation', {
      params: {
        query: query
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stations:', error);
    throw error;
  }
};

// Mock data for fallback when API fails
export const getMockTrains = (from, to) => {
  const mockTrains = {
    'SC-TPTY': [
      {
        train_number: '12794',
        train_name: 'Rayalaseema Express',
        from: 'SC',
        to: 'TPTY',
        departure: '17:17',
        arrival: '22:45',
        duration: '5h 28m',
        classes: ['1A', '2A', '3A', 'SL'],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        fare: { '1A': 2400, '2A': 1800, '3A': 1200, 'SL': 600 }
      },
      {
        train_number: '17230',
        train_name: 'Sabari Express',
        from: 'SC',
        to: 'TPTY',
        departure: '12:20',
        arrival: '00:00',
        duration: '11h 40m',
        classes: ['1A', '2A', '3A', 'SL'],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        fare: { '1A': 2400, '2A': 1800, '3A': 1200, 'SL': 600 }
      }
    ],
    'NDLS-CSTM': [
      {
        train_number: '12951',
        train_name: 'Mumbai Rajdhani',
        from: 'NDLS',
        to: 'CSTM',
        departure: '16:25',
        arrival: '08:20',
        duration: '15h 55m',
        classes: ['1A', '2A', '3A'],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        fare: { '1A': 4800, '2A': 3200, '3A': 2200 }
      }
    ],
    'MAS-SBC': [
      {
        train_number: '12607',
        train_name: 'Lalbagh Express',
        from: 'MAS',
        to: 'SBC',
        departure: '14:50',
        arrival: '22:00',
        duration: '7h 10m',
        classes: ['CC', '2S'],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        fare: { 'CC': 800, '2S': 400 }
      }
    ]
  };
  
  const key = `${from}-${to}`;
  return mockTrains[key] || [];
};