export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
  columns: {
    jobId: string;
    propertyAddress: string;
    location: string;
    locationsArray: string;
    numberOf: string;
    fileName: string;
    description: string;
    caption: string;
    damageDetected: string;
    damageLabel: string;
    imageLocation: string;
  };
}

export const DEFAULT_CONFIG: SupabaseConfig = {
  url: '',
  anonKey: '',
  tableName: '',
  columns: {
    jobId: 'job_id',
    propertyAddress: 'property_address',
    location: 'location',
    locationsArray: 'locations_array',
    numberOf: 'number_of',
    fileName: 'file_name',
    description: 'description',
    caption: 'caption',
    damageDetected: 'damage_detected',
    damageLabel: 'damage_label',
    imageLocation: 'image_location',
  },
};

export const CONFIG_STORAGE_KEY = 'supabase-damage-config';
