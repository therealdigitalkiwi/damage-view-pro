import { createClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '@/types/supabase-config';
import { DamageImage } from '@/types/damage-assessment';

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

    return {
      id: row.id?.toString() || `img-${index}`,
      location,
      locationIndex: locationIndices[location],
      totalLocations: locationCounts[location],
      imageName: row[config.columns.fileName] || '',
      imageUrl: row[config.columns.imageLocation] || '',
      description: row[config.columns.description] || '',
      caption: row[config.columns.caption] || '',
      damageDetected: row[config.columns.damageDetected] || '',
      damageScale: row[config.columns.damageLabel] || 'None',
    };
  });

  return images;
}
