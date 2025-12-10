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

  // Group by location to calculate totals
  const locationCounts = data.reduce((acc, row) => {
    const loc = row[config.columns.location] || 'Unknown';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationIndices: Record<string, number> = {};

  // Map the data using the configured column names
  const images: DamageImage[] = data.map((row, index) => {
    const location = row[config.columns.location] || 'Unknown';
    locationIndices[location] = (locationIndices[location] || 0) + 1;
    
    // Use numberOf from database if available, otherwise calculate
    const totalFromDb = row[config.columns.numberOf];
    const totalLocations = totalFromDb ? parseInt(String(totalFromDb), 10) || locationCounts[location] : locationCounts[location];

    return {
      id: row.id?.toString() || `img-${index}`,
      location,
      locationIndex: locationIndices[location],
      totalLocations,
      imageName: row[config.columns.fileName] || '',
      imageUrl: row[config.columns.imageLocation] || '',
      description: row[config.columns.description] || '',
      caption: row[config.columns.caption] || '',
      damageDetected: row[config.columns.damageDetected] || '',
      damageScale: parseDamageScale(row[config.columns.damageLabel]),
    };
  });

  return images;
}
