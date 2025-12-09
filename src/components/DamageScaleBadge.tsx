import { DamageImage, DAMAGE_SCALE_COLORS } from '@/types/damage-assessment';
import { cn } from '@/lib/utils';

interface DamageScaleBadgeProps {
  scale: DamageImage['damageScale'];
}

export const DamageScaleBadge = ({ scale }: DamageScaleBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white',
        DAMAGE_SCALE_COLORS[scale]
      )}
    >
      {scale}
    </span>
  );
};
