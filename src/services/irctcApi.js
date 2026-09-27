import axios from 'axios';

// Your RapidAPI key
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

// Different API hosts
const API_HOSTS = {
  PNR_STATUS: 'pnr-status-indian-railway.p.rapidapi.com',
  IRCTC_TRAIN: 'indian-railway-irctc.p.rapidapi.com',
  IRCTC_PNR: 'irctc-train-api.p.rapidapi.com'
};

// Create axios instances for different APIs
const createApiInstance = (host) => {
  return axios.create({
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': host,
      'x-rapid-api': 'rapid-api-database' 
    }
  });
};

// Initialize API instances
const pnrStatusApi = createApiInstance(API_HOSTS.PNR_STATUS);
const irctcTrainApi = createApiInstance(API_HOSTS.IRCTC_TRAIN);
const irctcPnrApi = createApiInstance(API_HOSTS.IRCTC_PNR);

// ==================== PNR Status API ====================
// Endpoint: https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/{pnr}
export const getPNRStatusV1 = async (pnrNumber) => {
  try {
    const response = await pnrStatusApi.get(`/pnr-check/${pnrNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error getting PNR status:', error);
    throw error;
  }
};

// ==================== IRCTC Train API ====================
// Get train status/live location
export const getTrainLiveStatus = async (trainNo, startDay = 0) => {
  try {
    const response = await irctcTrainApi.get('/api/trains/v1/train/status', {
      params: {
        trainNo: trainNo,
        startDay: startDay
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting train live status:', error);
    throw error;
  }
};

// Get trains between stations
export const getTrainsBetweenStations = async (fromStation, toStation) => {
  try {
    const response = await irctcTrainApi.get('/api/trains/v1/trainsBetweenStations', {
      params: {
        fromStationCode: fromStation,
        toStationCode: toStation
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting trains between stations:', error);
    throw error;
  }
};

// Get train schedule
export const getTrainSchedule = async (trainNo) => {
  try {
    const response = await irctcTrainApi.get('/api/trains/v1/train/schedule', {
      params: {
        trainNo: trainNo
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting train schedule:', error);
    throw error;
  }
};

// Get train route
export const getTrainRoute = async (trainNo) => {
  try {
    const response = await irctcTrainApi.get('/api/trains/v1/train/route', {
      params: {
        trainNo: trainNo
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting train route:', error);
    throw error;
  }
};

// Check seat availability
export const checkSeatAvailability = async (trainNo, fromStation, toStation, date, classCode, quota) => {
  try {
    const response = await irctcTrainApi.get('/api/trains/v1/checkSeatAvailability', {
      params: {
        trainNo: trainNo,
        fromStationCode: fromStation,
        toStationCode: toStation,
        date: date,
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

// Get train fare
export const getTrainFare = async (trainNo, fromStation, toStation, classCode) => {
  try {
    const response = await irctcTrainApi.get('/api/trains/v1/getFare', {
      params: {
        trainNo: trainNo,
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

// ==================== IRCTC PNR API ====================
// Get PNR status alternative endpoint
export const getPNRStatusV2 = async (pnrNo) => {
  try {
    const response = await irctcPnrApi.get('/api/v1/pnr-status', {
      params: {
        pnrNo: pnrNo
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting PNR status:', error);
    throw error;
  }
};

// ==================== Mock Data (for when API limits are reached) ====================
export const getMockTrainsBetweenStations = (fromStation, toStation) => {
  return {
    data: [
      {
        train_number: '20701',
        train_name: 'Vande Bharat Express',
        from_station: { code: fromStation, name: 'Source Station' },
        to_station: { code: toStation, name: 'Destination Station' },
        departure_time: '06:10',
        arrival_time: '14:35',
        duration: '8h 25m',
        running_days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        available_classes: ['1A', '2A', '3A', 'CC'],
        fares: { '1A': 2400, '2A': 1800, '3A': 1200, 'CC': 800 }
      },
      {
        train_number: '12789',
        train_name: 'Kacheguda - Murdeshwar SF Express',
        from_station: { code: fromStation, name: 'Source Station' },
        to_station: { code: toStation, name: 'Destination Station' },
        departure_time: '06:05',
        arrival_time: '16:40',
        duration: '10h 35m',
        running_days: ['Tue', 'Thu', 'Sat'],
        available_classes: ['2A', '3A', 'SL'],
        fares: { '2A': 1600, '3A': 1100, 'SL': 600 }
      },
      {
        train_number: '17230',
        train_name: 'Sabari Express',
        from_station: { code: fromStation, name: 'Source Station' },
        to_station: { code: toStation, name: 'Destination Station' },
        departure_time: '12:20',
        arrival_time: '00:00',
        duration: '11h 40m',
        running_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        available_classes: ['1A', '2A', '3A', 'SL'],
        fares: { '1A': 2400, '2A': 1800, '3A': 1200, 'SL': 600 }
      }
    ]
  };
};

export const getMockPNRStatus = (pnrNumber) => {
  return {
    data: {
      pnr_number: pnrNumber,
      train_number: '12794',
      train_name: 'Rayalaseema Express',
      journey_date: '25-07-2025',
      from_station: 'SC',
      to_station: 'TPTY',
      class: '1A',
      quota: 'GN',
      total_fare: 2400,
      passengers: [
        { name: 'John Doe', age: 25, gender: 'Male', booking_status: 'GNWL11/WL3', berth_preference: 'Lower' },
        { name: 'Jane Doe', age: 24, gender: 'Female', booking_status: 'GNWL12/WL4', berth_preference: 'Upper' }
      ],
      chart_status: 'NOT PREPARED'
    }
  };
};

export const getMockLiveStatus = (trainNo) => {
  return {
    data: {
      train_number: trainNo,
      train_name: 'Rayalaseema Express',
      current_status: {
        eta: '22:03',
        etd: '22:03',
        sta: '21:31',
        std: '21:31'
      },
      upcoming_station: {
        name: 'SAIDAPUR',
        code: 'SADP',
        eta: '22:09',
        sta: '21:39'
      },
      alert: 'TRAIN IS LATE',
      previous_stations: [
        { name: 'NIZAMABAD', code: 'NZB', eta: '22:09', std: '21:39' },
        { name: 'KAMAREDDI', code: 'KMC', eta: '22:10', std: '21:40' }
      ]
    }
  };
};

export const getMockAvailability = (trainNumber, date, classCode) => {
  return {
    data: {
      train_number: trainNumber,
      date: date,
      class: classCode,
      availability: [
        { date: '25-7-2025', fare: '₹2400', status: 'GNWL11/WL3', available: 5 },
        { date: '26-7-2025', fare: '₹2400', status: 'GNWL16/WL12', available: 2 },
        { date: '27-7-2025', fare: '₹2400', status: 'GNWL15/WL8', available: 8 }
      ]
    }
  };
};
// At the bottom of the file, add this named export
export { getTrainsBetweenStations as searchTrainsBetweenStations };