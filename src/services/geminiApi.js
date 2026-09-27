import axios from 'axios';

// Move API key to environment variables
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Rate limiting and caching
const rateLimiter = new Map();
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT = 10; // 10 requests per minute

const checkRateLimit = (sessionId = 'default') => {
  const now = Date.now();
  const userRequests = rateLimiter.get(sessionId) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  recentRequests.push(now);
  rateLimiter.set(sessionId, recentRequests);
  return true;
};

export const sendMessageToGemini = async (message, conversationHistory = [], sessionId = 'default') => {
  try {
    // Check rate limit
    checkRateLimit(sessionId);
    
    // Check cache
    const cacheKey = `${sessionId}_${message}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.response;
    }
    
    console.log('Sending message to Gemini:', message);
    
    // Validate API key
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not configured');
      return getRailwayAssistantResponse(message);
    }
    
    const contents = [
      ...conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.8,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (response.data.candidates && response.data.candidates[0]) {
      const botResponse = response.data.candidates[0].content.parts[0].text;
      
      // Cache the response
      cache.set(cacheKey, {
        response: botResponse,
        timestamp: Date.now()
      });
      
      return botResponse;
    } else {
      throw new Error('No response from Gemini');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback to rule-based assistant
    if (error.message.includes('Rate limit')) {
      return "I'm receiving too many requests. Please try again in a moment.";
    }
    
    // Use railway assistant as fallback
    return getRailwayAssistantResponse(message);
  }
};

// Clean cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);