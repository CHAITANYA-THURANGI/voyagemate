// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Format time to HH:MM format
export const formatTime = (timeString) => {
  if (!timeString) return ''
  return timeString.substring(0, 5)
}

// Calculate age from date of birth
export const calculateAge = (dob) => {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Generate random PNR number
export const generatePNR = () => {
  return 'PNR' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
}

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone number (10 digits)
export const validatePhone = (phone) => {
  const re = /^\d{10}$/
  return re.test(phone)
}

// Validate PNR (10 digits)
export const validatePNR = (pnr) => {
  const re = /^\d{10}$/
  return re.test(pnr)
}

// Get status color class
export const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'confirmed':
    case 'cnf':
      return 'bg-green-100 text-green-800'
    case 'rac':
      return 'bg-yellow-100 text-yellow-800'
    case 'waiting':
    case 'wl':
      return 'bg-orange-100 text-orange-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get class name from code
export const getClassName = (code) => {
  const classes = {
    '1A': 'First AC',
    '2A': 'Second AC',
    '3A': 'Third AC',
    'SL': 'Sleeper',
    'CC': 'Chair Car',
    'EC': 'Executive Chair Car'
  }
  return classes[code] || code
}

// Get station name from code
export const getStationName = (code) => {
  const stations = {
    'NDLS': 'New Delhi',
    'CSTM': 'Mumbai CST',
    'MAS': 'Chennai Central',
    'HWH': 'Howrah Junction',
    'SBC': 'KSR Bengaluru',
    'SC': 'Secunderabad',
    'TPTY': 'Tirupati',
    'NZB': 'Nizamabad',
    'KCG': 'Kacheguda',
    'MRDW': 'Murdeshwar'
  }
  return stations[code] || code
}

// Calculate duration between two times
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return ''
  
  const start = new Date(`1970-01-01T${startTime}:00`)
  const end = new Date(`1970-01-01T${endTime}:00`)
  
  let diff = (end - start) / (1000 * 60 * 60) // hours
  
  if (diff < 0) diff += 24 // cross midnight
  
  const hours = Math.floor(diff)
  const minutes = Math.round((diff - hours) * 60)
  
  return `${hours}h ${minutes}m`
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Capitalize first letter
export const capitalizeFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Get greeting based on time
export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}