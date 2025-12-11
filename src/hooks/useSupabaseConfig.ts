import { SUPABASE_CONFIG } from '@/config/supabase';

export function useSupabaseConfig() {
  const config = SUPABASE_CONFIG;
  const isConfigured = Boolean(config.url && config.anonKey && config.tableName && 
    !config.url.includes('your-project') && !config.anonKey.includes('your-anon-key'));

  return { config, isConfigured, isLoaded: true };
}
