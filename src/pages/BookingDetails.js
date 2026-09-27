import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { toast } from '../components/Toast';

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getBookingById, cancelBooking } = useBookings();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (error) {
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      loadBooking();
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Back to My Bookings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Chatbot />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
        </div>

        {/* Booking Status */}
        <div className={`mb-6 p-4 rounded-lg ${
          booking.status === 'confirmed' ? 'bg-green-50 border border-green-200' :
          booking.status === 'cancelled' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Booking Status</p>
              <p className={`text-xl font-bold ${
                booking.status === 'confirmed' ? 'text-green-700' :
                booking.status === 'cancelled' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {booking.status.toUpperCase()}
              </p>
            </div>
            {booking.status === 'confirmed' && new Date(booking.journeyDate) > new Date() && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        {/* Ticket */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">E-Ticket</p>
                <p className="text-2xl font-bold">{booking.trainNumber} • {booking.trainName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">PNR Number</p>
                <p className="text-xl font-mono">{booking.pnrNumber || 'XXXXXXXXXX'}</p>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{booking.departureTime}</p>
                <p className="text-lg font-medium">{booking.from}</p>
                <p className="text-sm text-gray-500">{booking.fromStation || 'Station Name'}</p>
              </div>
              <div className="flex-1 mx-4">
                <p className="text-sm text-gray-500 text-center mb-1">{booking.duration}</p>
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
                <p className="text-3xl font-bold">{booking.arrivalTime}</p>
                <p className="text-lg font-medium">{booking.to}</p>
                <p className="text-sm text-gray-500">{booking.toStation || 'Station Name'}</p>
              </div>
            </div>

            {/* Date and Class */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Date of Journey</p>
                <p className="font-semibold">{booking.journeyDate}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Class</p>
                <p className="font-semibold">{booking.class}</p>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Passenger Details</h3>
              <div className="space-y-3">
                {booking.passengers?.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          Age: {passenger.age} • {passenger.gender} • Berth: {passenger.berth}
                        </p>
                      </div>
                      <span className="text-sm font-mono text-blue-600">
                        {passenger.status || 'GNWL11/WL3'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fare Details */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-3">Fare Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Fare</span>
                  <span>₹{booking.totalFare - 300}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reservation Charges</span>
                  <span>₹60</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Superfast Charges</span>
                  <span>₹90</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST</span>
                  <span>₹150</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total Fare</span>
                  <span className="text-green-600">₹{booking.totalFare}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Print Ticket
              </button>
              <button
                onClick={() => {
                  toast.success('Ticket downloaded successfully');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-bold text-yellow-800 mb-2">Important Information</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Please carry a valid ID proof during the journey.</li>
            <li>• Report at the station at least 2 hours before departure.</li>
            <li>• Platform number will be announced 2 hours before departure.</li>
            <li>• For cancellation requests, charges apply as per IRCTC rules.</li>
            <li>• Refunds will be processed within 5-7 working days.</li>
          </ul>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? Cancellation charges may apply.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <span className="font-bold">Refund Amount:</span> ₹{Math.floor(booking.totalFare * 0.75)} 
                (After deduction of cancellation charges)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default BookingDetails;