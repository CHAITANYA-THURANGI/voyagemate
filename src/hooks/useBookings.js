import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/SupabaseAuthContext'

export const useBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Only fetch 10 most recent bookings at a time
  const fetchBookings = async (limit = 10) => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, pnr_number, train_name, train_number, journey_date, from_station, to_station, booking_status, total_fare')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Lazy load full booking details only when needed
  const getBookingDetails = async (bookingId) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    getBookingDetails
  }
}