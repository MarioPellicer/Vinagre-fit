import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xnkaydntlbfktxjsseva.supabase.co'
const supabaseAnonKey = 'sb_publishable_gSwD_S6KK1pNsMkNyez50A_pwHUkZIw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función helper para obtener el usuario actual
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Función helper para verificar si es admin
export const isAdmin = (user) => {
  return user?.email === 'admin@admin'
}