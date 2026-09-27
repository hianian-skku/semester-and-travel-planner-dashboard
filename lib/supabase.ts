import { createClient } from '@supabase/supabase-js'

const defaultUrl = 'https://xhwkeafhbwrlqegdozcr.supabase.co'
const defaultAnonKey = 'sb_publishable_TlW1K_URi2n3wcQ515WfqQ_EPGMiY5y'

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl).trim()
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey).trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

