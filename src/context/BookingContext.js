import React, { createContext, useState, useContext } from 'react';
import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from '../firebase';
import { useAuth } from './AuthContext';
import { 
  getTrainsBetweenStations,
  getTrainLiveStatus,
  getPNRStatusV1,
  getPNRStatusV2,
  checkSeatAvailability,
  getTrainRoute,
  getMockTrainsBetweenStations,
  getMockPNRStatus,
  getMockLiveStatus,
  getMockAvailability
} from '../services/irctcApi';

const BookingContext = createContext();

export function useBookings() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiCalls, setApiCalls] = useState({
    trainSearch: 0,
    pnrCheck: 0,
    liveStatus: 0,
    availability: 0
  });
  const { currentUser } = useAuth();

  // Track API calls (for demo purposes)
  const trackApiCall = (type) => {
    setApiCalls(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  // Search trains between stations with fallback to mock data
  async function searchTrains(source, destination, date) {
    setLoading(true);
    trackApiCall('trainSearch');
    
    try {
      // Try real API first (limited to 10 calls per month)
      const response = await getTrainsBetweenStations(source, destination);
      
      // Transform API response
      const trains = response.data.map(train => ({
        train_number: train.train_number,
        train_name: train.train_name,
        from: train.from_station.code,
        to: train.to_station.code,
        departure_time: train.departure_time,
        arrival_time: train.arrival_time,
        duration: train.duration,
        available_classes: train.available_classes || ['1A', '2A', '3A', 'SL'],
        fares: train.fares || { '1A': 2400, '2A': 1800, '3A': 1200, 'SL': 600 },
        running_days: train.running_days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }));
      
      setLoading(false);
      return trains;
    } catch (error) {
      console.log('API limit reached or error, using mock data');
      // If API fails (limit reached), use mock data
      const mockResponse = getMockTrainsBetweenStations(source, destination);
      
      const trains = mockResponse.data.map(train => ({
        train_number: train.train_number,
        train_name: train.train_name,
        from: train.from_station.code,
        to: train.to_station.code,
        departure_time: train.departure_time,
        arrival_time: train.arrival_time,
        duration: train.duration,
        available_classes: train.available_classes,
        fares: train.fares,
        running_days: train.running_days
      }));
      
      setLoading(false);
      return trains;
    }
  }

  // Check PNR status with fallback
  async function checkPNRStatus(pnrNumber) {
    setLoading(true);
    trackApiCall('pnrCheck');
    
    try {
      // Try first PNR API
      const response = await getPNRStatusV1(pnrNumber);
      setLoading(false);
      return formatPNRData(response);
    } catch (error1) {
      try {
        // Try second PNR API as fallback
        const response2 = await getPNRStatusV2(pnrNumber);
        setLoading(false);
        return formatPNRDataV2(response2);
      } catch (error2) {
        console.log('API limit reached, using mock PNR data');
        // Use mock data if both APIs fail
        const mockResponse = getMockPNRStatus(pnrNumber);
        setLoading(false);
        return formatMockPNRData(mockResponse);
      }
    }
  }

  // Format PNR data from first API
  function formatPNRData(response) {
    return {
      pnrNumber: response.data.pnr_number,
      trainNo: response.data.train_number,
      trainName: response.data.train_name,
      dateOfJourney: response.data.journey_date,
      from: response.data.from_station,
      to: response.data.to_station,
      class: response.data.class,
      quota: response.data.quota,
      totalFare: `₹${response.data.total_fare}`,
      passengers: response.data.passengers.map(p => ({
        name: p.name || 'Passenger',
        age: p.age,
        gender: p.gender,
        status: p.booking_status,
        berth: p.berth_preference || 'Lower'
      })),
      chartStatus: response.data.chart_status || 'NOT PREPARED'
    };
  }

  // Format PNR data from second API
  function formatPNRDataV2(response) {
    return {
      pnrNumber: response.data.pnr,
      trainNo: response.data.train_number,
      trainName: response.data.train_name,
      dateOfJourney: response.data.journey_date,
      from: response.data.from_station,
      to: response.data.to_station,
      class: response.data.class,
      quota: response.data.quota,
      totalFare: `₹${response.data.fare}`,
      passengers: response.data.passengers.map(p => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        status: p.booking_status,
        berth: p.berth_preference
      })),
      chartStatus: response.data.chart_prepared ? 'PREPARED' : 'NOT PREPARED'
    };
  }

  // Format mock PNR data
  function formatMockPNRData(response) {
    return {
      pnrNumber: response.data.pnr_number,
      trainNo: response.data.train_number,
      trainName: response.data.train_name,
      dateOfJourney: response.data.journey_date,
      from: response.data.from_station,
      to: response.data.to_station,
      class: response.data.class,
      quota: response.data.quota,
      totalFare: `₹${response.data.total_fare}`,
      passengers: response.data.passengers.map(p => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        status: p.booking_status,
        berth: p.berth_preference
      })),
      chartStatus: response.data.chart_status
    };
  }

  // Get live train status
  async function getLiveStatus(trainNumber, startDay = 0) {
    setLoading(true);
    trackApiCall('liveStatus');
    
    try {
      const response = await getTrainLiveStatus(trainNumber, startDay);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.log('API limit reached, using mock live status');
      const mockResponse = getMockLiveStatus(trainNumber);
      setLoading(false);
      return mockResponse.data;
    }
  }

  // Check seat availability
  async function checkAvailability(trainNumber, date, classCode, quota, source, destination) {
    setLoading(true);
    trackApiCall('availability');
    
    try {
      const response = await checkSeatAvailability(
        trainNumber, source, destination, date, classCode, quota
      );
      setLoading(false);
      return response.data.availability;
    } catch (error) {
      console.log('API limit reached, using mock availability');
      const mockResponse = getMockAvailability(trainNumber, date, classCode);
      setLoading(false);
      return mockResponse.data.availability;
    }
  }

  // Create a new booking
  async function createBooking(bookingData) {
    if (!currentUser) throw new Error('You must be logged in to book');

    setLoading(true);
    try {
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        userId: currentUser.uid,
        ...bookingData,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        paymentStatus: 'completed',
        cancellationDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      // Update user stats
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        'stats.totalBookings': bookingData.passengers?.length || 1,
        'stats.totalSpent': bookingData.totalFare || 0,
        'stats.rewardPoints': Math.floor((bookingData.totalFare || 0) / 100)
      });

      setLoading(false);
      return bookingRef.id;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }

  // Get user's bookings
  async function getUserBookings() {
    if (!currentUser) return;

    setLoading(true);
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef, 
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const userBookings = [];
      querySnapshot.forEach((doc) => {
        userBookings.push({ id: doc.id, ...doc.data() });
      });
      setBookings(userBookings);
      setLoading(false);
      return userBookings;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }

  // Get booking by ID
  async function getBookingById(bookingId) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      if (bookingDoc.exists()) {
        return { id: bookingDoc.id, ...bookingDoc.data() };
      }
      return null;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Cancel booking
  async function cancelBooking(bookingId) {
    if (!currentUser) throw new Error('You must be logged in');

    setLoading(true);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setLoading(false);
      return true;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }

  // Add to favorite trains
  async function addToFavorites(trainNumber, trainName) {
    if (!currentUser) throw new Error('You must be logged in');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        favoriteTrains: arrayUnion({ trainNumber, trainName, addedAt: serverTimestamp() })
      });
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Remove from favorites
  async function removeFromFavorites(trainNumber) {
    if (!currentUser) throw new Error('You must be logged in');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        favoriteTrains: arrayRemove({ trainNumber })
      });
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  const value = {
    bookings,
    loading,
    error,
    setLoading,
    setError,
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking,
    addToFavorites,
    removeFromFavorites,
    checkPNRStatus,
    searchTrains,
    checkAvailability,
    getLiveStatus,
    apiCalls
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}