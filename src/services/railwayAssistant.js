// Railway Assistant - Intelligent rule-based chatbot for Indian Railways
// No API key needed - works immediately!

// Comprehensive knowledge base for Indian Railways
const railwayKnowledge = {
  // Train schedules and routes
  trains: {
    'SC to TPTY': [
      { number: '12794', name: 'Rayalaseema Express', departure: '17:17', arrival: '22:45', duration: '5h 28m', classes: ['1A', '2A', '3A', 'SL'] },
      { number: '17230', name: 'Sabari Express', departure: '12:20', arrival: '00:00', duration: '11h 40m', classes: ['1A', '2A', '3A', 'SL'] }
    ],
    'NDLS to CSTM': [
      { number: '12951', name: 'Mumbai Rajdhani', departure: '16:25', arrival: '08:20', duration: '15h 55m', classes: ['1A', '2A', '3A'] },
      { number: '12309', name: 'Rajdhani Express', departure: '16:00', arrival: '08:15', duration: '16h 15m', classes: ['1A', '2A', '3A'] }
    ],
    'MAS to SBC': [
      { number: '12607', name: 'Lalbagh Express', departure: '14:50', arrival: '22:00', duration: '7h 10m', classes: ['CC', '2S'] }
    ],
    'HWH to NDLS': [
      { number: '12301', name: 'Howrah Rajdhani', departure: '16:50', arrival: '10:05', duration: '17h 15m', classes: ['1A', '2A', '3A'] }
    ]
  },

  // PNR status explanations
  pnr: {
    'confirmed': 'Confirmed ticket - your seat is guaranteed.',
    'rac': 'RAC (Reservation Against Cancellation) - you can board the train, seat will be shared.',
    'wl': 'Waitlist - if tickets get cancelled, you may get confirmation.',
    'gnwl': 'GNWL (General Waitlist) - general quota waitlist.',
    'pqwl': 'PQWL (Pooled Quota Waitlist) - for intermediate stations.',
    'ck': 'CK (Charting) - chart has been prepared.'
  },

  // Booking information
  booking: {
    'tatkal': 'Tatkal booking opens at 10:00 AM for AC classes and 11:00 AM for non-AC classes, one day before journey.',
    'premium tatkal': 'Premium Tatkal fares are dynamic and higher than regular Tatkal.',
    'general': 'General quota booking opens 120 days in advance at 8:00 AM.',
    'ladies': 'Ladies quota available in select trains - 6 berths per coach.',
    'senior citizen': 'Senior citizen quota available for ages 60+ (men) and 58+ (women) with fare concession.'
  },

  // Cancellation rules
  cancellation: {
    'confirmed': 'Confirmed tickets: Cancellation charges apply based on time of cancellation.',
    'waitlist': 'Waitlisted tickets: Full refund if cancelled before chart preparation.',
    'tatkal': 'Tatkal tickets: No cancellation allowed, only refund of fare minus cancellation charges.'
  },

  // Station codes
  stations: {
    'NDLS': 'New Delhi',
    'CSTM': 'Mumbai CST',
    'MAS': 'Chennai Central',
    'HWH': 'Howrah Junction',
    'SBC': 'KSR Bengaluru',
    'SC': 'Secunderabad Junction',
    'TPTY': 'Tirupati',
    'NZB': 'Nizamabad',
    'BCT': 'Mumbai Central',
    'PNBE': 'Patna Junction',
    'LKO': 'Lucknow',
    'JP': 'Jaipur',
    'ADI': 'Ahmedabad Junction'
  },

  // General FAQs
  faqs: [
    {
      question: 'how to check pnr status',
      answer: 'To check PNR status:\n1. Go to the PNR Status page\n2. Enter your 10-digit PNR number\n3. Click "Check Status"\n\nYou can also use the quick PNR check in the Live Status section.'
    },
    {
      question: 'how to book ticket',
      answer: 'To book a ticket:\n1. Go to Check Trains page\n2. Enter source and destination stations\n3. Select journey date\n4. Choose a train\n5. Add passenger details\n6. Make payment\n\nYour ticket will be sent to your email!'
    },
    {
      question: 'what is tatkal',
      answer: 'Tatkal is a premium booking scheme for last-minute travel:\n• Opens at 10:00 AM (AC classes) and 11:00 AM (non-AC)\n• Available one day before journey\n• Higher fares than general quota\n• Limited seats per train'
    },
    {
      question: 'cancellation charges',
      answer: 'Cancellation charges depend on when you cancel:\n• >48 hours before: ₹60-180 + GST\n• 48-12 hours before: 25% of fare\n• <12 hours before: 50% of fare\n• Waitlisted: Full refund if cancelled before chart'
    },
    {
      question: 'food in train',
      answer: 'Food options on trains:\n• Pantry cars on many trains\n• Pre-paid meal booking available\n• E-catering services at major stations\n• You can order from IRCTC e-catering'
    },
    {
      question: 'luggage allowance',
      answer: 'Luggage allowance:\n• First AC: 150 kg\n• Second AC: 100 kg\n• Third AC: 80 kg\n• Sleeper: 80 kg\n• Extra luggage can be booked as parcel'
    }
  ]
};

