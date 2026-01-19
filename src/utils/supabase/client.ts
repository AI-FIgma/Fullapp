import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

// Augment the global scope type to include our supabase instance
declare global {
  var _supabaseInstance: SupabaseClient | undefined;
}

// Singleton pattern to prevent multiple instances during HMR or re-renders
const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Server-side (if applicable) or non-browser env, always create new or handle differently
    return createClient(supabaseUrl, supabaseKey);
  }

  if (!globalThis._supabaseInstance) {
    globalThis._supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  
  return globalThis._supabaseInstance;
};

export const supabase = getSupabaseClient();
