import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iockkpwbjidtphcgtplp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvY2trcHdiamlkdHBoY2d0cGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTEwMjMsImV4cCI6MjA5NTgyNzAyM30.vkI65-Rxd6cErUQ7WpkiYH2HErBSPVC0B30X4vEnk5I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
