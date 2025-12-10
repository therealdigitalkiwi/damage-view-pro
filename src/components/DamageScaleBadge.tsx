import { DAMAGE_SCALE_COLORS, DamageScaleType } from '@/types/damage-assessment';
import { cn } from '@/lib/utils';

interface DamageScaleBadgeProps {
  scale: DamageScaleType;
}

export const DamageScaleBadge = ({ scale }: DamageScaleBadgeProps) => {
  const colorClass = DAMAGE_SCALE_COLORS[scale] || DAMAGE_SCALE_COLORS['None'];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm',
        colorClass
      )}
    >
      {scale}
    </span>
  );
};
