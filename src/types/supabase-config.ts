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
    observation: string;
    damageDetected: string;
    damageLabel: string;
    imageLocation: string;
    incObs: string;
    incReport: string;
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
    observation: 'observation',
    damageDetected: 'damage_detected',
    damageLabel: 'damage_label',
    imageLocation: 'image_location',
    incObs: 'inc_obs',
    incReport: 'inc_report',
  },
};

export const CONFIG_STORAGE_KEY = 'supabase-damage-config';
