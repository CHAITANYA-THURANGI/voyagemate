import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/SupabaseAuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
// Complete list of Indian railway stations
const STATIONS = [
  // North Zone
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'DLI', name: 'Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'DKZ', name: 'Delhi Kishanganj', city: 'Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'DEC', name: 'Delhi Cantt', city: 'Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'SSB', name: 'Shakur Basti', city: 'Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'ECR' },
  { code: 'LKO', name: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NR' },
  { code: 'ALD', name: 'Allahabad Junction', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'NCR' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NR' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR' },
  { code: 'GWL', name: 'Gwalior', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'NCR' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir', zone: 'NR' },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu and Kashmir', zone: 'NR' },
  { code: 'UHP', name: 'Udhampur', city: 'Udhampur', state: 'Jammu and Kashmir', zone: 'NR' },
  { code: 'CDG', name: 'Chandigarh', city: 'Chandigarh', state: 'Chandigarh', zone: 'NR' },
  { code: 'ASR', name: 'Amritsar', city: 'Amritsar', state: 'Punjab', zone: 'NR' },
  { code: 'LDH', name: 'Ludhiana', city: 'Ludhiana', state: 'Punjab', zone: 'NR' },
  { code: 'JUC', name: 'Jalandhar City', city: 'Jalandhar', state: 'Punjab', zone: 'NR' },
  { code: 'PTA', name: 'Patiala', city: 'Patiala', state: 'Punjab', zone: 'NR' },
  { code: 'UMB', name: 'Ambala Cantt', city: 'Ambala', state: 'Haryana', zone: 'NR' },
  { code: 'JP', name: 'Jaipur', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR' },
  { code: 'JU', name: 'Jodhpur', city: 'Jodhpur', state: 'Rajasthan', zone: 'NWR' },
  { code: 'AII', name: 'Ajmer', city: 'Ajmer', state: 'Rajasthan', zone: 'NWR' },
  { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', zone: 'NWR' },
  { code: 'BKN', name: 'Bikaner', city: 'Bikaner', state: 'Rajasthan', zone: 'NWR' },

  // West Zone
  { code: 'CSTM', name: 'Mumbai CST', city: 'Mumbai', state: 'Maharashtra', zone: 'CR' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR' },
  { code: 'DR', name: 'Dadar', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
  { code: 'PNVL', name: 'Panvel', city: 'Navi Mumbai', state: 'Maharashtra', zone: 'CR' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR' },
  { code: 'NGP', name: 'Nagpur', city: 'Nagpur', state: 'Maharashtra', zone: 'CR' },
  { code: 'NAGPUR', name: 'Nagpur', city: 'Nagpur', state: 'Maharashtra', zone: 'CR' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'JBP', name: 'Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'INDB', name: 'Indore', city: 'Indore', state: 'Madhya Pradesh', zone: 'WR' },
  { code: 'UJN', name: 'Ujjain', city: 'Ujjain', state: 'Madhya Pradesh', zone: 'WR' },
  { code: 'GNC', name: 'Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', zone: 'WR' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR' },
  { code: 'BRC', name: 'Vadodara', city: 'Vadodara', state: 'Gujarat', zone: 'WR' },
  { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', zone: 'WR' },
  { code: 'RJT', name: 'Rajkot', city: 'Rajkot', state: 'Gujarat', zone: 'WR' },
  { code: 'BHUJ', name: 'Bhuj', city: 'Bhuj', state: 'Gujarat', zone: 'WR' },
  { code: 'GOA', name: 'Madgaon', city: 'Goa', state: 'Goa', zone: 'KR' },

  // South Zone
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
  { code: 'KCG', name: 'Kacheguda', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
  { code: 'LPI', name: 'Lingampalli', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
  { code: 'BZA', name: 'Vijayawada', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'SCR' },
  { code: 'VSKP', name: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'ECoR' },
  { code: 'GTL', name: 'Guntakal', city: 'Guntakal', state: 'Andhra Pradesh', zone: 'SCR' },
  { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', zone: 'SCR' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
  { code: 'BNC', name: 'Bengaluru Cantt', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
  { code: 'YNK', name: 'Yelahanka', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
  { code: 'MYS', name: 'Mysore', city: 'Mysore', state: 'Karnataka', zone: 'SWR' },
  { code: 'UBL', name: 'Hubli', city: 'Hubli', state: 'Karnataka', zone: 'SWR' },
  { code: 'BGM', name: 'Belgaum', city: 'Belgaum', state: 'Karnataka', zone: 'SWR' },
  { code: 'MAQ', name: 'Mangalore', city: 'Mangalore', state: 'Karnataka', zone: 'SR' },
  { code: 'UD', name: 'Udupi', city: 'Udupi', state: 'Karnataka', zone: 'KR' },
  { code: 'KAWR', name: 'Karwar', city: 'Karwar', state: 'Karnataka', zone: 'KR' },
  { code: 'CBE', name: 'Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'MDU', name: 'Madurai', city: 'Madurai', state: 'Tamil Nadu', zone: 'SR' },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR' },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala', zone: 'SR' },
  { code: 'CLT', name: 'Kozhikode', city: 'Kozhikode', state: 'Kerala', zone: 'SR' },
  { code: 'PGT', name: 'Palakkad', city: 'Palakkad', state: 'Kerala', zone: 'SR' },

  // East Zone
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
  { code: 'KOAA', name: 'Kolkata', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR' },
  { code: 'CTC', name: 'Cuttack', city: 'Cuttack', state: 'Odisha', zone: 'ECoR' },
  { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha', zone: 'ECoR' },
  { code: 'RNC', name: 'Ranchi', city: 'Ranchi', state: 'Jharkhand', zone: 'SER' },
  { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand', zone: 'SER' },
  { code: 'BKSC', name: 'Bokaro', city: 'Bokaro', state: 'Jharkhand', zone: 'SER' },
  { code: 'DHN', name: 'Dhanbad', city: 'Dhanbad', state: 'Jharkhand', zone: 'ECR' },
  { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar', zone: 'ECR' },
  { code: 'MFP', name: 'Muzaffarpur', city: 'Muzaffarpur', state: 'Bihar', zone: 'ECR' },
  { code: 'DBG', name: 'Darbhanga', city: 'Darbhanga', state: 'Bihar', zone: 'ECR' },

  // North-East Zone
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'NFR' },
  { code: 'DBRG', name: 'Dibrugarh', city: 'Dibrugarh', state: 'Assam', zone: 'NFR' },
  { code: 'NJP', name: 'New Jalpaiguri', city: 'Siliguri', state: 'West Bengal', zone: 'NFR' },
  { code: 'APDJ', name: 'Alipurduar', city: 'Alipurduar', state: 'West Bengal', zone: 'NFR' },
  { code: 'KYQ', name: 'Kamakhya', city: 'Guwahati', state: 'Assam', zone: 'NFR' },
  { code: 'DMV', name: 'Dimapur', city: 'Dimapur', state: 'Nagaland', zone: 'NFR' },
  { code: 'IMF', name: 'Imphal', city: 'Imphal', state: 'Manipur', zone: 'NFR' },
  { code: 'AGTL', name: 'Agartala', city: 'Agartala', state: 'Tripura', zone: 'NFR' },

  // Central Zone
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'JBP', name: 'Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'ET', name: 'Itarsi', city: 'Itarsi', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'KATNI', name: 'Katni', city: 'Katni', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'SGO', name: 'Saugor', city: 'Sagar', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'REWA', name: 'Rewa', city: 'Rewa', state: 'Madhya Pradesh', zone: 'CR' },
  { code: 'SATNA', name: 'Satna', city: 'Satna', state: 'Madhya Pradesh', zone: 'CR' },
].sort((a, b) => a.code.localeCompare(b.code));

// Comprehensive train database with all possible route combinations
const TRAINS_DATABASE = [
  // ============ NORTH TO SOUTH ROUTES ============
  
  // Delhi to Chennai Routes
  {
    id: 1,
    train_number: '12621',
    train_name: 'Tamil Nadu Express',
    from: 'NDLS',
    to: 'MAS',
    departure: '22:15',
    arrival: '06:55',
    duration: '32h 40m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5400, '2A': 3600, '3A': 2400, 'SL': 1200 },
    available_seats: { '1A': 15, '2A': 30, '3A': 60, 'SL': 150 }
  },
  {
    id: 2,
    train_number: '12615',
    train_name: 'Grand Trunk Express',
    from: 'NDLS',
    to: 'MAS',
    departure: '15:45',
    arrival: '20:30',
    duration: '28h 45m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5200, '2A': 3500, '3A': 2300, 'SL': 1150 },
    available_seats: { '1A': 12, '2A': 24, '3A': 48, 'SL': 120 }
  },

  // Delhi to Bangalore Routes
  {
    id: 3,
    train_number: '12627',
    train_name: 'Karnataka Express',
    from: 'NDLS',
    to: 'SBC',
    departure: '19:20',
    arrival: '06:35',
    duration: '35h 15m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5600, '2A': 3800, '3A': 2500, 'SL': 1250 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },
  {
    id: 4,
    train_number: '12649',
    train_name: 'Sampark Kranti Express',
    from: 'NDLS',
    to: 'SBC',
    departure: '11:25',
    arrival: '21:30',
    duration: '34h 05m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Wed', 'Fri'],
    fare: { '1A': 5500, '2A': 3700, '3A': 2450, 'SL': 1225 },
    available_seats: { '1A': 14, '2A': 28, '3A': 56, 'SL': 140 }
  },

  // Delhi to Hyderabad Routes
  {
    id: 5,
    train_number: '12723',
    train_name: 'Telangana Express',
    from: 'NDLS',
    to: 'SC',
    departure: '16:30',
    arrival: '18:45',
    duration: '26h 15m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4800, '2A': 3200, '3A': 2100, 'SL': 1050 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },
  {
    id: 6,
    train_number: '12791',
    train_name: 'Gatimaan Express',
    from: 'NDLS',
    to: 'SC',
    departure: '07:10',
    arrival: '08:45',
    duration: '25h 35m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Tue', 'Thu', 'Sat'],
    fare: { '1A': 4700, '2A': 3100, '3A': 2050, 'SL': 1025 },
    available_seats: { '1A': 12, '2A': 24, '3A': 48, 'SL': 120 }
  },

  // Delhi to Mumbai Routes
  {
    id: 7,
    train_number: '12951',
    train_name: 'Mumbai Rajdhani',
    from: 'NDLS',
    to: 'CSTM',
    departure: '16:25',
    arrival: '08:20',
    duration: '15h 55m',
    classes: ['1A', '2A', '3A'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4800, '2A': 3200, '3A': 2200 },
    available_seats: { '1A': 24, '2A': 48, '3A': 96 }
  },
  {
    id: 8,
    train_number: '12953',
    train_name: 'August Kranti Rajdhani',
    from: 'NDLS',
    to: 'CSTM',
    departure: '17:40',
    arrival: '09:55',
    duration: '16h 15m',
    classes: ['1A', '2A', '3A'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4800, '2A': 3200, '3A': 2200 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80 }
  },
  {
    id: 9,
    train_number: '12957',
    train_name: 'Swarna Jayanti Rajdhani',
    from: 'NDLS',
    to: 'CSTM',
    departure: '18:50',
    arrival: '10:50',
    duration: '16h 00m',
    classes: ['1A', '2A', '3A'],
    days: ['Mon', 'Wed', 'Fri'],
    fare: { '1A': 4800, '2A': 3200, '3A': 2200 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72 }
  },

  // Delhi to Kolkata Routes
  {
    id: 10,
    train_number: '12301',
    train_name: 'Howrah Rajdhani',
    from: 'NDLS',
    to: 'HWH',
    departure: '16:50',
    arrival: '10:05',
    duration: '17h 15m',
    classes: ['1A', '2A', '3A'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5200, '2A': 3500, '3A': 2400 },
    available_seats: { '1A': 22, '2A': 44, '3A': 88 }
  },
  {
    id: 11,
    train_number: '12305',
    train_name: 'Howrah Express',
    from: 'NDLS',
    to: 'HWH',
    departure: '08:35',
    arrival: '06:45',
    duration: '22h 10m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4500, '2A': 3000, '3A': 2000, 'SL': 900 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },
  {
    id: 12,
    train_number: '12381',
    train_name: 'Poorva Express',
    from: 'NDLS',
    to: 'HWH',
    departure: '08:35',
    arrival: '06:45',
    duration: '22h 10m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Wed', 'Fri', 'Sat'],
    fare: { '1A': 4500, '2A': 3000, '3A': 2000, 'SL': 900 },
    available_seats: { '1A': 14, '2A': 28, '3A': 56, 'SL': 140 }
  },

  // Delhi to Lucknow Routes
  {
    id: 13,
    train_number: '12229',
    train_name: 'Lucknow Mail',
    from: 'NDLS',
    to: 'LKO',
    departure: '21:55',
    arrival: '07:30',
    duration: '9h 35m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2800, '2A': 1800, '3A': 1200, 'SL': 600 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },
  {
    id: 14,
    train_number: '12553',
    train_name: 'Vaishali Express',
    from: 'NDLS',
    to: 'LKO',
    departure: '14:35',
    arrival: '23:45',
    duration: '9h 10m',
    classes: ['2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '2A': 1700, '3A': 1100, 'SL': 550 },
    available_seats: { '2A': 35, '3A': 70, 'SL': 175 }
  },

  // Delhi to Jaipur Routes
  {
    id: 15,
    train_number: '12915',
    train_name: 'Shatabdi Express',
    from: 'NDLS',
    to: 'JP',
    departure: '06:05',
    arrival: '10:35',
    duration: '4h 30m',
    classes: ['CC', 'EC'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { 'CC': 800, 'EC': 1500 },
    available_seats: { 'CC': 78, 'EC': 56 }
  },
  {
    id: 16,
    train_number: '12985',
    train_name: 'Jaipur Express',
    from: 'NDLS',
    to: 'JP',
    departure: '17:20',
    arrival: '22:25',
    duration: '5h 05m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2200, '2A': 1400, '3A': 900, 'SL': 450 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // Delhi to Amritsar Routes
  {
    id: 17,
    train_number: '12013',
    train_name: 'Shatabdi Express',
    from: 'NDLS',
    to: 'ASR',
    departure: '07:40',
    arrival: '13:55',
    duration: '6h 15m',
    classes: ['CC', 'EC'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { 'CC': 900, 'EC': 1600 },
    available_seats: { 'CC': 78, 'EC': 56 }
  },
  {
    id: 18,
    train_number: '12413',
    train_name: 'Amritsar Express',
    from: 'NDLS',
    to: 'ASR',
    departure: '22:30',
    arrival: '05:15',
    duration: '6h 45m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2500, '2A': 1600, '3A': 1000, 'SL': 500 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },

  // ============ MUMBAI ROUTES ============

  // Mumbai to Delhi (already covered above)

  // Mumbai to Bangalore Routes
  {
    id: 19,
    train_number: '12619',
    train_name: 'Matsyagandha Express',
    from: 'CSTM',
    to: 'SBC',
    departure: '14:35',
    arrival: '16:50',
    duration: '26h 15m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4800, '2A': 3200, '3A': 2100, 'SL': 1050 },
    available_seats: { '1A': 15, '2A': 30, '3A': 60, 'SL': 150 }
  },
  {
    id: 20,
    train_number: '16529',
    train_name: 'Udyan Express',
    from: 'CSTM',
    to: 'SBC',
    departure: '08:45',
    arrival: '12:20',
    duration: '27h 35m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4700, '2A': 3100, '3A': 2050, 'SL': 1025 },
    available_seats: { '1A': 14, '2A': 28, '3A': 56, 'SL': 140 }
  },

  // Mumbai to Chennai Routes
  {
    id: 21,
    train_number: '11027',
    train_name: 'Chennai Mail',
    from: 'CSTM',
    to: 'MAS',
    departure: '14:10',
    arrival: '16:35',
    duration: '26h 25m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4900, '2A': 3300, '3A': 2200, 'SL': 1100 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },
  {
    id: 22,
    train_number: '12163',
    train_name: 'Chennai Express',
    from: 'CSTM',
    to: 'MAS',
    departure: '21:35',
    arrival: '00:30',
    duration: '26h 55m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Wed', 'Fri'],
    fare: { '1A': 4800, '2A': 3200, '3A': 2100, 'SL': 1050 },
    available_seats: { '1A': 12, '2A': 24, '3A': 48, 'SL': 120 }
  },

  // Mumbai to Kolkata Routes
  {
    id: 23,
    train_number: '12321',
    train_name: 'Howrah Mail',
    from: 'CSTM',
    to: 'HWH',
    departure: '21:55',
    arrival: '04:45',
    duration: '30h 50m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5200, '2A': 3500, '3A': 2400, 'SL': 1200 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },
  {
    id: 24,
    train_number: '12809',
    train_name: 'Howrah Express',
    from: 'CSTM',
    to: 'HWH',
    departure: '13:40',
    arrival: '21:00',
    duration: '31h 20m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5100, '2A': 3400, '3A': 2300, 'SL': 1150 },
    available_seats: { '1A': 15, '2A': 30, '3A': 60, 'SL': 150 }
  },

  // Mumbai to Hyderabad Routes
  {
    id: 25,
    train_number: '12701',
    train_name: 'Hussain Sagar Express',
    from: 'CSTM',
    to: 'SC',
    departure: '21:15',
    arrival: '15:45',
    duration: '18h 30m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3800, '2A': 2500, '3A': 1600, 'SL': 800 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },
  {
    id: 26,
    train_number: '17031',
    train_name: 'Hyderabad Express',
    from: 'CSTM',
    to: 'SC',
    departure: '09:50',
    arrival: '05:10',
    duration: '19h 20m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3700, '2A': 2400, '3A': 1550, 'SL': 775 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },

  // ============ CHENNAI ROUTES ============

  // Chennai to Bangalore Routes
  {
    id: 27,
    train_number: '12607',
    train_name: 'Lalbagh Express',
    from: 'MAS',
    to: 'SBC',
    departure: '14:50',
    arrival: '22:00',
    duration: '7h 10m',
    classes: ['CC', '2S'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { 'CC': 800, '2S': 400 },
    available_seats: { 'CC': 78, '2S': 120 }
  },
  {
    id: 28,
    train_number: '12609',
    train_name: 'Kaveri Express',
    from: 'MAS',
    to: 'SBC',
    departure: '19:30',
    arrival: '05:30',
    duration: '10h 00m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2400, '2A': 1600, '3A': 1000, 'SL': 500 },
    available_seats: { '1A': 15, '2A': 30, '3A': 60, 'SL': 150 }
  },
  {
    id: 29,
    train_number: '12657',
    train_name: 'Bangalore Mail',
    from: 'MAS',
    to: 'SBC',
    departure: '22:50',
    arrival: '07:40',
    duration: '8h 50m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2300, '2A': 1500, '3A': 950, 'SL': 475 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // Chennai to Hyderabad Routes
  {
    id: 30,
    train_number: '12603',
    train_name: 'Hyderabad Express',
    from: 'MAS',
    to: 'SC',
    departure: '14:15',
    arrival: '06:15',
    duration: '16h 00m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3200, '2A': 2100, '3A': 1400, 'SL': 700 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },
  {
    id: 31,
    train_number: '12759',
    train_name: 'Charminar Express',
    from: 'MAS',
    to: 'SC',
    departure: '17:35',
    arrival: '09:15',
    duration: '15h 40m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3100, '2A': 2000, '3A': 1350, 'SL': 675 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },

  // Chennai to Kolkata Routes
  {
    id: 32,
    train_number: '12839',
    train_name: 'Howrah Mail',
    from: 'MAS',
    to: 'HWH',
    departure: '17:45',
    arrival: '05:30',
    duration: '35h 45m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5800, '2A': 3800, '3A': 2500, 'SL': 1250 },
    available_seats: { '1A': 15, '2A': 30, '3A': 60, 'SL': 150 }
  },
  {
    id: 33,
    train_number: '12841',
    train_name: 'Coromandel Express',
    from: 'MAS',
    to: 'HWH',
    departure: '09:20',
    arrival: '19:35',
    duration: '34h 15m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 5700, '2A': 3700, '3A': 2450, 'SL': 1225 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // ============ BANGALORE ROUTES ============

  // Bangalore to Hyderabad Routes
  {
    id: 34,
    train_number: '16593',
    train_name: 'Nanded Express',
    from: 'SBC',
    to: 'SC',
    departure: '16:50',
    arrival: '05:40',
    duration: '12h 50m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2800, '2A': 1800, '3A': 1200, 'SL': 600 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },
  {
    id: 35,
    train_number: '12735',
    train_name: 'Yesvantpur Express',
    from: 'SBC',
    to: 'SC',
    departure: '20:50',
    arrival: '09:00',
    duration: '12h 10m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Wed', 'Fri'],
    fare: { '1A': 2700, '2A': 1700, '3A': 1150, 'SL': 575 },
    available_seats: { '1A': 14, '2A': 28, '3A': 56, 'SL': 140 }
  },

  // Bangalore to Mysore Routes
  {
    id: 36,
    train_number: '16235',
    train_name: 'Mysore Express',
    from: 'SBC',
    to: 'MYS',
    departure: '06:45',
    arrival: '09:15',
    duration: '2h 30m',
    classes: ['CC', '2S'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { 'CC': 300, '2S': 150 },
    available_seats: { 'CC': 78, '2S': 120 }
  },
  {
    id: 37,
    train_number: '16217',
    train_name: 'Mysore Express',
    from: 'SBC',
    to: 'MYS',
    departure: '17:30',
    arrival: '20:10',
    duration: '2h 40m',
    classes: ['CC', '2S'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { 'CC': 300, '2S': 150 },
    available_seats: { 'CC': 78, '2S': 120 }
  },

  // ============ HYDERABAD ROUTES ============

  // Hyderabad to Tirupati Routes
  {
    id: 38,
    train_number: '12794',
    train_name: 'Rayalaseema Express',
    from: 'SC',
    to: 'TPTY',
    departure: '17:17',
    arrival: '22:45',
    duration: '5h 28m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2400, '2A': 1800, '3A': 1200, 'SL': 600 },
    available_seats: { '1A': 24, '2A': 48, '3A': 96, 'SL': 240 }
  },
  {
    id: 39,
    train_number: '17230',
    train_name: 'Sabari Express',
    from: 'SC',
    to: 'TPTY',
    departure: '12:20',
    arrival: '00:00',
    duration: '11h 40m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2400, '2A': 1800, '3A': 1200, 'SL': 600 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },
  {
    id: 40,
    train_number: '20701',
    train_name: 'Vande Bharat Express',
    from: 'SC',
    to: 'TPTY',
    departure: '06:10',
    arrival: '14:35',
    duration: '8h 25m',
    classes: ['EC', 'CC'],
    days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { 'EC': 2400, 'CC': 1500 },
    available_seats: { 'EC': 56, 'CC': 78 }
  },

  // Hyderabad to Vijayawada Routes
  {
    id: 41,
    train_number: '12705',
    train_name: 'Goutami Express',
    from: 'SC',
    to: 'BZA',
    departure: '16:25',
    arrival: '21:20',
    duration: '4h 55m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 1800, '2A': 1200, '3A': 800, 'SL': 400 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },
  {
    id: 42,
    train_number: '12709',
    train_name: 'Simhapuri Express',
    from: 'SC',
    to: 'BZA',
    departure: '21:40',
    arrival: '02:30',
    duration: '4h 50m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 1700, '2A': 1100, '3A': 750, 'SL': 375 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // ============ KOLKATA ROUTES ============

  // Kolkata to Bhubaneswar Routes
  {
    id: 43,
    train_number: '12821',
    train_name: 'Dhauli Express',
    from: 'HWH',
    to: 'BBS',
    departure: '08:40',
    arrival: '14:50',
    duration: '6h 10m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 1800, '2A': 1200, '3A': 800, 'SL': 400 },
    available_seats: { '1A': 22, '2A': 44, '3A': 88, 'SL': 220 }
  },
  {
    id: 44,
    train_number: '12837',
    train_name: 'Howrah-Puri Express',
    from: 'HWH',
    to: 'PURI',
    departure: '22:10',
    arrival: '06:45',
    duration: '8h 35m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2000, '2A': 1300, '3A': 850, 'SL': 425 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },

  // Kolkata to Guwahati Routes
  {
    id: 45,
    train_number: '12513',
    train_name: 'Guwahati Express',
    from: 'HWH',
    to: 'GHY',
    departure: '12:15',
    arrival: '08:45',
    duration: '20h 30m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3800, '2A': 2500, '3A': 1600, 'SL': 800 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },
  {
    id: 46,
    train_number: '15639',
    train_name: 'Purvottar Express',
    from: 'HWH',
    to: 'GHY',
    departure: '17:35',
    arrival: '16:30',
    duration: '22h 55m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Thu', 'Sat'],
    fare: { '1A': 3700, '2A': 2400, '3A': 1550, 'SL': 775 },
    available_seats: { '1A': 14, '2A': 28, '3A': 56, 'SL': 140 }
  },

  // ============ GUWAHATI ROUTES ============

  // Guwahati to Dibrugarh Routes
  {
    id: 47,
    train_number: '12423',
    train_name: 'Rajdhani Express',
    from: 'GHY',
    to: 'DBRG',
    departure: '13:50',
    arrival: '22:45',
    duration: '8h 55m',
    classes: ['1A', '2A', '3A'],
    days: ['Tue', 'Thu', 'Sat', 'Sun'],
    fare: { '1A': 2800, '2A': 1800, '3A': 1200 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72 }
  },
  {
    id: 48,
    train_number: '15901',
    train_name: 'Dibrugarh Express',
    from: 'GHY',
    to: 'DBRG',
    departure: '06:30',
    arrival: '16:15',
    duration: '9h 45m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2600, '2A': 1700, '3A': 1100, 'SL': 550 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },

  // ============ ADDITIONAL POPULAR ROUTES ============

  // Pune to Bangalore Routes
  {
    id: 49,
    train_number: '16529',
    train_name: 'Udyan Express',
    from: 'PUNE',
    to: 'SBC',
    departure: '08:45',
    arrival: '12:20',
    duration: '27h 35m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4200, '2A': 2800, '3A': 1800, 'SL': 900 },
    available_seats: { '1A': 15, '2A': 30, '3A': 60, 'SL': 150 }
  },

  // Ahmedabad to Mumbai Routes
  {
    id: 50,
    train_number: '12901',
    train_name: 'Gujarat Mail',
    from: 'ADI',
    to: 'CSTM',
    departure: '22:00',
    arrival: '06:25',
    duration: '8h 25m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2800, '2A': 1800, '3A': 1200, 'SL': 600 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },
  {
    id: 51,
    train_number: '12931',
    train_name: 'Ahmedabad Express',
    from: 'ADI',
    to: 'CSTM',
    departure: '23:40',
    arrival: '07:55',
    duration: '8h 15m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2700, '2A': 1700, '3A': 1150, 'SL': 575 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // Jaipur to Mumbai Routes
  {
    id: 52,
    train_number: '12955',
    train_name: 'Jaipur Express',
    from: 'JP',
    to: 'CSTM',
    departure: '05:55',
    arrival: '07:15',
    duration: '25h 20m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 4200, '2A': 2800, '3A': 1800, 'SL': 900 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },

  // Lucknow to Delhi Routes
  {
    id: 53,
    train_number: '12229',
    train_name: 'Lucknow Mail',
    from: 'LKO',
    to: 'NDLS',
    departure: '21:55',
    arrival: '07:30',
    duration: '9h 35m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2800, '2A': 1800, '3A': 1200, 'SL': 600 },
    available_seats: { '1A': 22, '2A': 44, '3A': 88, 'SL': 220 }
  },

  // Patna to Delhi Routes
  {
    id: 54,
    train_number: '12309',
    train_name: 'Rajdhani Express',
    from: 'PNBE',
    to: 'NDLS',
    departure: '16:30',
    arrival: '06:25',
    duration: '13h 55m',
    classes: ['1A', '2A', '3A'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3800, '2A': 2500, '3A': 1700 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80 }
  },
  {
    id: 55,
    train_number: '12393',
    train_name: 'Sampoorna Kranti',
    from: 'PNBE',
    to: 'NDLS',
    departure: '14:20',
    arrival: '05:10',
    duration: '14h 50m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3600, '2A': 2400, '3A': 1600, 'SL': 800 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // Jammu to Delhi Routes
  {
    id: 56,
    train_number: '12425',
    train_name: 'Jammu Rajdhani',
    from: 'JAT',
    to: 'NDLS',
    departure: '19:40',
    arrival: '07:20',
    duration: '11h 40m',
    classes: ['1A', '2A', '3A'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3200, '2A': 2100, '3A': 1400 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72 }
  },
  {
    id: 57,
    train_number: '12413',
    train_name: 'Jammu Express',
    from: 'JAT',
    to: 'NDLS',
    departure: '22:30',
    arrival: '10:30',
    duration: '12h 00m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3000, '2A': 2000, '3A': 1300, 'SL': 650 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },

  // Coimbatore to Chennai Routes
  {
    id: 58,
    train_number: '12671',
    train_name: 'Nilgiri Express',
    from: 'CBE',
    to: 'MAS',
    departure: '20:35',
    arrival: '05:10',
    duration: '8h 35m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2200, '2A': 1400, '3A': 900, 'SL': 450 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // Madurai to Chennai Routes
  {
    id: 59,
    train_number: '12635',
    train_name: 'Vaigai Express',
    from: 'MDU',
    to: 'MAS',
    departure: '06:10',
    arrival: '14:25',
    duration: '8h 15m',
    classes: ['CC', '2S'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { 'CC': 700, '2S': 350 },
    available_seats: { 'CC': 78, '2S': 120 }
  },

  // Trivandrum to Chennai Routes
  {
    id: 60,
    train_number: '12695',
    train_name: 'Trivandrum Express',
    from: 'TVC',
    to: 'MAS',
    departure: '16:45',
    arrival: '09:15',
    duration: '16h 30m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3400, '2A': 2200, '3A': 1500, 'SL': 750 },
    available_seats: { '1A': 16, '2A': 32, '3A': 64, 'SL': 160 }
  },

  // Bhopal to Delhi Routes
  {
    id: 61,
    train_number: '12723',
    train_name: 'Bhopal Express',
    from: 'BPL',
    to: 'NDLS',
    departure: '17:45',
    arrival: '06:30',
    duration: '12h 45m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 3000, '2A': 2000, '3A': 1300, 'SL': 650 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // Nagpur to Mumbai Routes
  {
    id: 62,
    train_number: '12105',
    train_name: 'Vidarbha Express',
    from: 'NGP',
    to: 'CSTM',
    departure: '20:25',
    arrival: '06:35',
    duration: '10h 10m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2600, '2A': 1700, '3A': 1100, 'SL': 550 },
    available_seats: { '1A': 20, '2A': 40, '3A': 80, 'SL': 200 }
  },

  // Visakhapatnam to Howrah Routes
  {
    id: 63,
    train_number: '12839',
    train_name: 'Howrah Mail',
    from: 'VSKP',
    to: 'HWH',
    departure: '17:45',
    arrival: '05:30',
    duration: '11h 45m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 2800, '2A': 1800, '3A': 1200, 'SL': 600 },
    available_seats: { '1A': 18, '2A': 36, '3A': 72, 'SL': 180 }
  },

  // Vijayawada to Secunderabad Routes
  {
    id: 64,
    train_number: '12705',
    train_name: 'Goutami Express',
    from: 'BZA',
    to: 'SC',
    departure: '21:20',
    arrival: '02:15',
    duration: '4h 55m',
    classes: ['1A', '2A', '3A', 'SL'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fare: { '1A': 1800, '2A': 1200, '3A': 800, 'SL': 400 },
    available_seats: { '1A': 22, '2A': 44, '3A': 88, 'SL': 220 }
  }
];

function CheckTrains() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [fromStation, setFromStation] = useState('')
  const [toStation, setToStation] = useState('')
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [journeyDate, setJourneyDate] = useState('')
  const [trains, setTrains] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [selectedFromStation, setSelectedFromStation] = useState(null)
  const [selectedToStation, setSelectedToStation] = useState(null)

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

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (!fromStation || !toStation) {
      setError('Please select both source and destination stations')
      return
    }

    if (fromStation === toStation) {
      setError('Source and destination cannot be the same')
      return
    }

    if (!journeyDate) {
      setError('Please select journey date')
      return
    }

    setLoading(true)
    setError('')
    setSearched(true)

    // Filter trains from database
    setTimeout(() => {
      const filteredTrains = TRAINS_DATABASE.filter(train => 
        train.from === fromStation && train.to === toStation
      )
      setTrains(filteredTrains)
      if (filteredTrains.length === 0) {
        setError('No trains found for this route. Please try different stations.')
      }
      setLoading(false)
    }, 1000)
  }

  const handleBookNow = (train) => {
  if (!user) {
    navigate('/login', { 
      state: { 
        from: { 
          pathname: '/booking',
          state: { train, fromStation: selectedFromStation, toStation: selectedToStation, journeyDate }
        }
      } 
    })
    return
  }
  
  navigate('/booking', { 
    state: { 
      train, 
      fromStation: selectedFromStation || { code: fromStation, name: fromStation },
      toStation: selectedToStation || { code: toStation, name: toStation },
      journeyDate 
    } 
  })
}

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">Find Trains</h1>
            <p className="text-indigo-100 mt-1">Search for trains between stations</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* From Station with Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Station
                  </label>
                  <input
                    type="text"
                    value={fromStation}
                    onChange={handleFromChange}
                    onFocus={() => setShowFromDropdown(true)}
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
                          onClick={() => selectFromStation(station)}
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

                {/* To Station with Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Station
                  </label>
                  <input
                    type="text"
                    value={toStation}
                    onChange={handleToChange}
                    onFocus={() => setShowToDropdown(true)}
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
                          onClick={() => selectToStation(station)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Journey Date
                  </label>
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {journeyDate && (
                    <p className="text-xs text-gray-500 mt-1">{formatDate(journeyDate)}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                >
                  {loading ? 'Searching...' : 'Search Trains'}
                </button>
              </div>
            </form>

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {searched && !loading && trains.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Available Trains from {fromStation} to {toStation}
                </h2>
                
                <div className="space-y-4">
                  {trains.map((train) => (
                    <div key={train.id} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-indigo-700">{train.train_name}</h3>
                            <span className="text-sm text-gray-500">({train.train_number})</span>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full ml-2">
                              Available
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-800">{train.departure}</p>
                              <p className="text-xs text-gray-600">{train.from}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">{train.duration}</p>
                              <div className="w-20 h-0.5 bg-gray-300 my-1"></div>
                              <p className="text-xs text-gray-400">Direct</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-800">{train.arrival}</p>
                              <p className="text-xs text-gray-600">{train.to}</p>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Available Classes</p>
                              <div className="flex flex-wrap gap-1">
                                {train.classes.map((cls) => (
                                  <span key={cls} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                                    {cls}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Runs On</p>
                              <div className="flex flex-wrap gap-1">
                                {train.days.map((day) => (
                                  <span key={day} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 border-t pt-3">
                            <p className="text-xs text-gray-500 mb-2">Fare Details</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {Object.entries(train.fare).map(([cls, price]) => (
                                <div key={cls} className="bg-gray-50 p-2 rounded text-center">
                                  <p className="text-xs font-medium">{cls}</p>
                                  <p className="text-sm font-bold text-green-600">₹{price}</p>
                                  <p className="text-xs text-gray-500">{train.available_seats[cls]} seats</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookNow(train)}
                          className="ml-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-medium"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searched && !loading && trains.length === 0 && !error && (
              <div className="mt-8 text-center py-8">
                <p className="text-gray-500">No trains found for this route.</p>
                <p className="text-sm text-gray-400 mt-2">Try searching with different stations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckTrains