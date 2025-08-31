import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '../../.env.development' });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to get user from JWT token
export async function getUserFromToken(token: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

// Helper function to verify session
export async function verifySession(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const user = await getUserFromToken(token);
  
  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email || '',
    },
  };
}
