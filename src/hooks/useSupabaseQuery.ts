import { createClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '@/types/supabase-config';
import { DamageImage, DAMAGE_SCALE_MAP, DamageScaleType } from '@/types/damage-assessment';

function parseDamageScale(value: unknown): DamageScaleType {
  if (value === null || value === undefined) return 'None';
  
  // Handle numeric values (0-5)
  if (typeof value === 'number') {
    return DAMAGE_SCALE_MAP[value] || 'None';
  }
  
  // Handle string values (could be numeric string or label)
  const strValue = String(value).trim();
  const numValue = parseInt(strValue, 10);
  
  if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
    return DAMAGE_SCALE_MAP[numValue];
  }
  
  // Try matching label directly
  if (strValue in DAMAGE_SCALE_MAP) {
    return DAMAGE_SCALE_MAP[strValue as keyof typeof DAMAGE_SCALE_MAP];
  }
  
  return 'None';
}

function parseLocationsArray(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  
  // Handle array directly
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  
  // Handle JSON string
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(Boolean);
      }
    } catch {
      // If not JSON, try comma-separated
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  
  return [];
}

export async function fetchJobFromSupabase(
  jobId: string,
  config: SupabaseConfig
): Promise<DamageImage[]> {
  if (!config.url || !config.anonKey || !config.tableName) {
    throw new Error('Supabase configuration is incomplete');
  }

  const supabase = createClient(config.url, config.anonKey);

  const { data, error } = await supabase
    .from(config.tableName)
    .select('*')
    .eq(config.columns.jobId, jobId);

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map the data using the configured column names
  const images: DamageImage[] = data.map((row, index) => {
    const location = row[config.columns.location] || 'Unknown';
    const locationsArray = parseLocationsArray(row[config.columns.locationsArray]);
    const numberOf = row[config.columns.numberOf] || '';

    return {
      id: row.id?.toString() || `img-${index}`,
      location,
      locationsArray,
      numberOf: String(numberOf),
      imageName: row[config.columns.fileName] || '',
      imageUrl: row[config.columns.imageLocation] || '',
      description: row[config.columns.description] || '',
      caption: row[config.columns.caption] || '',
      observation: row[config.columns.observation] || '',
      damageDetected: row[config.columns.damageDetected] || '',
      damageScale: parseDamageScale(row[config.columns.damageLabel]),
      incObs: row[config.columns.incObs] ?? true,
      incReport: row[config.columns.incReport] ?? false,
    };
  });

  // Sort images by "X of Y" number, falling back to filename
  images.sort((a, b) => {
    // Try to extract number from "X of Y" format
    const numA = parseInt(a.numberOf.match(/^(\d+)/)?.[1] || '0', 10);
    const numB = parseInt(b.numberOf.match(/^(\d+)/)?.[1] || '0', 10);
    
    if (numA !== numB) {
      return numA - numB;
    }
    
    // Fall back to filename comparison
    return a.imageName.localeCompare(b.imageName, undefined, { numeric: true });
  });

  return images;
}

export async function updateImageLocation(
  imageId: string,
  newLocation: string,
  config: SupabaseConfig
): Promise<void> {
  if (!config.url || !config.anonKey || !config.tableName) {
    throw new Error('Supabase configuration is incomplete');
  }

  const supabase = createClient(config.url, config.anonKey);

  const { error } = await supabase
    .from(config.tableName)
    .update({ [config.columns.location]: newLocation })
    .eq('id', imageId);

  if (error) {
    throw new Error(`Failed to update location: ${error.message}`);
  }
}

export async function updateImageToggle(
  imageId: string,
  field: 'incObs' | 'incReport',
  value: boolean,
  config: SupabaseConfig
): Promise<void> {
  if (!config.url || !config.anonKey || !config.tableName) {
    throw new Error('Supabase configuration is incomplete');
  }

  const supabase = createClient(config.url, config.anonKey);
  const columnName = config.columns[field];

  const { error } = await supabase
    .from(config.tableName)
    .update({ [columnName]: value })
    .eq('id', imageId);

  if (error) {
    throw new Error(`Failed to update ${field}: ${error.message}`);
  }
}
