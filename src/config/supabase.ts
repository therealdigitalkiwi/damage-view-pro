import { SupabaseConfig } from '@/types/supabase-config';

// Hardcoded Supabase configuration - update these values for your project
export const SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key',
  tableName: 'your_table_name',
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
