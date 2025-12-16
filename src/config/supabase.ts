import { SupabaseConfig } from '@/types/supabase-config';

// Hardcoded Supabase configuration - update these values for your project
export const SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://nqoiuxtnwrxowtkrqhla.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb2l1eHRud3J4b3d0a3JxaGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTI1NDIsImV4cCI6MjA3MjE4ODU0Mn0.fsQEaSh6K75Cnds91T6E7WhDW4ifpX8o652gr2ZwpO0',
  tableName: 'image_register_testing',
  columns: {
    jobId: 'job_id',
    propertyAddress: 'property_address',
    location: 'location',
    locationsArray: 'locations_array',
    numberOf: 'of_how_many',
    fileName: 'org_image_name',
    description: 'description',
    caption: 'caption',
    observation: 'observation',
    damageDetected: 'damage_detected',
    damageLabel: 'damage_classification',
    imageLocation: 'image_location',
    incObs: 'inc_obs',
    incReport: 'inc_report',
  },
};
