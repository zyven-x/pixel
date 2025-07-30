import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bftyqxmxngfawxkfpavx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdHlxeG14bmdmYXd4a2ZwYXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Njg3NzksImV4cCI6MjA2ODI0NDc3OX0.FjFjYBkcveSQDZvLD8Qm5m8Azi6vhqmnaIjEyYWndPQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
