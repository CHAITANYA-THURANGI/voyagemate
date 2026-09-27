import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/SupabaseAuthContext'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const CheckTrains = lazy(() => import('./pages/CheckTrains'))
const LiveStatus = lazy(() => import('./pages/LiveStatus'))
const PNR = lazy(() => import('./pages/PNR'))
const Booking = lazy(() => import('./pages/Booking'))
const Payment = lazy(() => import('./pages/Payment'))
const MyBookings = lazy(() => import('./pages/MyBookings'))

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/check-trains" element={<CheckTrains />} />
            <Route path="/live-status" element={<LiveStatus />} />
            <Route path="/pnr" element={<PNR />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App