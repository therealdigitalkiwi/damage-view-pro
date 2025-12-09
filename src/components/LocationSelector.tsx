import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LOCATIONS } from '@/types/damage-assessment';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-background">
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent className="bg-background border border-border z-50">
        {LOCATIONS.map((location) => (
          <SelectItem key={location} value={location}>
            {location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
