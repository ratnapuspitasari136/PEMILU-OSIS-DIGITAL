import { createClient } from '@supabase/supabase-js'

// Ambil alamat & kunci dari file .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Buat "kabel" penghubung ke Supabase, dipakai di seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseKey)