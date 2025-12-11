import { SUPABASE_CONFIG } from '@/config/supabase';

export function useSupabaseConfig() {
  const config = SUPABASE_CONFIG;
  
  // Check if config has real values (not empty and not placeholder text)
  const isConfigured = Boolean(
    config.url && 
    config.anonKey && 
    config.tableName && 
    config.url.startsWith('https://') &&
    config.url.includes('.supabase.co') &&
    config.anonKey.length > 50
  );

  return { config, isConfigured, isLoaded: true };
}