// Find best matching response
const findBestMatch = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Check for train between stations
  for (const [route, trains] of Object.entries(railwayKnowledge.trains)) {
    if (lowerQuery.includes(route.toLowerCase().replace(' to ', ' ')) || 
        lowerQuery.includes(route.toLowerCase())) {
      let response = `🚂 Trains from ${route}:\n\n`;
      trains.forEach(train => {
        response += `• **${train.number}** - ${train.name}\n`;
        response += `  Departure: ${train.departure} | Arrival: ${train.arrival} | Duration: ${train.duration}\n`;
        response += `  Classes: ${train.classes.join(', ')}\n\n`;
      });
      response += 'Would you like to check availability for any of these trains?';
      return response;
    }
  }
  
  // Check for station code queries
  for (const [code, name] of Object.entries(railwayKnowledge.stations)) {
    if (lowerQuery.includes(code.toLowerCase()) || lowerQuery.includes(name.toLowerCase())) {
      return `📍 **${code}** - ${name}\n\nThis is a major railway station. You can find trains to/from this station using the Check Trains page.`;
    }
  }
  
  // Check for PNR related queries
  if (lowerQuery.includes('pnr')) {
    if (lowerQuery.includes('status')) {
      return railwayKnowledge.faqs.find(f => f.question.includes('pnr status')).answer;
    }
    return 'PNR (Passenger Name Record) is your 10-digit ticket number. You can check its status on the PNR Status page.';
  }
  
  // Check for booking queries
  if (lowerQuery.includes('book')) {
    return railwayKnowledge.faqs.find(f => f.question.includes('how to book')).answer;
  }
  
  // Check for tatkal
  if (lowerQuery.includes('tatkal')) {
    return railwayKnowledge.faqs.find(f => f.question.includes('tatkal')).answer;
  }
  
  // Check for cancellation
  if (lowerQuery.includes('cancel')) {
    return railwayKnowledge.faqs.find(f => f.question.includes('cancellation')).answer;
  }
  
  // Check for food
  if (lowerQuery.includes('food') || lowerQuery.includes('eat')) {
    return railwayKnowledge.faqs.find(f => f.question.includes('food')).answer;
  }
  
  // Check for luggage
  if (lowerQuery.includes('luggage') || lowerQuery.includes('baggage') || lowerQuery.includes('weight')) {
    return railwayKnowledge.faqs.find(f => f.question.includes('luggage')).answer;
  }
  
  // Check for class information
  if (lowerQuery.includes('1a') || lowerQuery.includes('first ac')) {
    return '**1A - First AC**: Most luxurious class with private cabins or coupes, carpeted floors, and attached washbasin. Fare includes meals.';
  }
  if (lowerQuery.includes('2a') || lowerQuery.includes('second ac')) {
    return '**2A - Second AC**: Air-conditioned coaches with 4 berths per compartment (2 upper + 2 lower). Curtains provided. Meals included.';
  }
  if (lowerQuery.includes('3a') || lowerQuery.includes('third ac')) {
    return '**3A - Third AC**: Air-conditioned coaches with 6 berths per compartment (3 upper + 3 lower). Meals included.';
  }
  if (lowerQuery.includes('sl') || lowerQuery.includes('sleeper')) {
    return '**SL - Sleeper Class**: Non-AC coaches with 6 berths per compartment (3 upper + 3 lower). Most economical option.';
  }
  
  // No specific match found
  return null;
};

// Main function to get assistant response
export const getRailwayAssistantResponse = (message) => {
  // Greeting detection
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
    return "👋 Hello! I'm your VoyageMate railway assistant. How can I help you with your train journey today? You can ask me about:\n\n• Train schedules (e.g., 'trains from SC to TPTY')\n• PNR status\n• Booking information\n• Tatkal scheme\n• Cancellation rules\n• Station codes\n• Train classes";
  }
  
  if (lowerMsg.includes('thank')) {
    return "You're welcome! 😊 Happy journey! Is there anything else I can help you with?";
  }
  
  if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
    return "Goodbye! Have a safe journey. 🚂 Feel free to come back if you need any help!";
  }
  
  // Try to find a specific match
  const matchedResponse = findBestMatch(message);
  if (matchedResponse) {
    return matchedResponse;
  }
  
  // Default response
  return "I can help you with Indian Railway information including:\n\n" +
         "• **Train schedules** - e.g., 'trains from SC to TPTY'\n" +
         "• **PNR status** - How to check and what codes mean\n" +
         "• **Booking** - Tatkal, general quota, ladies quota\n" +
         "• **Cancellation** - Rules and charges\n" +
         "• **Station codes** - e.g., 'what is NDLS?'\n" +
         "• **Train classes** - 1A, 2A, 3A, SL differences\n\n" +
         "What would you like to know?";
};