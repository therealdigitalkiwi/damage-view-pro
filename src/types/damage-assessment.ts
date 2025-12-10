export interface DamageImage {
  id: string;
  location: string;
  locationIndex: number;
  totalLocations: number;
  imageName: string;
  imageUrl: string;
  description: string;
  caption: string;
  damageDetected: string;
  damageScale: DamageScaleType;
}

// Numeric scale 0-5 mapped to labels
export type DamageScaleType = 'None' | 'Minor' | 'Moderate' | 'Serious' | 'Severe' | 'Critical';

export const DAMAGE_SCALE_MAP: Record<number | string, DamageScaleType> = {
  0: 'None',
  1: 'Minor',
  2: 'Moderate',
  3: 'Serious',
  4: 'Severe',
  5: 'Critical',
  'None': 'None',
  'Minor': 'Minor',
  'Moderate': 'Moderate',
  'Serious': 'Serious',
  'Severe': 'Severe',
  'Critical': 'Critical',
};

export const DAMAGE_SCALE_COLORS: Record<DamageScaleType, string> = {
  None: 'bg-emerald-500',
  Minor: 'bg-lime-500',
  Moderate: 'bg-yellow-500',
  Serious: 'bg-orange-500',
  Severe: 'bg-red-500',
  Critical: 'bg-red-700',
};

export interface Job {
  id: string;
  name: string;
  images: DamageImage[];
}

export const LOCATIONS = [
  'Kitchen',
  'Living Room',
  'Master Bedroom',
  'Bathroom',
  'Garage',
  'Basement',
  'Attic',
  'Exterior',
];
