import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

// Create client with retry logic
const createSupabaseClient = () => {
  let retries = 3
  let client = null

  while (retries > 0 && !client) {
    try {
      client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storageKey: 'sb-voyagemate-auth-token',
          flowType: 'pkce'
        },
        global: {
          headers: {
            'X-Client-Info': 'voyagemate-web'
          }
        },
        db: {
          schema: 'public'
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      })
    } catch (error) {
      console.error(`Supabase client creation failed (${retries} retries left):`, error)
      retries--
      if (retries === 0) {
        throw error
      }
    }
  }

  return client
}

export const supabase = createSupabaseClient()

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('health_check').select('*').limit(1)
    if (error && error.code !== '42P01') { // Table doesn't exist is OK
      console.error('Supabase connection error:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Supabase connection check failed:', error)
    return false
  }
}