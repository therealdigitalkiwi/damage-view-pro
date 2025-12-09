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
  damageScale: 'None' | 'Minor' | 'Moderate' | 'Severe' | 'Critical';
}

export interface Job {
  id: string;
  name: string;
  images: DamageImage[];
}

export const DAMAGE_SCALE_COLORS: Record<DamageImage['damageScale'], string> = {
  None: 'bg-emerald-500',
  Minor: 'bg-yellow-500',
  Moderate: 'bg-orange-500',
  Severe: 'bg-red-500',
  Critical: 'bg-red-700',
};

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
