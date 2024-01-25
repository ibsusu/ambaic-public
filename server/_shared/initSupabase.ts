
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.PRIVATE_SUPABASE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Access auth admin api
export const sc = supabase;