import { useState, useEffect } from 'react';
import { SupabaseConfig, DEFAULT_CONFIG, CONFIG_STORAGE_KEY } from '@/types/supabase-config';

export function useSupabaseConfig() {
  const [config, setConfig] = useState<SupabaseConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        setConfig(DEFAULT_CONFIG);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveConfig = (newConfig: SupabaseConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
  };

  const isConfigured = Boolean(config.url && config.anonKey && config.tableName);

  return { config, saveConfig, isConfigured, isLoaded };
}
